<script setup>
import { useMapStore } from '@/stores/map'
import { ref, nextTick, computed } from 'vue'
import draggable from 'vuedraggable'
import LegendSwatch from '@/components/LegendSwatch.vue' // ← unified legend renderer
import { resolveLegend } from '@/utils/legends'

const mapStore = useMapStore()
const activeOpacityLayer = ref(null)
computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  }
})

// Compact legends (single square / image / hatch / symbol) render on the RIGHT
// side to keep the layer list short. Ramp & discrete legends (which need
// low/high or per-item labels) stay stacked under the checkbox.
const COMPACT_TYPES = ['swatch', 'image', 'hatch', 'symbol']
function isCompactLegend(sublayer) {
  const spec = resolveLegend(sublayer)
  return !!spec && COMPACT_TYPES.includes(spec.type)
}
function isStackedLegend(sublayer) {
  const spec = resolveLegend(sublayer)
  return !!spec && !COMPACT_TYPES.includes(spec.type) // ramp / discrete
}

function normalizeTitle(value = '') {
  return value.trim().toLowerCase()
}

function isDuplicateSubheader(group, layer) {
  return normalizeTitle(group.header) === normalizeTitle(layer.title)
}

function isRadioLayerGroup(layer) {
  return layer.sublayers?.some((sublayer) => sublayer.type === 'radio')
}

function toggleOpacity(sublayer) {
  activeOpacityLayer.value = activeOpacityLayer.value === sublayer.elid ? null : sublayer.elid
}

// takes an element object
async function scrollToElement(layer, elid) {
  mapStore.showHelpPanel = true
  mapStore.selectedHelpSection = layer
  mapStore.activeHelpElement = elid

  await nextTick()

  const waitForElement = (id, timeout = 1500) => {
    const start = performance.now()

    return new Promise((resolve) => {
      const check = () => {
        const found = document.getElementById(id)
        if (found) return resolve(found)
        if (performance.now() - start > timeout) return resolve(null)
        requestAnimationFrame(check)
      }

      check()
    })
  }

  const container = document.querySelector('.detail-content')
  const el = await waitForElement(elid, 1500)

  const top =
    el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop

  container.scrollTo({
    top: top - 20,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="" v-for="(item, groupIndex) in mapStore.layers" :key="item.id || groupIndex">
    <q-expansion-item
      :data-tour="item.header === 'Conservation Values' ? 'cat-conservation' : null"
      v-model="item.expanded"
      @update:model-value="mapStore.setGroupVisibility(item)"
      :label="item.header"
      :header-class="
        item.expanded
          ? 'expandedHeaderClass text-h6 text-weight-light'
          : 'headerClass text-h6 text-weight-light'
      "
      expanded-icon="visibility"
      :expand-icon-class="item.expanded ? 'text-secondary' : 'text-primary'"
      expand-icon="visibility_off"
    >
      <div class="q-mx-sm q-mb-md bg-grey-1">
        <template v-for="(layer, layerIndex) in item.subheaders" :key="layer.id || layerIndex">
          <!-- Duplicate subheader: do not show the redundant subheader checkbox/header. -->
          <div v-if="isDuplicateSubheader(item, layer)">
            <div class="q-px-md q-pt-md">
              <p class="text-caption">{{ layer.subheaderLayerBlurb }}</p>
            </div>
            <q-list v-if="!isRadioLayerGroup(layer)" dense class="q-pb-md">
              <draggable
                v-model="layer.sublayers"
                ghostClass="ghost"
                @end="mapStore.updateLayerOrder(layer)"
                item-key="index"
              >
                <template #item="{ element: sublayer }">
                  <q-item v-if="sublayer.filter" dense class="">
                    <q-item-section side>
                      <q-icon size="xs" name="drag_indicator" />
                    </q-item-section>

                    <q-item-section>
                      <q-checkbox
                        size="xs"
                        v-model="sublayer.visibleModel"
                        @click.stop="
                          mapStore.setSublayerVisibility(sublayer.elid, sublayer.visibleModel)
                        "
                      >
                        {{ sublayer.title }}
                      </q-checkbox>

                      <!-- Stacked legends (ramp / discrete) go under the label -->
                      <LegendSwatch
                        v-if="isStackedLegend(sublayer)"
                        :layer="sublayer"
                        class="legend-inline"
                      />

                      <q-slider
                        v-if="activeOpacityLayer === sublayer.elid"
                        class="q-mt-xs opacity-slider"
                        v-model="sublayer.opacity"
                        :min="0.1"
                        :max="1"
                        :step="0.1"
                        label
                        @update:model-value="
                          mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)
                        "
                      />
                    </q-item-section>

                    <!-- Compact legends (swatch / image / hatch / symbol) on the RIGHT -->
                    <q-item-section side v-if="isCompactLegend(sublayer)">
                      <LegendSwatch :layer="sublayer" :show-labels="false" :size="14" />
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center no-wrap q-gutter-xs">
                        <q-btn
                          size="sm"
                          flat
                          padding="none"
                          icon="o_info"
                          @click.stop="scrollToElement(layer.title, sublayer.elid)"
                        >
                          <q-tooltip>click for layer info</q-tooltip>
                        </q-btn>

                        <q-btn
                          size="sm"
                          flat
                          padding="none"
                          icon="opacity"
                          @click.stop="toggleOpacity(sublayer)"
                        >
                          <q-tooltip>Set opacity</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
              </draggable>
            </q-list>

            <q-list v-else dense class="q-pb-md">
              <p
                class="text-caption text-grey-8 q-px-md text-italic"
                v-if="layer.title == 'Community Considerations'"
              >
                *Click census tract on the map to view summary info
              </p>
              <q-item
                v-for="sublayer in layer.sublayers"
                :key="sublayer.elid"
                v-show="sublayer.filter"
                dense
                @click="
                  layer.title == 'Community Considerations'
                    ? mapStore.changeCommunityStyle(sublayer.style)
                    : mapStore.changeBuildoutLayer(sublayer.title)
                "
              >
                <q-item-section side>
                  <q-radio
                    size="xs"
                    v-model="layer.selection"
                    :val="sublayer.title"
                    @update:model-value="
                      layer.title == 'Community Considerations'
                        ? mapStore.changeCommunityStyle(sublayer.style)
                        : mapStore.changeBuildoutLayer(sublayer.elid)
                    "
                  />
                </q-item-section>

                <q-item-section>
                  <div class="text-body2">{{ sublayer.title }}</div>

                  <LegendSwatch
                    v-if="isStackedLegend(sublayer)"
                    :layer="sublayer"
                    class="legend-inline"
                  />

                  <q-slider
                    v-if="activeOpacityLayer === sublayer.elid"
                    class="q-mt-xs opacity-slider"
                    v-model="sublayer.opacity"
                    :min="0.1"
                    :max="1"
                    :step="0.1"
                    label
                    @update:model-value="
                      mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)
                    "
                  />
                </q-item-section>

                <q-item-section side v-if="isCompactLegend(sublayer)">
                  <LegendSwatch :layer="sublayer" :show-labels="false" :size="14" />
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-btn
                      size="sm"
                      flat
                      padding="none"
                      icon="o_info"
                      @click.stop="scrollToElement(layer.title, sublayer.elid)"
                    >
                      <q-tooltip>click for layer info</q-tooltip>
                    </q-btn>

                    <q-btn
                      size="sm"
                      flat
                      padding="none"
                      icon="opacity"
                      @click.stop="toggleOpacity(sublayer)"
                    >
                      <q-tooltip>Set opacity</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Normal subheader: keep the subheader checkbox/expander. -->
          <div class="" v-if="layer.title == 'Highly Sensitive' || layer.title == 'Highest Quality Farmland'" data-tour="energy-filter">
            <div class="q-px-md q-pt-md" >
              <div>
                <p class="text-caption">{{ layer.subheaderLayerBlurb }}</p>
              </div>
              <div v-if="layer.title == 'Highly Sensitive'" style="border-bottom: 1px solid lightgray" class="q-pb-md q-mb-sm">
              <div class="filter-help text-caption text-italic q-mb-xs q-mt-none">
                *Energy type filters the conservation layers below.
              </div>
              <q-chip
                clickable
                @click="mapStore.filterLayers('wind')"
                :outline="mapStore.category !== 'wind'"
                :color="mapStore.category === 'wind' ? 'green-1' : 'grey-9'"
                :text-color="mapStore.category === 'wind' ? 'green-9' : 'grey-9'"
                class="q-px-sm q-py-xs energy-chip"
              >
                <span class="material-symbols-outlined q-mr-xs" style="font-size: 18px">
                  wind_power
                </span>

                Wind

                <q-icon
                  v-if="mapStore.category === 'wind'"
                  name="check"
                  size="16px"
                  class="q-ml-xs"
                />
              </q-chip>
              <q-chip
                clickable
                @click="mapStore.filterLayers('solar')"
                :outline="mapStore.category !== 'solar'"
                :color="mapStore.category === 'solar' ? 'green-1' : 'grey-9'"
                :text-color="mapStore.category === 'solar' ? 'green-9' : 'grey-9'"
                class="q-px-sm q-py-xs energy-chip"
              >
                <span class="material-symbols-outlined q-mr-xs" style="font-size: 18px">
                  solar_power
                </span>

                Solar

                <q-icon
                  v-if="mapStore.category === 'solar'"
                  name="check"
                  size="16px"
                  class="q-ml-xs"
                />
              </q-chip>
              <q-chip
                clickable
                @click="mapStore.filterLayers('floating solar')"
                :outline="mapStore.category !== 'floating solar'"
                :color="mapStore.category === 'floating solar' ? 'green-1' : 'grey-9'"
                :text-color="mapStore.category === 'floating solar' ? 'green-9' : 'grey-9'"
                class="q-px-sm q-py-xs energy-chip"
              >
                <span class="material-symbols-outlined q-mr-xs" style="font-size: 18px">
                  water_lux
                </span>

                Floating Solar

                <q-icon
                  v-if="mapStore.category === 'floating solar'"
                  name="check"
                  size="16px"
                  class="q-ml-xs"
                />
              </q-chip>
              </div>
            </div>
          </div>

          <q-expansion-item
            v-if="!isDuplicateSubheader(item, layer)"
            v-model="layer.expanded"
            dense
            header-class=""
            expand="true"
          >
            <template #header>
              <div class="self-center">
                <q-checkbox
                  size="xs"
                  v-model="layer.visible"
                  @update:model-value="mapStore.setLayerVisibility(layer)"
                />
              </div>

              <q-item-section>
                <q-item-label class="text-subtitle1">{{ layer.title }}</q-item-label>
              </q-item-section>
            </template>

            <q-list v-if="!isRadioLayerGroup(layer)" dense class="q-pb-md">
              <draggable
                v-model="layer.sublayers"
                ghostClass="ghost"
                @end="mapStore.updateLayerOrder(layer)"
                item-key="index"
              >
                <template #item="{ element: sublayer }">
                  <q-item
                    v-if="sublayer.filter"
                    dense
                    class=""
                    :data-tour="sublayer.elid === 'protectedAreas' ? 'layer-row' : null"
                  >
                    <q-item-section side>
                      <q-icon size="xs" name="drag_indicator" />
                    </q-item-section>

                    <q-item-section>
                      <q-checkbox
                        size="xs"
                        v-model="sublayer.visibleModel"
                        @click.stop="
                          mapStore.setSublayerVisibility(sublayer.elid, sublayer.visibleModel)
                        "
                      >
                        {{ sublayer.title }}
                      </q-checkbox>

                      <LegendSwatch
                        v-if="isStackedLegend(sublayer)"
                        :layer="sublayer"
                        class="legend-inline"
                      />

                      <q-slider
                        v-if="activeOpacityLayer === sublayer.elid"
                        class="q-mt-xs opacity-slider"
                        v-model="sublayer.opacity"
                        :min="0.1"
                        :max="1"
                        :step="0.1"
                        label
                        @update:model-value="
                          mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)
                        "
                      />
                    </q-item-section>

                    <q-item-section side v-if="isCompactLegend(sublayer)">
                      <LegendSwatch :layer="sublayer" :show-labels="false" :size="14" />
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center no-wrap q-gutter-xs">
                        <q-btn
                          size="sm"
                          flat
                          padding="none"
                          icon="o_info"
                          @click.stop="scrollToElement(layer.title, sublayer.elid)"
                        >
                          <q-tooltip>click for layer info</q-tooltip>
                        </q-btn>

                        <q-btn
                          size="sm"
                          flat
                          padding="none"
                          icon="opacity"
                          @click.stop="toggleOpacity(sublayer)"
                        >
                          <q-tooltip>Set opacity</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
              </draggable>
            </q-list>

            <q-list v-else dense class="q-mx-md q-pb-md">
              <q-item
                v-for="sublayer in layer.sublayers"
                :key="sublayer.elid"
                v-show="sublayer.filter"
                dense
                @click="
                  layer.title == 'Community Considerations'
                    ? mapStore.changeCommunityStyle(sublayer.style)
                    : mapStore.changeBuildoutLayer(sublayer.title)
                "
              >
                <q-item-section side>
                  <q-radio
                    size="sm"
                    v-model="mapStore.buildoutSelection"
                    :val="sublayer.title"
                    @update:model-value="
                      layer.title == 'Community Considerations'
                        ? mapStore.changeCommunityStyle(sublayer.style)
                        : mapStore.changeBuildoutLayer(sublayer.title)
                    "
                  />
                </q-item-section>

                <q-item-section>
                  <div class="text-body2">{{ sublayer.title }}</div>

                  <LegendSwatch
                    v-if="isStackedLegend(sublayer)"
                    :layer="sublayer"
                    class="legend-inline"
                  />

                  <q-slider
                    v-if="activeOpacityLayer === sublayer.elid"
                    class="q-mt-xs opacity-slider"
                    v-model="sublayer.opacity"
                    :min="0.1"
                    :max="1"
                    :step="0.1"
                    label
                    @update:model-value="
                      mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)
                    "
                  />
                </q-item-section>

                <q-item-section side v-if="isCompactLegend(sublayer)">
                  <LegendSwatch :layer="sublayer" :show-labels="false" :size="14" />
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-btn
                      size="sm"
                      flat
                      padding="none"
                      icon="o_info"
                      @click.stop="scrollToElement(layer.title, sublayer.elid)"
                    >
                      <q-tooltip>click for layer info</q-tooltip>
                    </q-btn>

                    <q-btn
                      size="sm"
                      flat
                      padding="none"
                      icon="opacity"
                      @click.stop="toggleOpacity(sublayer)"
                    >
                      <q-tooltip>Set opacity</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </template>
      </div>
    </q-expansion-item>
  </div>
</template>

<style>
.energy-chip {
  border: 1px solid #64b45b;
  font-weight: 450;
}

/* indent the stacked (ramp/discrete) legend to line up under the checkbox label */
.legend-inline {
  margin-left: 32px;
  margin-top: 4px;
  margin-bottom: 5px;
}

.opacity-slider {
  max-width: 180px;
  margin-left: 32px;
}
.headerClass {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 4px;
  padding: 14px 16px;
  color: #1a1a1a;
}

.expandedHeaderClass {
  border-left: 3px solid rgb(46, 125, 50); /* Deep green accent */
  border-right: 3px solid rgb(46, 125, 50); /* Deep green accent */
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(46, 125, 50, 0.06);
  margin-bottom: 4px;
  padding: 12px 16px;
  color: #1a1a1a;
}
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
.energy-filter-panel {
  padding: 14px 16px 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #fbfcfb;
}

.filter-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 15px;
  font-weight: 700;
  color: #1f1f1f;
}

.filter-info-icon {
  color: #737373;
}

.filter-help {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.35;
  color: #606060;
}

.energy-filter-buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.energy-filter-btn {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #d7dcd7;
  border-radius: 6px;
  background: #ffffff;
  color: #222;
  font-size: 14px;
  font-weight: 600;
  box-shadow: none;

  .q-icon {
    color: #777;
  }

  &:hover {
    background: #f6faf5;
    border-color: #9fca99;
  }
}

.energy-filter-btn--active {
  background: #eef7ec;
  border-color: #4f9f40;
  color: #1f1f1f;

  .q-icon {
    color: #4f9f40;
  }

  .selected-check {
    color: #4f9f40;
  }
}
</style>
