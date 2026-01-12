<script setup>
import { markRaw, ref, onMounted } from 'vue'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import ArcGISOnline from './ArcGISOnline.vue'
import TheReport from './TheReport.vue'

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
  let nativeLands = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/9',
    id: 'nativeLands',
    visible: false,
    opacity: 1,
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
      nativeLands,
      bufferLayer,
      pointLayer,
    ],
  })
  mapStore.filterLayers('solar')
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
    <arcgis-zoom position="top-left"></arcgis-zoom>
    <arcgis-search
      position="top-right"
      search-extent='{"xmin": -125, "ymin": 24.396308, "xmax": -66.93457, "ymax": 49.384358, "spatialReference": {"wkid": 4326}}'
    ></arcgis-search>

    <!-- help button next to search-->
    <q-btn
      square
      padding="2px"
      flat
      unelevated=""
      class=""
      size="md"
      color="grey-9"
      icon="o_info"
      style="position: absolute; top: 16px; right: 15px; z-index: 999"
    >
      <q-tooltip
        ><p class="text-body2 text-white q-mb-none">
          For coordinates, use format: longitude, latitude (ie: -75.16, 39.95)
        </p></q-tooltip
      >
    </q-btn>
    <!-- opacity control knob-->
    <div
      style="z-index: 999; position: absolute; left: 65px; top: 15px"
      class="row text-center bg-white q-pa-xs items-center shadow-3 rounded-borders"
    >
      <div class="col items-center" style="padding: 1.5px">
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
          <q-icon name="opacity" size="sm" class="text-green-9"> </q-icon>
          <q-tooltip class="text-body2">Set opacity: {{ mapStore.opacity }}%</q-tooltip>
        </q-knob>
      </div>
    </div>
    <!-- reset zoom button-->
    <q-btn
      size="md"
      @click="zoomHome()"
      padding="6px"
      class="text-primary shadow-3 rounded-borders bg-white"
      unelevated
      square
      icon="home"
      stack
      style="z-index: 999; position: absolute; left: 179px; top: 15px"
      ><q-tooltip class="text-body2">Reset zoom</q-tooltip>
    </q-btn>
    <!-- agol login-->
    <q-btn
      style="z-index: 999; position: absolute; left: 135px; top: 15px"
      @click="agolStore.showDialog = true"
      icon="img:globe.png"
      size="md"
      color="white"
      padding="6px"
      class="text-green-9 shadow-3 rounded-borders"
      unelevated
      square
      stack
      ><q-tooltip class="text-body2">Sign in to ArcGIS Online to add your data</q-tooltip>
    </q-btn>

    <!-- report summary boxes-->
    <div
      class="bg-white shadow-3 rounded-borders"
      v-if="mapStore.currentPoint !== '' && mapStore.tab == 'sketch'"
      style="z-index: 999; position: absolute; right: 15px; bottom: 30px; width: 300px"
    >
      <the-report></the-report>
    </div>
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
