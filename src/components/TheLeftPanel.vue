<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed } from 'vue'
import TheReport from './TheReport.vue'

const mapStore = useMapStore()
import draggable from 'vuedraggable'

// takes an element object
function scrollToElement(elid) {
  mapStore.panelState = 'open'
  mapStore.activeTool = 'help'
  mapStore.activeHelpElement = elid

  let el = document.getElementById(elid)
  console.log('scrolling to element', elid, el)
  el.scrollIntoView({
    behavior: 'smooth', // Optional: smooth scrolling animation
    block: 'start', // Optional: 'start', 'center', 'end', or 'nearest'
    inline: 'nearest', // Optional: 'start', 'center', 'end', or 'nearest'
  })
}
function openPanel() {
  mapStore.activeTool = 'Site Report'
  mapStore.panelState = 'open'
}

computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost',
  }
})
</script>
<template>
  <div class="">
    <div class="">
      <q-tabs
        v-model="mapStore.tab"
        dense
        class="text-dark bg-grey-3 q-mx-sm bg-white"
        active-color="white"
        active-bg-color="blue-grey-9"
        indicator-color="primary"
        align="justify"
        @click="mapStore.compare ? mapStore.hideShowSwipe() : ''"
      >
        <q-tab name="layers" label="View Layers" icon="layers" />
        <q-tab name="sketch" label="Site Report" icon="search" />
      </q-tabs>
    </div>
    <q-tab-panels v-model="mapStore.tab" animated class="bg-white">
      <q-tab-panel name="layers" class="q-mt-sm q-pt-none q-px-sm">
        <q-scroll-area style="height: calc(100vh - 150px)">
          <div class="bg-white q-pr-md">
            <!--div class="q-pb-xl q-pt-md">
          <p class="text-h2 text-weight-light q-mb-none q-px-md q-pt-md" style="line-height:.5em">Site </p>
          <p class="text-h2 text-weight-medium q-mb-none q-px-md q-pt-md text-primary" style="line-height:1em">Renewables</p>
          <p class="text-h2 text-weight-light q-mb-none q-px-md q-pt-md" style="line-height:.5em">Right</p>
        </div-->
            <div class="q-ma-sm">
              <p class="text-body2 text-bold q-mb-none q-mt-md">VIEW LAYERS</p>
              <p>
                Expand layer groups to customize map and use check boxes to toggle visibility.
                Filter data by interest using the buttons below.
              </p>
            </div>
            <div class="q-mt-md q-mb-md bg-white text-left row">
              <q-btn
                square
                size="sm"
                stack
                unelevated=""
                @click="mapStore.updateLayerList('both')"
                :class="
                  mapStore.category == 'both'
                    ? 'bg-blue-grey-9 text-white q-mr-sm q-ml-sm'
                    : 'q-mr-sm q-ml-sm'
                "
              >
                <span
                  :class="
                    mapStore.category == 'both'
                      ? 'material-symbols-outlined text-white'
                      : 'material-symbols-outlined text-blue-grey-9'
                  "
                  style="font-size: 28px"
                  >energy_savings_leaf</span
                >
                &nbsp;All</q-btn
              >
              <q-btn
                square
                size="sm"
                stack
                unelevated=""
                @click="mapStore.updateLayerList('wind')"
                :class="mapStore.category == 'wind' ? 'bg-blue-grey-9 text-white' : ''"
              >
                <span
                  :class="
                    mapStore.category == 'wind'
                      ? 'material-symbols-outlined text-white'
                      : 'material-symbols-outlined text-blue-grey-9'
                  "
                  style="font-size: 28px"
                  >wind_power</span
                >
                &nbsp;Wind
              </q-btn>
              <q-btn
                square
                size="sm"
                stack
                unelevated=""
                @click="mapStore.updateLayerList('solar')"
                :class="
                  mapStore.category == 'solar' ? 'bg-blue-grey-9 text-white q-ml-sm' : 'q-ml-sm'
                "
              >
                <span
                  :class="
                    mapStore.category == 'solar'
                      ? 'material-symbols-outlined text-white'
                      : 'material-symbols-outlined text-blue-grey-9'
                  "
                  style="font-size: 28px"
                  >solar_power</span
                >
                &nbsp;Solar
              </q-btn>
              <q-space></q-space>
              <q-separator inset spaced class="" vertical=""></q-separator>
              <q-btn square padding="xs" flat size="sm" stack color="blue-grey-9" class="q-ml-md">
                <q-tooltip>Download data</q-tooltip>
                <calcite-icon class="q-mb-xs" icon="download" scale="m"></calcite-icon>Download Data
              </q-btn>
              <!--q-btn
                square
                padding="xs"
                flat
                size="sm"
                stack
                color="blue-grey-9"
                class="q-ml-md"
                @click="openPanel()"
              >
                <q-tooltip>Get site report</q-tooltip>
                <calcite-icon class="q-mb-xs" icon="file-report" scale="m"></calcite-icon>Site
                Report
              </q-btn-->
            </div>

            <div class="bg-white" v-for="(item, index) in mapStore.layers" :key="index">
              <div>
                <q-expansion-item
                  label=""
                  caption=""
                  v-for="(layer, index) in item.subheaders"
                  :key="index"
                  header-class="bg-grey-2"
                  expand="true"
                  style="border-bottom: 1px solid gainsboro"
                >
                  <template v-slot:header>
                    <div class="self-center">
                      <q-checkbox
                        size="sm"
                        v-model="layer.visible"
                        @update:model-value="mapStore.setLayerVisibility(layer)"
                      >
                      </q-checkbox>
                    </div>
                    <q-item-section>
                      <q-item-label class="text-body1">{{ layer.title }} </q-item-label>
                    </q-item-section>
                  </template>
                  <q-list dense class="q-ma-md q-pb-md bg-white">
                    <p v-if="layer.title == 'Highly Sensitive'" class="text-caption text-italic">
                      *Drag handle to re-order layers
                    </p>
                    <draggable
                      v-model="layer.sublayers"
                      ghostClass="ghost"
                      @end="mapStore.updateLayerOrder(layer.id)"
                      item-key="index"
                    >
                      <template #item="{ element: sublayer }">
                        <q-item dense class="" style="" v-if="sublayer.filter">
                          <q-item-section side>
                            <q-icon size="xs" name="drag_indicator"> </q-icon
                          ></q-item-section>
                          <q-item-section>
                            <q-checkbox
                              size="xs"
                              v-model="sublayer.visibleModel"
                              @click.stop="
                                mapStore.setSublayerVisibility(
                                  sublayer.elid,
                                  layer.id,
                                  sublayer.id,
                                  sublayer.visibleModel,
                                )
                              "
                              >{{ sublayer.title }}</q-checkbox
                            >
                          </q-item-section>
                          <q-item-section side>
                            <div style="width: 20px; height: 20px">
                              <img :src="'data:image/gif;base64,' + mapStore.legend[sublayer.id]" />
                            </div>
                          </q-item-section>
                          <q-item-section side class="">
                            <q-btn
                              size="sm"
                              flat
                              padding="none"
                              icon="o_info"
                              @click="scrollToElement(sublayer.elid)"
                              ><q-tooltip> more info </q-tooltip></q-btn
                            >
                          </q-item-section>
                        </q-item>
                      </template>
                    </draggable>
                  </q-list>
                </q-expansion-item>
              </div>
            </div>
            <div class="text-center">
              <q-btn
                size="lg"
                square
                unelevated
                color="blue-grey-9"
                class="q-mt-xl q-mb-md q-ml-md q-mr-md"
                label="Get Site Report"
                @click="mapStore.tab = 'sketch'"
              ></q-btn>
            </div>
          </div>
        </q-scroll-area>
      </q-tab-panel>
      <q-tab-panel name="sketch" class="q-mt-sm q-pt-none q-px-sm">
        <q-scroll-area style="height: calc(100vh - 150px)">
          <div class="q-pr-md q-ml-sm">
            <p class="text-body2 text-bold q-mb-none q-mt-md">SITE REPORT</p>
            <p>Click anywhere on the map to generate a Site Renewables Right area summary.</p>
          </div>
          <div class="q-mt-md q-mb-md bg-white text-left row q-pr-md">
            <q-btn
              square
              size="sm"
              stack
              unelevated=""
              @click="mapStore.updateLayerList('both')"
              :class="
                mapStore.category == 'both'
                  ? 'bg-blue-grey-9 text-white q-mr-sm q-ml-sm'
                  : 'q-mr-sm q-ml-sm'
              "
            >
              <span
                :class="
                  mapStore.category == 'both'
                    ? 'material-symbols-outlined text-white'
                    : 'material-symbols-outlined text-blue-grey-9'
                "
                style="font-size: 28px"
                >energy_savings_leaf</span
              >
              &nbsp;All</q-btn
            >
            <q-btn
              square
              size="sm"
              stack
              unelevated=""
              @click="mapStore.updateLayerList('wind')"
              :class="mapStore.category == 'wind' ? 'bg-blue-grey-9 text-white' : ''"
            >
              <span
                :class="
                  mapStore.category == 'wind'
                    ? 'material-symbols-outlined text-white'
                    : 'material-symbols-outlined text-blue-grey-9'
                "
                style="font-size: 28px"
                >wind_power</span
              >
              &nbsp;Wind
            </q-btn>
            <q-btn
              square
              size="sm"
              stack
              unelevated=""
              @click="mapStore.updateLayerList('solar')"
              :class="
                mapStore.category == 'solar' ? 'bg-blue-grey-9 text-white q-ml-sm' : 'q-ml-sm'
              "
            >
              <span
                :class="
                  mapStore.category == 'solar'
                    ? 'material-symbols-outlined text-white'
                    : 'material-symbols-outlined text-blue-grey-9'
                "
                style="font-size: 28px"
                >solar_power</span
              >
              &nbsp;Solar
            </q-btn>
            <q-space></q-space>
            <q-separator inset spaced class="" vertical=""></q-separator>
            <q-btn square padding="xs" flat size="sm" stack color="blue-grey-9" class="q-ml-md">
              <q-tooltip>Download report</q-tooltip>
              <calcite-icon class="q-mb-xs" icon="download" scale="m"></calcite-icon>Download Report
            </q-btn>
            <!--q-btn
                square
                padding="xs"
                flat
                size="sm"
                stack
                color="blue-grey-9"
                class="q-ml-md"
                @click="openPanel()"
              >
                <q-tooltip>Get site report</q-tooltip>
                <calcite-icon class="q-mb-xs" icon="file-report" scale="m"></calcite-icon>Site
                Report
              </q-btn-->
          </div>
          <the-report></the-report>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<style>
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
