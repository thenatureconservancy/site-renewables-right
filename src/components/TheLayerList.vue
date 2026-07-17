r
<script setup>
import { useMapStore } from '@/stores/map'
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
  }
  return legends[sublayer.elid] || null
}

function legendImageSrc(sublayer) {
  return `data:image/png;base64,${sublayer.legendImg}`
}

// takes an element object
async function scrollToElement(elid) {
  mapStore.panelState = 'open'
  mapStore.activeTool = 'help'
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

  const el = await waitForElement(elid, 1500)

  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })

    try {
      el.focus && el.focus()
    } catch {
      /* ignore focus errors */
    }
  } else {
    console.warn('scrollToElement: could not find element', elid)
  }
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
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center no-wrap q-gutter-xs">
                        <q-btn
                          size="sm"
                          flat
                          padding="none"
                          icon="o_info"
                          @click.stop="scrollToElement(sublayer.elid)"
                        >
                          <q-tooltip>Go to layer info panel</q-tooltip>
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
                class="text-caption text-grey-8 q-ml-md text-italic q-mb-sm"
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

                  <q-slider
                    v-if="activeOpacityLayer === sublayer.elid"
                    class="q-mt-xs opacity-slider"
                    v-model="sublayer.opacity"
                    :min="0.1"
                    :max="1"
                    :step="0.1"
                    label
                    @update:model-value="mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)"
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
                      @click.stop="scrollToElement(sublayer.elid)"
                    >
                      <q-tooltip>Go to layer info panel</q-tooltip>
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
          <q-expansion-item v-else v-model="layer.expanded" dense header-class="" expand="true">
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

                      <q-slider
                        v-if="activeOpacityLayer === sublayer.elid"
                        class="q-mt-xs opacity-slider"
                        v-model="sublayer.opacity"
                        :min="0.1"
                        :max="1"
                        :step="0.1"
                        label
                        @update:model-value="mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)"
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
                          @click.stop="scrollToElement(sublayer.elid)"
                        >
                          <q-tooltip>Go to layer info panel</q-tooltip>
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

                  <q-slider
                    v-if="activeOpacityLayer === sublayer.elid"
                    class="q-mt-xs opacity-slider"
                    v-model="sublayer.opacity"
                    :min="0.1"
                    :max="1"
                    :step="0.1"
                    label
                    @update:model-value="mapStore.setSublayerOpacity(sublayer.elid, sublayer.opacity)"
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
                      @click.stop="scrollToElement(sublayer.elid)"
                    >
                      <q-tooltip>Go to layer info panel</q-tooltip>
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
</style>
