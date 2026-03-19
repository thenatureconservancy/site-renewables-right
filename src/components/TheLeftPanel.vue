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
  <div class="q-ma-md">
    <p class="text-body2 text-bold q-mb-none q-mt-md">Explore the Data</p>

    <p>
      Select an energy type, then toggle layers to see where renewable energy development may
      intersect with important ecological and cultural features. 
      <q-btn icon="keyboard_arrow_up" size='xs' flat :label="mapStore.seeMore ? 'show' : 'hide'" @click="mapStore.seeMore = !mapStore.seeMore" ></q-btn>
    </p>
    <the-toolbar></the-toolbar>
    <q-scroll-area style="height: calc(100vh - 400px)">
       <p class="text-overline q-ml-sm q-mb-none">DATA LAYERS</p>
      <the-layer-list></the-layer-list>
    </q-scroll-area>
  </div>
  <!--div class="">
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
    </div-->
  <!--q-tab-panels v-model="mapStore.tab" animated class="bg-white">
      <q-tab-panel name="layers" class="q-mt-sm q-pt-none q-px-sm">
        <q-scroll-area style="height: calc(100vh - 120px)">
          <div class="bg-white q-pr-md">
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
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels-->
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
