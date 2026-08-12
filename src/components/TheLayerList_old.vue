r
<script setup>
import { useMapStore } from '@/stores/map'
import { laSolarPanelSolid } from '@quasar/extras/line-awesome'
import { ref, nextTick, computed } from 'vue'
import draggable from 'vuedraggable'

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

function customLegend(sublayer) {
  const legends = {
    bats: {
      type: 'discrete',
      items: [
        {
          label: 'Threatened and endangered species',
          color: '#3f8edc',
        },
        {
          label: 'Non-listed species',
          color: '#8f8f8f',
        },
      ],
    },
    resilientConnected: {
      type: 'discrete',
      items: [
        {
          label: 'Resilient, biodiverse areas',
          color: '#4f8f5b',
        },
        {
          label: 'Connectivity pinchpoints',
          color: '#e58a35',
        },
        {
          label: 'Coastal migration space',
          color: '#d9c47a',
        },
      ],
    },
    cjest_lowincome: {
      type: 'ramp',
      lowLabel: 'Low Income',
      highLabel: 'High Income',
      gradient: 'linear-gradient(to right, #f4edf7, #b56bc7)',
    },
    lassoSolar: {
      type: 'ramp',
      lowLabel: 'Low',
      highLabel: 'High',
      gradient: 'linear-gradient(to right, #e8ecff, #5b6fd6)',
    },
    lassoWind: {
      type: 'ramp',
      lowLabel: 'Low',
      highLabel: 'High',
      gradient: 'linear-gradient(to right, #e8ecff, #5b6fd6)',
    },
    abandonedmines: {
      type: 'symbol',
      shape: 'triangle',
      color: '#c78b2c',
      label: 'Abandoned Mines',
    },
    brownfields: {
      type: 'symbol',
      shape: 'diamond',
      color: '#56b7b1',
      label: 'Brownfields',
    },
  }
  return legends[sublayer.elid] || null
}

function legendImageSrc(sublayer) {
  return `data:image/png;base64,${sublayer.legendImg}`
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
      v-model="item.expanded"
      @update:model-value="mapStore.setGroupVisibility(item)"
      :label="item.header"
      :header-class="
        item.expanded
          ? 'expandedHeaderClass text-h6 text-weight-light'
          : 'headerClass text-h6 text-weight-light'
      "
      expanded-icon="visibility"
      :expand-icon-class="item.expanded ? 'text-primary' : 'text-secondary'"
      expand-icon="visibility_off"
    >
      <div class="q-mx-sm q-mb-md bg-grey-1">
        <template v-for="(layer, layerIndex) in item.subheaders" :key="layer.id || layerIndex">
          <!-- Duplicate subheader: do not show the redundant subheader checkbox/header. -->
          <div v-if="isDuplicateSubheader(item, layer)">
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
                      <div v-if="customLegend(sublayer)?.type === 'ramp'" class="legend-ramp">
                        <span>{{ customLegend(sublayer).lowLabel }}</span>

                        <div
                          class="legend-ramp-bar"
                          :style="{ background: customLegend(sublayer).gradient }"
                        />

                        <span>{{ customLegend(sublayer).highLabel }}</span>
                      </div>
                      <div
                        v-else-if="customLegend(sublayer)?.type === 'discrete'"
                        class="custom-legend q-mt-xs"
                      >
                        <div
                          v-for="legendItem in customLegend(sublayer).items"
                          :key="legendItem.label"
                          class="custom-legend-item"
                        >
                          <span
                            class="custom-legend-swatch"
                            :style="{ backgroundColor: legendItem.color }"
                          />

                          <span>{{ legendItem.label }}</span>
                        </div>
                      </div>

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

                    <q-item-section side>
                      <div class="legend-swatch" v-if="sublayer.legendImg">
                        <img :src="legendImageSrc(sublayer)" />
                      </div>
                      <div
                        v-else-if="customLegend(sublayer)?.type === 'symbol'"
                        class="custom-symbol-legend q-mt-xs"
                      >
                        <div class="custom-symbol-item">
                          <span
                            v-if="customLegend(sublayer).shape === 'triangle'"
                            class="custom-symbol-triangle"
                            :style="{ borderBottomColor: customLegend(sublayer).color }"
                          />

                          <span
                            v-else
                            class="custom-symbol-diamond"
                            :style="{ backgroundColor: customLegend(sublayer).color }"
                          />
                        </div>
                      </div>
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
                class="text-caption text-grey-8 q-pt-md q-px-md text-italic"
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

                  <div v-if="customLegend(sublayer)?.type === 'ramp'" class="legend-ramp">
                    <span>{{ customLegend(sublayer).lowLabel }}</span>

                    <div
                      class="legend-ramp-bar"
                      :style="{ background: customLegend(sublayer).gradient }"
                    />

                    <span>{{ customLegend(sublayer).highLabel }}</span>
                  </div>
                  <div
                    v-else-if="customLegend(sublayer)?.type === 'discrete'"
                    class="custom-legend q-mt-xs"
                  >
                    <div
                      v-for="legendItem in customLegend(sublayer).items"
                      :key="legendItem.label"
                      class="custom-legend-item"
                    >
                      <span
                        class="custom-legend-swatch"
                        :style="{ backgroundColor: legendItem.color }"
                      />

                      <span>{{ legendItem.label }}</span>
                    </div>
                  </div>
                  <div
                    v-else-if="customLegend(sublayer)?.type === 'symbol'"
                    class="custom-symbol-legend q-mt-xs"
                  >
                    <div class="custom-symbol-item">
                      <span
                        v-if="customLegend(sublayer).shape === 'triangle'"
                        class="custom-symbol-triangle"
                        :style="{ borderBottomColor: customLegend(sublayer).color }"
                      />

                      <span
                        v-else
                        class="custom-symbol-diamond"
                        :style="{ backgroundColor: customLegend(sublayer).color }"
                      />
                    </div>
                  </div>

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

                <q-item-section side>
                  <div class="legend-swatch" v-if="sublayer.legendImg">
                    <img :src="legendImageSrc(sublayer)" />
                  </div>
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
          <div class="q-pb-sm" v-if="layer.title == 'Highly Sensitive'">
            <div class="q-pa-md" style="border-bottom: 1px solid lightgray">
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

                      <div v-if="customLegend(sublayer)?.type === 'ramp'" class="legend-ramp">
                        <span>{{ customLegend(sublayer).lowLabel }}</span>

                        <div
                          class="legend-ramp-bar"
                          :style="{ background: customLegend(sublayer).gradient }"
                        />

                        <span>{{ customLegend(sublayer).highLabel }}</span>
                      </div>
                      <div
                        v-else-if="customLegend(sublayer)?.type === 'discrete'"
                        class="custom-legend q-mt-xs"
                      >
                        <div
                          v-for="legendItem in customLegend(sublayer).items"
                          :key="legendItem.label"
                          class="custom-legend-item"
                        >
                          <span
                            class="custom-legend-swatch"
                            :style="{ backgroundColor: legendItem.color }"
                          />

                          <span>{{ legendItem.label }}</span>
                        </div>
                      </div>
                      <div
                        v-else-if="customLegend(sublayer)?.type === 'symbol'"
                        class="custom-symbol-legend q-mt-xs"
                      >
                        <div class="custom-symbol-item">
                          <span
                            v-if="customLegend(sublayer).shape === 'triangle'"
                            class="custom-symbol-triangle"
                            :style="{ borderBottomColor: customLegend(sublayer).color }"
                          />

                          <span
                            v-else
                            class="custom-symbol-diamond"
                            :style="{ backgroundColor: customLegend(sublayer).color }"
                          />
                        </div>
                      </div>

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

                    <q-item-section side>
                      <div class="legend-swatch" v-if="sublayer.legendImg">
                        <img :src="legendImageSrc(sublayer)" />
                      </div>
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

                  <div v-if="customLegend(sublayer)?.type === 'ramp'" class="legend-ramp">
                    <span>{{ customLegend(sublayer).lowLabel }}</span>

                    <div
                      class="legend-ramp-bar"
                      :style="{ background: customLegend(sublayer).gradient }"
                    />

                    <span>{{ customLegend(sublayer).highLabel }}</span>
                  </div>
                  <div
                    v-else-if="customLegend(sublayer)?.type === 'discrete'"
                    class="custom-legend q-mt-xs"
                  >
                    <div
                      v-for="legendItem in customLegend(sublayer).items"
                      :key="legendItem.label"
                      class="custom-legend-item"
                    >
                      <span
                        class="custom-legend-swatch"
                        :style="{ backgroundColor: legendItem.color }"
                      />

                      <span>{{ legendItem.label }}</span>
                    </div>
                  </div>
                  <div
                    v-else-if="customLegend(sublayer)?.type === 'symbol'"
                    class="custom-symbol-legend q-mt-xs"
                  >
                    <div class="custom-symbol-item">
                      <span
                        v-if="customLegend(sublayer).shape === 'triangle'"
                        class="custom-symbol-triangle"
                        :style="{ borderBottomColor: customLegend(sublayer).color }"
                      />

                      <span
                        v-else
                        class="custom-symbol-diamond"
                        :style="{ backgroundColor: customLegend(sublayer).color }"
                      />
                    </div>
                  </div>

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

                <q-item-section side>
                  <div class="legend-swatch" v-if="sublayer.legendImg">
                    <img :src="legendImageSrc(sublayer)" />
                  </div>
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
.legend-swatch {
  width: 20px;
  height: 20px;
}

.legend-swatch img {
  display: block;
  width: 20px;
  height: 20px;
}

.custom-legend {
  display: grid;
  gap: 4px;
  margin-left: 32px;
  color: #4a4a4a;
  font-size: 0.78rem;
  line-height: 1.25;
  margin-bottom: 5px;
}

.custom-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-legend-swatch {
  flex: 0 0 14px;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0, 0, 0, 0.18);
}

.opacity-slider {
  max-width: 180px;
  margin-left: 32px;
}
.legend-ramp {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 32px;
  max-width: 220px;
  font-size: 0.78rem;
  margin-bottom: 5px;
  color: #4a4a4a;
}

.legend-ramp-bar {
  flex: 1;
  height: 14px;
  border-radius: 2px;
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
.custom-symbol-triangle {
  width: 0;
  height: 0;
  display: block;

  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 14px solid;

  margin-top: -2px;
}

.custom-symbol-diamond {
  width: 14px;
  height: 14px;
  transform: rotate(45deg);
  display: inline-block;
}
</style>
