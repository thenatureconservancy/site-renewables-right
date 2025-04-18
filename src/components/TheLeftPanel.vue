<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed } from 'vue'
import TheResults from './TheResults.vue'

const mapStore = useMapStore()
import draggable from 'vuedraggable'
const drag = ref(false)
const list = [
  { name: 'vue.draggable', index: 0 },
  { name: 'draggable', index: 1 },
  { name: 'component', index: 2 },
]

// takes an element object
function scrollToElement(elid) {
  mapStore.activeTool = 'help'
  mapStore.activeHelpElement = elid

  let el = document.getElementById(elid)
  el.scrollIntoView({
    behavior: 'smooth', // Optional: smooth scrolling animation
    block: 'start', // Optional: 'start', 'center', 'end', or 'nearest'
    inline: 'nearest', // Optional: 'start', 'center', 'end', or 'nearest'
  })
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
  <div class="bg-blue-grey-1 q-pt-sm">
    <div class="bg-blue-grey-1">
      <q-tabs
        v-model="mapStore.tab"
        dense
        class="text-dark bg-white q-mx-sm bg-white"
        active-color="white"
        active-bg-color="blue-grey-9"
        indicator-color="primary"
        align="justify"
        @click="mapStore.compare? mapStore.hideShowSwipe(): ''"
      >
        <q-tab name="layers" label="View Layers" icon="layers" />
        <q-tab name="sketch" label="Area Explorer" icon="search" />
      </q-tabs>
    </div>
    <q-tab-panels v-model="mapStore.tab" animated class="bg-blue-grey-1">
      <q-tab-panel name="layers" class="q-mt-sm q-pt-none q-px-sm">
        <q-scroll-area style="height: calc(100vh - 138px)">
          <div class="bg-white">
            <div class="row" style="">
              <p class="text-body2 text-weight-bold q-mb-none q-px-md q-pt-md">VIEW LAYERS</p>
              <q-space></q-space>
            </div>
            <p class="q-px-md q-mb-none">
              Expand layer groups to customize map and use check boxes to toggle visibility. Filter
              data by interest using the buttons below.
            </p>
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
                <calcite-icon class="q-mb-xs" icon="download" scale="m"></calcite-icon>Download
              </q-btn>
              <q-btn
                square
                padding="xs"
                flat
                size="sm"
                stack
                @click="mapStore.hideShowSwipe()"
                :color="mapStore.compare ? 'blue' : 'blue-grey-9'"
                class="q-ml-sm q-mr-md"
              >
                <q-tooltip>{{ mapStore.compare ? 'compare off' : 'compare on' }}</q-tooltip>
                <calcite-icon class="q-mb-xs" icon="compare" scale="m"></calcite-icon>Compare
              </q-btn>
            </div>
            <div class="bg-white" v-for="(item, index) in mapStore.layers" :key="index">
              <q-item class="q-ml-none q-pa-none q-ma-none">
                <q-item-section>
                  <q-item-label
                    overline
                    style="
                      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                      background: linear-gradient(to right, white, red);
                    "
                    class="bg-blue-grey-9 q-pa-sm text-white text-bold"
                  >
                    {{ item.header.toUpperCase() }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <div>
                <q-expansion-item
                  label=""
                  caption=""
                  v-for="(layer, index) in item.subheaders"
                  :key="index"
                  header-class="bg-grey-2"
                  expand="true"
                >
                  <template v-slot:header>
                    <div class="self-center">
                      <q-btn
                        text-color="primary"
                        round
                        padding="none"
                        class="q-ma-sm"
                        unelevated
                        size="md"
                        @click.stop="mapStore.setLayerVisibility(layer)"
                        :icon="layer.visible ? 'o_check_circle' : 'o_circle'"
                      ></q-btn>
                    </div>
                    <q-item-section>
                      <q-item-label class="text-body2 text-bold">{{ layer.title }} </q-item-label>
                      <q-item-label caption class="text-dark">{{ layer.description }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-list dense class="q-ma-md q-pb-md bg-white">
                    <draggable v-model="layer.sublayers" ghostClass="ghost"  @end="mapStore.updateLayerOrder(layer.id)" item-key="index" >
                      <template #item="{ element: sublayer }">
                        <q-item dense class="" style="" v-if="sublayer.filter">
                          <q-item-section side>
                            <q-icon size="xs" name="drag_indicator"></q-icon
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
                           </q-item-section
                          >
                        </q-item>
                      </template>
                    </draggable>
                    <!--q-item v-for="(sublayer, index) in layer.sublayers" :key="index">
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
                      <q-item-section side class="">
                        <q-btn
                          size="sm"
                          flat
                          padding="none"
                          icon="o_info"
                          @click="scrollToElement(sublayer.elid)"
                          ><q-tooltip> more info </q-tooltip></q-btn
                        ></q-item-section
                      >
                    </q-item-->
                  </q-list>
                </q-expansion-item>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-tab-panel>
      <q-tab-panel name="sketch" class="q-mt-sm q-pt-none q-px-sm">
        <q-scroll-area style="height: calc(100vh - 138px)">
          <div class="bg-white">
            <div class="q-pt-md q-pl-md q-pr-md">
            <p class="text-body2 text-weight-bold q-mb-none">AREA EXPLORER</p>
            <p class="q-pt-none">
              Click anywhere on the map to generate a Site Renewables Right area
              report
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
                <calcite-icon class="q-mb-xs" icon="download" scale="m"></calcite-icon>Download
              </q-btn>
              <q-btn
                square
                padding="xs"
                flat
                size="sm"
                stack
                @click="mapStore.hideShowSwipe()"
                :color="mapStore.compare ? 'blue' : 'blue-grey-9'"
                class="q-ml-sm q-mr-md"
              >
                <q-tooltip>{{ mapStore.compare ? 'compare off' : 'compare on' }}</q-tooltip>
                <calcite-icon class="q-mb-xs" icon="compare" scale="m"></calcite-icon>Compare
              </q-btn>
            </div>
            
            <!--arcgis-search
            class="q-ma-md"
              active-source-index="0"
              all-placeholder
              max-results="-1"
              max-suggestions="0"
              min-suggest-characters="-1"
              search-term
              reference-element="my-map"
            ></arcgis-search-->
            <div class="q-mb-md">
          
          
              

              <p class="text-bold q-pl-md q-mb-sm">Buffer Size:
              <q-btn class="q-ml-sm" flat square padding="none" icon="o_info" size="sm">
                <q-menu>
                  <div class="q-pa-md" style="width: 300px">
                  <p class="">Tracking species movement is approximate. Adjust the buffer 
                    so it aligns with the project scale and includes some of the surrounding area.</p>
                    <q-btn color="blue" size="sm" flat>More info</q-btn>
                  </div>
                </q-menu>
              </q-btn></p>
              
            <p class="q-mb-md q-pb-none q-pl-sm">
              <q-btn
              
                square
                size="md"
                stack
                unelevated=""
                @click="mapStore.bufferSize = 1000; mapStore.createBuffer(mapStore.currentPoint)"
                :style="mapStore.bufferSize == 1000 ? 'border: 2px solid #536067' : ''"
                class='text-weight-light'
                label="1 KM"
                
                >
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="mapStore.bufferSize == 5000 ? 'border: 2px solid #536067' : ''"
                class='text-weight-light'
                @click="mapStore.bufferSize = 5000;mapStore.createBuffer(mapStore.currentPoint)"
              
              >
                5 KM
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="mapStore.bufferSize == 10000 ? 'border: 2px solid #536067' : ''"
                class='text-weight-light'
                @click="mapStore.bufferSize = 10000; mapStore.createBuffer(mapStore.currentPoint)"
              >
                10 KM
              </q-btn>
            </p>
           
          </div>
            <!--q-btn size="md" color="blue-grey-9" unelevated>Start <br />Sketch</q-btn>
            <q-icon size="sm" class="q-ma-md" color="blue-grey-9" name="circle"></q-icon>
            <q-icon size="sm" class="q-ma-md" color="blue-grey-9" name="circle"></q-icon>
            <q-icon size="sm" class="q-ma-md" color="blue-grey-9" name="circle"></q-icon>
            <q-btn size="md" unelevated>Get <br />Report</q-btn-->
            <the-results></the-results>
          </div>
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
