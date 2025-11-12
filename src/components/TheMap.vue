<script setup>
import { markRaw, ref, onMounted } from 'vue'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import ArcGISOnline from './ArcGISOnline.vue'

/**GET STORE */
import { useMapStore } from '../stores/map'
import { useAgolStore } from '@/stores/arcGisOnline'
const agolStore = useAgolStore()
const mapStore = useMapStore()
const showResetZoomButton = ref(false)

function zoomHome() {
  const arcgisMap = document.querySelector('arcgis-map')
  arcgisMap.zoom = 3
  arcgisMap.center = '-95.5348, 38.7946'
}
onMounted(() => {
  const arcgisMap = document.querySelector('arcgis-map')
  // highly sensitive
  let wetlands = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'wetlands',
    sublayers: [{ id: 3 }],
    visible: true,
    opacity: 1,
  })
  let protectedL = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'protected',
    sublayers: [{ id: 6 }],
    visible: true,
    opacity: 1,
  })
  let resilient = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'resilient',
    sublayers: [{ id: 7 }],
    visible: true,
    opacity: 1,
  })
  let prairie = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'prairie',
    sublayers: [{ id: 5 }],
    visible: true,
    opacity: 1,
  })
  let whoopwind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopwind',
    sublayers: [{ id: 8 }],
    visible: true,
    opacity: 1,
  })
  let whoopsolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopsolar',
    sublayers: [{ id: 9 }],
    visible: true,
    opacity: 1,
  })
  let qualitywater = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/6',
    id: 'qualitywater',
    visible: true,
    opacity: 0.8,
  })
  // moderate sensitive
  let landscape = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'landscape',
    sublayers: [{ id: 4 }],
    visible: true,
    opacity: 0.8,
  })
  // degraded and disturbed lands
  let abandonedmines = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/7',
    id: 'abandonedmines',
    visible: true,
    opacity: 0.8,
  })
  let brownfields = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/8',
    id: 'brownfields',
    visible: true,
    opacity: 0.8,
  })
  // agriculture
  let abandonedag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'abandonedag',
    sublayers: [{ id: 1 }],
    visible: false,
    opacity: 0.8,
  })
  let highestag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'highestag',
    sublayers: [{ id: 2 }],
    visible: false,
    opacity: 0.8,
  })

  //defining graphic layers to be used with the buffer tool
  let bufferLayer = new GraphicsLayer({ id: 'bufferLayer', listMode: 'hide' })
  let pointLayer = new GraphicsLayer({ id: 'pointLayer', listMode: 'hide' })

  //todo: verify if reporting layers need to be added to map.
  arcgisMap.map = new Map({
    basemap: 'dark-gray',
    layers: [
      highestag,
      abandonedag,
      brownfields,
      abandonedmines,
      landscape,
      whoopsolar,
      whoopwind,
      prairie,
      resilient,
      protectedL,
      qualitywater,
      wetlands,
      bufferLayer,
      pointLayer,
    ],
  })

  arcgisMap.addEventListener('arcgisViewChange', (e) => {
    arcgisMap.extent ? (mapStore.currentMapExtent = markRaw(arcgisMap.extent)) : ''
    arcgisMap.zoom > 3 ? (showResetZoomButton.value = true) : (showResetZoomButton.value = false)
  })

  arcgisMap.addEventListener('arcgisViewClick', (e) => {
    if (mapStore.tab == 'sketch') {
      bufferLayer.visible = true
      pointLayer.visible = true
      mapStore.createBuffer(e)
    }
  })

  arcgisMap.when(() => {
    // Map is fully loaded
    mapStore.getLegendData()

    // Add other listeners after map is ready
    arcgisMap.addEventListener('arcgisViewChange', (e) => {
      if (arcgisMap.extent) {
        mapStore.currentMapExtent = markRaw(arcgisMap.extent)
      }
      showResetZoomButton.value = arcgisMap.zoom > 3
    })

    arcgisMap.addEventListener('arcgisViewClick', (e) => {
      if (mapStore.tab === 'sketch') {
        bufferLayer.visible = true
        pointLayer.visible = true
        mapStore.createBuffer(e)
      }
    })
  })

  //add legend symbols to toc layers list
  //mapStore.getLegendData()
  /*  let url = 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/8/legend?f=pjson';
    let _this = this;
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data.layers)
    })*/
})
</script>

<template>
  <arcgis-map id="my-map" center="-95.5348, 38.7946" zoom="3" :constraints="{ minZoom: 2 }">
    <arcgis-zoom position="top-right"></arcgis-zoom>
    <arcgis-search
      position="top-left"
      search-extent='{"xmin": -125, "ymin": 24.396308, "xmax": -66.93457, "ymax": 49.384358, "spatialReference": {"wkid": 4326}}'
    ></arcgis-search>
    <!-- help button next to search-->
    <q-btn
      square
      padding="xs"
      flat
      unelevated=""
      class="bg-grey-8"
      size="md"
      color="white"
      icon="o_info"
      style="position: absolute; top: 16px; left: 255px; z-index: 999"
    >
      <q-tooltip
        ><p class="text-caption text-white">
          To search by coordinates use the format: longitude, latitude (ie: -75.1652, 39.9526)
        </p></q-tooltip
      >
    </q-btn>
    <!-- reset zoom button-->
    <q-btn
      size="xl"
      @click="zoomHome()"
      color="white"
      padding="10px"
      class="text-green-9"
      unelevated
      square
      icon="home"
      stack
      style="z-index: 999; position: absolute; left: 64px; bottom: 30px"
      ><q-tooltip>Reset zoom</q-tooltip>
    </q-btn>
    <!-- report summary boxes-->
      <div class="bg-white" v-if="mapStore.currentPoint !== ''" style="z-index: 999; position: absolute; right: 15px; top: 15px; width: 300px; height:calc(100vh - 100px)" >
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
                <p class="text-body2 q-mb-none">Mines: {{ mapStore.summary.mines }}</p>
              </li>

              <li v-if="mapStore.summary.mines == 0 && mapStore.summary.brownfields == 0">
                <p class="text-body2">None intersecting buffer</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    <!-- opacity control knob-->
    <div
      style="z-index: 999; position: absolute; left: 264px; bottom: 30px"
      class="row text-center bg-white q-pa-xs items-center"
    >
    <div class="col items-center" style="padding: 1.5px;">
      <q-knob
    
        show-value
        font-size="14px"
        class="text-secondary q-mb-none"
        v-model="mapStore.opacity"
        size="50px"
        :thickness="0.3"
        color="primary"
        track-color="grey-4"
        @update:model-value="mapStore.changeOpacity()"
      >
        <q-icon name="opacity" size="sm" class="text-green-9">
         
        </q-icon> <q-tooltip>opacity: {{ mapStore.opacity }}%</q-tooltip>
      </q-knob>
    </div>
   
    </div>
    <!-- agol login-->
    <q-btn
      style="z-index: 999; position: absolute; left: 173px; bottom: 30px;"
        @click="agolStore.showDialog = true"
        icon="img:globe.png"
        size="xl"
        color="white"
        padding="10px"
        class="text-green-9"
        unelevated
        square
        stack
        ><q-tooltip>Sign in to ArcGIS Online to add your data</q-tooltip>
    </q-btn>
   
  </arcgis-map>
  <!-- agol add data dialog -->
  <keep-alive>
    <q-dialog v-model="agolStore.showDialog" position="bottom">
      <ArcGISOnline></ArcGISOnline>
    </q-dialog>
  </keep-alive>
  
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'https://js.arcgis.com/4.32/esri/themes/light/main.css';

#my-map {
  flex: 1;
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
