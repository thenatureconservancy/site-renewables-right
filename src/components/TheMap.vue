<script setup>
import { markRaw, ref, onMounted } from 'vue'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import ArcGISOnline from './ArcGISOnline.vue'
import TheReport from './TheReport.vue'
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer'
import Graphic from '@arcgis/core/Graphic'

import Basemap from '@arcgis/core/Basemap'

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
    sublayers: [{ id: 24 }],
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
  // native lands
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
  // CJEST

  // vector tile layer
  let cjest = new VectorTileLayer({
    url: 'https://vectortileservices.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CJEST_SRR_VTL/VectorTileServer',
    style: 'styles/N_CLT_EOMI.json',
    id: 'cjest',
    visible: false,
  })

  let states = new FeatureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer/0',
    id: 'states',
    visible: true,
    definitionExpression: "STATE_NAME = 'California'",
    minScale: 18489297.737236,
    renderer: {
      type: 'simple',
      symbol: {
        type: 'simple-fill',
        color: [51, 51, 51, 0.9], // white fill, 0.9 opacity
        outline: {
          color: [0, 0, 0, 0], // fully transparent outline
          width: 6,
        },
      },
    },
  })

  const centroidGraphic = new Graphic({
    geometry: {
      type: 'point',
      latitude: 35.71698590073627,
      longitude: -119.0476256315448,
    },
    symbol: {
      type: 'picture-marker',
      url: 'moreinfo.png', // your icon here
      width: '65px',
      height: '25px',
      backgroundColor: [255, 255, 255, 0.9], // soft white plate
      outline: {
        color: [0, 0, 0, 0.15],
        width: 1,
      },
    },
    popupTemplate: {
      content: `
      <div>
        <h6>California Policy Details</h6>
        <p>Link to CA Details</p>
        <button onclick="myPopupAction()">Click Me</button>
      </div>
    `,
    },
  })
  const buttonLayer = new GraphicsLayer({
    id: 'buttonLayer',
    listMode: 'hide',
  })
  buttonLayer.add(centroidGraphic)

  // import Map from "@arcgis/core/Map";
  // import MapView from "@arcgis/core/views/MapView";
  // import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
  /*
  const cjestDots = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CJEST_SRR_VTL/FeatureServer/0',
    title: 'PFS (size-only circles)',
    id: 'cjestDots',
    visible: false,
    renderer: {
      type: 'simple',
      symbol: {
        type: 'simple-marker',
        style: 'circle',
        size: 8,
        color: '#000000', // your signature purple
        outline: { color: '#FFFFFF', width: 0.75 },
      },
      visualVariables: [
        {
          type: 'size',
          field: 'P200_I_PFS',
          stops: [
            { value: 0.0, size: 3 },
            { value: 1.0, size: 13 },
          ],
        },
      ],
    },
  })*/

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
      cjest,
      migratoryBirdStopoverWind,
      landscapeIntactness,
      landscape,
      qualitywater,
      whoopingCraneSolar,
      whoopingCraneWind,
      threatenedEndangeredSpecies,
      resilientConnected,
      protectedAreas,
      prairieGrouse,
      floodPlainsWetlands,
      bigGameSolar,
      birdsWind,
      nativeLands,
      states,
      bufferLayer,
      pointLayer,
      imageLayer,
      buttonLayer,
    ],
  })

  mapStore.filterLayers('solar')
  arcgisMap.addEventListener('arcgisViewChange', (e) => {
    arcgisMap.extent ? (mapStore.currentMapExtent = markRaw(arcgisMap.extent)) : ''
    arcgisMap.zoom > 3 ? (showResetZoomButton.value = true) : (showResetZoomButton.value = false)

    const view = e.target.view
    arcgisMap.zoom > 3 && mapStore.layers[0].expanded
      ? (buttonLayer.visible = true)
      : (buttonLayer.visible = false)
    // Now you can control the popup
    view.popup.visibleElements = {
      title: false,
      closeButton: false,
    }
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
    <q-btn
      size="md"
      @click="mapStore.changeOpacity()"
      padding="6px"
      class="text-primary shadow-3 rounded-borders bg-white"
      unelevated
      square
      icon="opacity"
      stack
      style="z-index: 999; position: absolute; left: 65px; top: 15px"
      ><q-tooltip class="text-body2">Set opacity</q-tooltip>
    </q-btn>
    <!--div
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
    </div-->
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
      style="z-index: 999; position: absolute; left: 145px; top: 15px"
      ><q-tooltip class="text-body2">Reset zoom</q-tooltip>
    </q-btn>
    <!-- agol login-->
    <q-btn
      style="z-index: 999; position: absolute; left: 105px; top: 15px"
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
  <div
    id="hover-tooltip"
    style="
      position: absolute;
      pointer-events: auto;
      background: white;
      border-radius: 4px;
      padding: 8px 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      font-family: sans-serif;
      font-size: 12px;
      display: none;
      z-index: 999;
    "
  >
    <div id="tooltip-content"></div>
    <button id="tooltip-button">Click me</button>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import 'https://js.arcgis.com/4.32/esri/themes/light/main.css';

#my-map {
  flex: 1;
  height: 100%;
  width: 100%;
  position: relative;
}
.header {
  display: none !important;
}

.esri-popup__header {
  display: none !important;
}
</style>
