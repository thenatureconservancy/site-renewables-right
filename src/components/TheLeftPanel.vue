<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed } from 'vue'
import TheReport from './TheReport.vue'

const mapStore = useMapStore()
import draggable from 'vuedraggable'

const showCustom = ref(false)
function buffer(size) {
  mapStore.bufferSize = size
  mapStore.createBuffer(mapStore.currentPoint)
}
function getRange(val) {
  let newVal = val * 100
  let range = ''
  newVal > 0 && newVal < 26
    ? (range = '0 - 25%')
    : newVal > 25 && newVal < 51
      ? (range = '26 - 50%')
      : newVal > 50 && newVal < 76
        ? (range = '51 - 75%')
        : newVal > 75 && newVal < 101
          ? (range = '76 - 100%')
          : (range = '0 - 100%')
  return range
}

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
        dense
        class="text-dark bg-grey-3 q-mx-sm bg-white"
        active-color="white"
        active-bg-color="blue-grey-9"
        indicator-color="primary"
        align="justify"
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
                @click="mapStore.filterLayers('both')"
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
                @click="mapStore.filterLayers('wind')"
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
                @click="mapStore.filterLayers('solar')"
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
              <q-btn
                square
                size="sm"
                stack
                unelevated=""
                @click="mapStore.filterLayers('floating')"
                :class="
                  mapStore.category == 'floating' ? 'bg-blue-grey-9 text-white q-ml-sm' : 'q-ml-sm'
                "
              >
                <span
                  :class="
                    mapStore.category == 'floating'
                      ? 'material-symbols-outlined text-white'
                      : 'material-symbols-outlined text-blue-grey-9'
                  "
                  style="font-size: 28px"
                  >water_lux</span
                >
                &nbsp;Floating <br />Solar
              </q-btn>
              <q-space></q-space>
              <q-separator inset spaced class="" vertical=""></q-separator>
              <q-btn square padding="xs" flat size="sm" stack color="blue-grey-9" class="q-ml-md">
                <q-tooltip>Download data</q-tooltip>
                <calcite-icon class="q-mb-xs" icon="download" scale="m"></calcite-icon>Download
                <br />Data
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
              <q-expansion-item
                @update:model-value="mapStore.setGroupVisibility(item)"
                :label="item.header"
                v-model="item.expanded"
                :header-class="
                  item.expanded
                    ? 'expandedHeaderClass text-h6 text-weight-light'
                    : 'headerClass text-h6 text-weight-light'
                "
                expanded-icon="visibility"
                :expand-icon-class="item.expanded ? 'text-primary' : 'text-grey-9'"
                expand-icon="visibility_off"
                :group="item.header == 'Conservation Lands' ? '' : 'myaccordion'"
              >
                <div class="q-mx-sm q-mb-md">
                  <q-expansion-item
                    label=""
                    caption=""
                    v-for="(layer, index) in item.subheaders"
                    :key="index"
                    header-class=""
                    expand="true"
                    dense
                  >
                    <template v-slot:header>
                      <div class="self-center">
                        <q-checkbox
                          size="xs"
                          v-model="layer.visible"
                          @update:model-value="mapStore.setLayerVisibility(layer)"
                        >
                        </q-checkbox>
                      </div>
                      <q-item-section>
                        <q-item-label class="text-subtitle1">{{ layer.title }} </q-item-label>
                      </q-item-section>
                    </template>
                    <q-list dense class="q-mx-md q-pb-md">
                      <draggable
                        v-model="layer.sublayers"
                        ghostClass="ghost"
                        @end="mapStore.updateLayerOrder(layer)"
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
                                    sublayer.visibleModel,
                                  )
                                "
                                >{{ sublayer.title }}</q-checkbox
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
                  </q-expansion-item>
                </div>
              </q-expansion-item>
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
              @click="mapStore.filterLayers('both')"
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
              @click="mapStore.filterLayers('wind')"
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
              @click="mapStore.filterLayers('solar')"
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
          <div v-if="mapStore.currentPoint !== ''">
            <p class="text-bold q-mb-none">Report Summary</p>

            <div class="row q-mb-md">
              <div
                class="col text-blue-grey-9 q-pa-sm text-center shadow-3 q-mr-sm"
                style="border-top: 4px solid lightcoral"
              >
                <div class="bg-grey-1 q-pa-sm q-mb-sm">
                  <p class="col text-body1 text-weight-medium q-pb-none q-mb-none">
                    Highly Sensitive
                  </p>
                </div>
                <!--ul class="q-pl-md text-left">
                 
                <li><p class="text-body2 text-left">{{ new Intl.NumberFormat('en-US', { notation: 'compact' }).format(mapStore.summary.highlySensitiveTotalArea) }} sq mi</p></li>
                <li><p class="text-body2">{{(mapStore.summary.highlySensitiveTotalArea/mapStore.summary.bufferArea)*100}}% of total area</p></li>
                <li-->

                <p class="text-caption">
                  Includes {{ mapStore.summary.highlySensitiveCount }} habitat types
                </p>
                <div class="row">
                  <div class="col text-left ellipsis">Name</div>
                  <div class="col text-right">Area (sq mi)</div>
                  <div class="col text-center">Percent of total</div>
                </div>
                <q-separator></q-separator>
                <div v-for="(item, index) in mapStore.summary.highlySensitiveHabitats" :key="index">
                  <div class="row">
                    <div
                      class="col-7 text-left"
                      style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap"
                    >
                      {{ item.name }}
                    </div>
                    <div class="col-1 text-right q-pr-sm">
                      {{
                        new Intl.NumberFormat('en-US', { notation: 'compact' }).format(item.area)
                      }}
                    </div>
                    <div class="col text-center q-ml-xs">
                      <div class="text-body2">
                        {{ getRange(item.percentOfTotal) }}
                      </div>
                      <!--div class="full-width" style="width:100%">
                          <q-badge
                            color="blue"
                            text-color="white"
                            :label="getRange(item.percentOfTotal)"
                          />
                        </div-->
                      <!--q-linear-progress size="20px" :value="item.percentOfTotal" color="blue">
                       
                      </q-linear-progress-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mb-md">
              <div
                class="col text-blue-grey-9 q-pa-sm text-center shadow-3 q-mr-sm"
                style="border-top: 4px solid #ffd580"
              >
                <div class="bg-grey-1">
                  <p class="col text-body1 text-weight-medium">
                    Moderately <br />
                    Sensitive
                  </p>
                </div>
                <ul class="q-pl-md text-left">
                  <li v-if="mapStore.summary.moderatelySensitiveTotalArea > 0">
                    <p class="text-body2 q-mb-none">Landscape connectivity</p>
                  </li>
                  <li v-if="mapStore.summary.moderatelySensitiveTotalArea > 0">
                    <p class="text-body2 text-left q-mb-none">
                      {{
                        new Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                          mapStore.summary.moderatelySensitiveTotalArea,
                        )
                      }}
                      sq mi
                    </p>
                  </li>
                  <li v-if="mapStore.summary.moderatelySensitiveTotalArea > 0">
                    <p class="text-body2">
                      {{
                        new Intl.NumberFormat('en-US', {
                          style: 'percent',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(
                          mapStore.summary.moderatelySensitiveTotalArea /
                            mapStore.summary.bufferArea,
                        )
                      }}
                      of total area
                    </p>
                  </li>
                  <li v-if="mapStore.summary.moderatelySensitiveTotalArea == 0">
                    <p class="text-body2">None intersecting buffer</p>
                  </li>
                </ul>
              </div>
              <div
                class="col text-blue-grey-9 q-pa-sm text-center shadow-3 q-mr-sm"
                style="border-top: 4px solid green"
              >
                <div class="bg-grey-1">
                  <p class="col text-body1 text-weight-medium">
                    Degraded <br />
                    Lands
                  </p>
                </div>
                <ul class="q-pl-md text-left">
                  <li v-if="mapStore.summary.brownfields > 0">
                    <p class="text-body2 text-left q-mb-none">
                      Brownfields: {{ mapStore.summary.brownfields }}
                    </p>
                  </li>
                  <li v-if="mapStore.summary.waterBodies > 0">
                    <p class="text-body2 q-mb-none">
                      Low impact water bodies: {{ mapStore.summary.waterBodies }}
                    </p>
                  </li>
                  <li v-if="mapStore.summary.minesTotalArea > 0">
                    <p class="text-body2">
                      Mines:
                      {{
                        new Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                          mapStore.summary.minesTotalArea,
                        )
                      }}
                      sq mi
                    </p>
                  </li>
                  <li
                    v-if="
                      mapStore.summary.minesTotalArea == 0 &&
                      mapStore.summary.waterBodies == 0 &&
                      mapStore.summary.brownfields == 0
                    "
                  >
                    <p class="text-body2">None intersecting buffer</p>
                  </li>
                </ul>
              </div>
            </div>
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
              <!-- layers intersecting extent-->
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
              <!-- layers not intersecting-->
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
          </div>
        </q-scroll-area>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<style>
.headerClass {
  background: #ffffff;
  border: 1px solid #e0e0e0;
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
