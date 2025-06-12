<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import TextSymbol from '@arcgis/core/symbols/TextSymbol.js'
import Graphic from '@arcgis/core/Graphic.js'
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils.js'
import DrawAction from '@arcgis/core/views/draw/DrawAction.js'

/**GET STORE */
import { useMapStore } from '../stores/map'
const mapStore = useMapStore()
const showResetZoomButton = ref(false)
function zoomHome() {
  const arcgisMap = document.querySelector('arcgis-map')
  arcgisMap.zoom = 3
  arcgisMap.center = '-95.5348, 38.7946'
}
onMounted(() => {
  const arcgisMap = document.querySelector('arcgis-map')

/**WATCH */


  let avoid = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer',
    sublayers: mapStore.avoidLayersReverse(),
    title: 'Avoid Development',
    id: 'avoid',
  })
  let minimize = new MapImageLayer({
    // URL to the service
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer',
    sublayers: mapStore.layers[0].subheaders[1].sublayers,
    title: 'Minimize Development',
    id: 'minimize',
  })
  let develop = new MapImageLayer({
    // URL to the service
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer',
    sublayers: mapStore.opportunitiesLayersReverse(),
    title: 'Opportunities for Development',
    id: 'opportunities',
    visible: false,
  })
  /*let brownfields_swipe = new FeatureLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer/0',
    renderer: {
      type: 'simple',
      symbol: {
        type: 'simple-marker',
        size: 4,
        color: '#FDFD96',
        outline: {
          color: 'white',
          width: 0.5,
        },
      },
    },
    id: 'brownfields_swipe',
    title: 'Opportunities for Development:Brownfields over 50acres',
  })
  let brownfields_opp = new FeatureLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer/0',
    renderer: {
      type: 'simple',
      symbol: {
        type: 'simple-marker',
        size: 4,
        color: '#FDFD96',
        outline: {
          color: 'white',
          width: 0.5,
        },
      },
    },
    visible: false,
    id: 'brownfields_opp',
  })
  let swipeLayers = new MapImageLayer({
    // URL to the service
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer',
    sublayers: mapStore.opportunitiesLayersReverse(),
    title: 'Opportunities for Development',
    id: 'swipeLayers',
  })*/
  //these layers will be used for the reporting.  The viewable map layers are raster. These
  //are polygons
  let intersectingFeatures = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer',
    sublayers: [
      { id: 17 },
      { id: 20 },
      { id: 21 },
      { id: 22 },
      { id: 23 },
      { id: 24 },
      { id: 25 },
      { id: 26 },
      { id: 27 },
      { id: 28 },
      { id: 30 },
    ],
    listMode: 'hide',
    id: 'intersectingFeatures',
    visible: false,
  })
  //defining graphic layers to be used with the buffer tool
  let bufferLayer = new GraphicsLayer({ id: 'bufferLayer', listMode: 'hide' })
  let pointLayer = new GraphicsLayer({ id: 'pointLayer', listMode: 'hide' })
  watch(
    () => mapStore.panelState,
    () => {
      if(mapStore.panelState == 'open' && mapStore.activeTool == 'Site Report') {
        bufferLayer.visible = true
        pointLayer.visible = true
      }
      else {
        bufferLayer.visible = false
        pointLayer.visible = false
      }
    }
  )
  watch(
    () => mapStore.activeTool,
    () => {
      if(mapStore.panelState == 'open' && mapStore.activeTool == 'Site Report') {
        bufferLayer.visible = true
        pointLayer.visible = true
      }
      else {
        bufferLayer.visible = false
        pointLayer.visible = false
      }
    }
  )
  arcgisMap.map = new Map({
    basemap: 'dark-gray',
    layers: [develop, minimize, avoid, bufferLayer, pointLayer, intersectingFeatures],
  })

  arcgisMap.addEventListener('arcgisViewChange', (e) => {
    console.log('view changed', e)
    arcgisMap.zoom > 3 ? (showResetZoomButton.value = true) : (showResetZoomButton.value = false)
  })

  arcgisMap.addEventListener('arcgisViewClick', (e) => {
    if (mapStore.activeTool == 'Site Report' && mapStore.panelState == 'open') {
      bufferLayer.visible = true
      pointLayer.visible = true
      mapStore.createBuffer(e)
    }
  })
  //add legend symbols to toc layers list
  mapStore.getLegendData()
})
</script>

<template>
  <arcgis-map id="my-map" center="-95.5348, 38.7946" zoom="3">
    <arcgis-zoom position="bottom-left"></arcgis-zoom>
    <arcgis-search position="top-left"></arcgis-search>
    <q-btn
      v-if="showResetZoomButton"
      size="12px"
      @click="zoomHome()"
      color="white"
      padding=""
      class="text-blue"
      unelevated
      square
      style="z-index: 999; position: absolute; right: 15px; top: 15px"
      >Reset Zoom</q-btn
    >
  </arcgis-map>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'https://js.arcgis.com/4.32/esri/themes/light/main.css';

#my-map {
  flex: 1;
  min-height: calc(100vh - 120px);
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
