<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed } from 'vue'
import TheToolbar from './TheToolbar.vue'
import TheLayerList from './TheLayerList.vue'
const mapStore = useMapStore()

const showCustom = ref(false)
function buffer(size) {
  mapStore.bufferSize = size
  mapStore.createBuffer(mapStore.currentPoint)
}

function countResults(list, query) {
  if (query == 'inBuffer') {
    let newList = list.filter((sublayer) => {
      return sublayer.filter && (sublayer.totalArea > 0 || sublayer.count > 0)
    })
    return newList.length
  }
  if (query == 'inExtent') {
    let newList = list.filter((sublayer) => {
      return sublayer.filter && sublayer.totalArea == 0 && sublayer.inExtent == true
    })
    return newList.length
  }
  if (query == 'outExtent') {
    let newList = list.filter((sublayer) => {
      return sublayer.filter && sublayer.totalArea == 0 && sublayer.inExtent == false
    })
    return newList.length
  }
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
        class="text-grey-6 q-mx-sm bg-white"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        style="border-top: 1px solid lightgrey; border-bottom: 1px solid lightgrey"
      >
        <q-tab name="layers"
          ><p class="text-bold q-mb-none">
            <span><q-icon size="xs" name="layers"></q-icon></span>&nbsp; View Layers
          </p></q-tab
        >
        <q-tab name="sketch"
          ><p class="text-bold q-mb-none">
            <span><q-icon size="xs" name="search"></q-icon></span>&nbsp; Site Report
          </p></q-tab
        >
      </q-tabs>
    </div>
    <q-tab-panels v-model="mapStore.tab" animated class="bg-white">
      <q-tab-panel name="layers" class="q-mt-sm q-pt-none q-px-sm">
        <q-scroll-area style="height: calc(100vh - 120px)">
          <div class="bg-white q-pr-md">
            <!--div class="q-ma-sm">
              <p class="text-body2 text-bold q-mb-none q-mt-md">VIEW LAYERS</p>
              <p>
                Expand layer groups to customize map and use check boxes to toggle visibility.
                Filter data by interest using the buttons below.
              </p>
            </div-->

            <the-toolbar></the-toolbar>

            <the-layer-list></the-layer-list>

            <div class="text-center">
              <q-btn
                size="lg"
                square
                unelevated
                color="primary"
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
            <the-toolbar></the-toolbar>
          </div>

          <!--the-report></the-report-->
          <!--the buffer tools-->
          <div class="q-mb-md q-mt-xl bg-grey-1 q-pt-md">
            <p class="text-bold q-pl-md q-mb-sm">
              Buffer Size:
              <q-btn class="q-ml-sm" flat square padding="none" icon="o_info" size="sm">
                <q-menu>
                  <div class="q-pa-md" style="width: 300px">
                    <p class="">
                      Tracking species movement is approximate. Adjust the buffer so it aligns with
                      the project scale and includes some of the surrounding area.
                    </p>
                    <q-btn color="blue" size="sm" flat>More info</q-btn>
                  </div>
                </q-menu>
              </q-btn>
            </p>

            <p class="q-pb-none q-mb-none q-pl-sm">
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                @click="buffer(0.5)"
                :style="mapStore.bufferSize == 0.5 ? 'border: 2px solid #536067' : ''"
                class="text-weight-light"
                label="0.5 Mile"
              >
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="mapStore.bufferSize == 1 ? 'border: 2px solid #536067' : ''"
                class="text-weight-light"
                @click="buffer(1)"
              >
                1 Mile
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="mapStore.bufferSize == 5 ? 'border: 2px solid #536067' : ''"
                class="text-weight-light q-mb-none"
                @click="buffer(5)"
              >
                5 Mile
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="
                  mapStore.bufferSize !== 0.5 &&
                  mapStore.bufferSize !== 5 &&
                  mapStore.bufferSize !== 1
                    ? 'border: 2px solid #536067'
                    : ''
                "
                class="text-weight-light q-mb-none"
                @click="
                  mapStore.bufferSize = '';
                  showCustom = 'true'
                "
              >
                CUSTOM
              </q-btn>
              <br />
            </p>
            <p
              class="text-weight-light q-mr-md q-ml-md q-mt-md text-caption q-mt-none q-mb-none"
              v-if="showCustom"
            >
              *CUSTOM BUFFER SIZE
              <input
                v-model="mapStore.bufferSize"
                type="number"
                style="width: 40px"
                @change="buffer(mapStore.bufferSize)"
                min="0"
              />
              MILES
            </p>
            <br />
          </div>
          <!-- second toc for report-->
          <div v-if="mapStore.currentPoint !== ''">
            <p class="text-bold q-pl-md q-mb-sm">
              Show Layers:
              <q-btn class="q-ml-sm" flat square padding="none" icon="o_info" size="sm">
                <q-menu>
                  <div class="q-pa-md" style="width: 300px">
                    <p class="">
                      Use this option to control which layers appear in the list below. It filters
                      out any layers outside your chosen area ie; buffer or map view so you only see
                      relavant layers.
                    </p>
                    <q-btn color="blue" size="sm" flat>More info</q-btn>
                  </div>
                </q-menu>
              </q-btn>
            </p>

            <p class="q-pb-none q-mb-md q-pl-sm">
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                @click="mapStore.reportLayerFilter = 'buffer'"
                :style="mapStore.reportLayerFilter == 'buffer' ? 'border: 2px solid #536067' : ''"
                class="text-weight-light"
                label="Within Buffer"
              >
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="mapStore.reportLayerFilter == 'mapView' ? 'border: 2px solid #536067' : ''"
                class="text-weight-light"
                @click="mapStore.reportLayerFilter = 'mapView'"
              >
                Within Map Extent
              </q-btn>
              <q-btn
                square
                size="md"
                stack
                unelevated=""
                :style="mapStore.reportLayerFilter == 'all' ? 'border: 2px solid #536067' : ''"
                class="text-weight-light q-mb-none"
                @click="mapStore.reportLayerFilter = 'all'"
              >
                All
              </q-btn>
            </p>
            <the-layer-list></the-layer-list>
          </div>
          <div
            v-if="mapStore.currentPoint == ''"
            class="q-pa-lg q-mg-lg q-mt-md text-h6 text-weight-light text-grey"
          >
            <div class="text-center q-mb-md q-pa-md">
              <q-icon name="o_pin_drop" size="xl" class="text-center"></q-icon>

              <p class="q-pb-xl q-mb-xl">
                Click anywhere on the map to generate a Site Renewables Right area summary
              </p>
            </div>
          </div>
          <!--div v-if="mapStore.currentPoint !== ''">
           
            <p class="text-bold q-mb-none">Report Layers</p>

            <p class="text-body1 q-ma-sm bg-grey-1 q-pa-sm">Layers inside buffer</p>

            <div class="" v-for="(item, index) in mapStore.layers" :key="index">
              <div v-for="(layer, index) in item.subheaders" :key="index">
                <q-list
                  v-if="countResults(layer.sublayers, 'inBuffer') > 0"
                  dense
                  class="q-ma-none bg-white"
                >
                  <draggable
                    v-model="layer.sublayers"
                    ghostClass="ghost"
                    @end="mapStore.updateLayerOrder(layer)"
                    item-key="index"
                  >
                    <template #item="{ element: sublayer }">
                      <q-item
                        dense
                        class="q-mb-xs q-mx-sm"
                        style=""
                        v-if="sublayer.filter && (sublayer.totalArea > 0 || sublayer.count > 0)"
                        :style="
                          layer.id == 'avoid'
                            ? 'border-left: 4px solid lightcoral'
                            : layer.id == 'minimize'
                              ? 'border-left: 4px solid #FFD580'
                              : 'border-left: 4px solid green'
                        "
                      >
                        <q-item-section side>
                          <q-icon size="xs" name="drag_indicator"> </q-icon
                        ></q-item-section>
                        <q-item-section>
                          <q-checkbox
                            size="xs"
                            v-model="sublayer.visibleModel"
                            @click.stop="
                              mapStore.setSublayerVisibility(sublayer.elid, sublayer.visibleModel)
                            "
                            >{{ sublayer.title }}
                          </q-checkbox>
                        </q-item-section>
                        <q-item-section side>
                          <div style="width: 20px; height: 20px">
                            <img :src="'data:image/gif;base64,' + sublayer.legendImg" />
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
              </div>
            </div>
            <p class="text-body1 q-ma-sm bg-grey-1 q-pa-sm">Layers in map view</p>
            <div class="bg-white" v-for="(item, index) in mapStore.layers" :key="index">
              **layers intersecting extent
              <div v-for="(layer, index) in item.subheaders" :key="index">
                <q-list
                  v-if="countResults(layer.sublayers, 'inExtent') > 0"
                  dense
                  class="q-ma-none bg-white"
                >
                  <draggable
                    v-model="layer.sublayers"
                    ghostClass="ghost"
                    @end="mapStore.updateLayerOrder(layer)"
                    item-key="index"
                  >
                    <template #item="{ element: sublayer }">
                      <q-item
                        dense
                        class="q-mb-xs q-mx-sm"
                        style=""
                        v-if="
                          sublayer.filter && sublayer.totalArea == 0 && sublayer.inExtent == true
                        "
                        :style="
                          layer.id == 'avoid'
                            ? 'border-left: 4px solid lightcoral'
                            : layer.id == 'minimize'
                              ? 'border-left: 4px solid #FFD580'
                              : 'border-left: 4px solid green'
                        "
                      >
                        <q-item-section side>
                          <q-icon size="xs" name="drag_indicator"> </q-icon
                        ></q-item-section>
                        <q-item-section>
                          <q-checkbox
                            size="xs"
                            v-model="sublayer.visibleModel"
                            @click.stop="
                              mapStore.setSublayerVisibility(sublayer.elid, sublayer.visibleModel)
                            "
                            >{{ sublayer.title }}
                            <span v-if="sublayer.totalArea > 0">
                              {{ sublayer.totalArea }}SQ MI
                            </span></q-checkbox
                          >
                        </q-item-section>
                        <q-item-section side>
                          <div style="width: 20px; height: 20px">
                            <img :src="'data:image/gif;base64,' + sublayer.legendImg" />
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
              </div>
            </div>
            <p class="text-body1 q-ma-sm bg-grey-1 q-pa-sm">Layers outside map view</p>
            <div class="bg-white" v-for="(item, index) in mapStore.layers" :key="index">
              ** layers not intersecting
              <div v-for="(layer, index) in item.subheaders" :key="index">
                <q-list
                  dense
                  class="q-ma-none bg-white"
                  v-if="countResults(layer.sublayers, 'outExtent') > 0"
                >
                  <draggable
                    v-model="layer.sublayers"
                    ghostClass="ghost"
                    @end="mapStore.updateLayerOrder(layer)"
                    item-key="index"
                  >
                    <template #item="{ element: sublayer }">
                      <q-item
                        dense
                        class="q-mb-xs q-mx-sm"
                        :style="
                          layer.id == 'avoid'
                            ? 'border-left: 4px solid lightcoral'
                            : layer.id == 'minimize'
                              ? 'border-left: 4px solid #FFD580'
                              : 'border-left: 4px solid green'
                        "
                        v-if="
                          sublayer.filter && sublayer.totalArea == 0 && sublayer.inExtent == false
                        "
                      >
                        <q-item-section side>
                          <q-icon size="xs" name="drag_indicator"> </q-icon
                        ></q-item-section>
                        <q-item-section>
                          <q-checkbox
                            size="xs"
                            v-model="sublayer.visibleModel"
                            @click.stop="
                              mapStore.setSublayerVisibility(sublayer.elid, sublayer.visibleModel)
                            "
                            >{{ sublayer.title }}
                          </q-checkbox>
                        </q-item-section>
                        <q-item-section side>
                          <div style="width: 20px; height: 20px">
                            <img :src="'data:image/gif;base64,' + sublayer.legendImg" />
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
              </div>
            </div>
          </div-->
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<style>
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
