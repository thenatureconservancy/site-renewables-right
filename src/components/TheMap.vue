<script setup>
import { markRaw, ref, onMounted } from 'vue'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import ArcGISOnline from './ArcGISOnline.vue'
import TheReport from './TheReport.vue'
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'

import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer'

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

  let bigGameSolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'bigGameSolar',
    sublayers: [{ id: 10 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let birdsWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'birdsWind',
    sublayers: [{ id: 11 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let prairieGrouse = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'prairieGrouse',
    sublayers: [{ id: 15 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let protectedAreas = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'protectedAreas',
    sublayers: [{ id: 6 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let resilientConnected = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'resilientConnected',
    sublayers: [{ id: 4 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let threatenedEndangeredSpecies = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'threatenedEndangeredSpecies',
    sublayers: [{ id: 18 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let floodPlainsWetlands = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'floodPlainsWetlands',
    sublayers: [{ id: 3 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let whoopingCraneSolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopingCraneSolar',
    sublayers: [{ id: 20 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let whoopingCraneWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopingCraneWind',
    sublayers: [{ id: 21 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let qualitywater = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/6',
    id: 'qualitywater',
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  // moderate sensitive
  let landscape = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'landscape',
    sublayers: [{ id: 16 }],
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  let landscapeIntactness = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'landscapeIntactness',
    sublayers: [{ id: 23 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })

  let migratoryBirdStopoverWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'migratoryBirdStopoverWind',
    sublayers: [{ id: 13 }],
    visible: false,
    opacity: 1,
    maxScale: 300000,
  })
  // degraded and disturbed lands
  let abandonedmines = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/7',
    id: 'abandonedmines',
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  let brownfields = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/8',
    id: 'brownfields',
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  // agriculture
  let abandonedag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'abandonedag',
    sublayers: [{ id: 1 }],
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  let highestag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'highestag',
    sublayers: [{ id: 2 }],
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  let nativeLands = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/9',
    id: 'nativeLands',
    visible: true,
    opacity: 1,
    maxScale: 300000,
  })
  let imageLayer = new ImageryLayer({
    // URL to the imagery service
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/SRR_MosaicRasters/ImageServer',
    visible: false,
    id: 'imageLayer',
  })
  //defining graphic layers to be used with the buffer tool
  let bufferLayer = new GraphicsLayer({ id: 'bufferLayer', listMode: 'hide' })
  let pointLayer = new GraphicsLayer({ id: 'pointLayer', listMode: 'hide' })
  const basemap = new Basemap({
    portalItem: {
      id: '1f48b2b2456c44ad9c58d6741378c2ba', // Replace with your desired basemap item ID (e.g., "668f436dc2dc4f2c83ceb0c064380590" for Topo US worldview)
    },
  })

  //todo: verify if reporting layers need to be added to map.
  arcgisMap.map = new Map({
    basemap: basemap,
    layers: [
      highestag,
      abandonedag,
      brownfields,
      abandonedmines,
      landscapeIntactness,
      landscape,
      migratoryBirdStopoverWind,
      qualitywater,
      bigGameSolar,
      birdsWind,
      prairieGrouse,
      protectedAreas,
      resilientConnected,
      threatenedEndangeredSpecies,
      floodPlainsWetlands,
      whoopingCraneSolar,
      whoopingCraneWind,
      nativeLands,
      bufferLayer,
      pointLayer,
      imageLayer,
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
