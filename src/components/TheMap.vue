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

onMounted(() => {
  const arcgisSwipe = document.querySelector('arcgis-swipe')
  const arcgisMap = document.querySelector('arcgis-map')

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
  let brownfields_swipe = new FeatureLayer({
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
  //a copy of the opportunities layer group is used to turn on and off the
  //swipe tool.  could not find a way to turn off and reinitiate this component. So
  //I am just hiding it and the associated layers when the user turns on and off the compare
  let swipeLayers = new MapImageLayer({
    // URL to the service
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer',
    sublayers: mapStore.opportunitiesLayersReverse(),
    title: 'Opportunities for Development',
    id: 'swipeLayers',
  })
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
    id: 'intersectingFeatures',
    visible: false,
  })
  //defining graphic layers to be used with the buffer tool
  let bufferLayer = new GraphicsLayer({ id: 'bufferLayer' })
  let pointLayer = new GraphicsLayer({ id: 'pointLayer' })

  arcgisMap.map = new Map({
    basemap: 'dark-gray',
    layers: [
      develop,
      minimize,
      avoid,
      swipeLayers,
      brownfields_opp,
      brownfields_swipe,
      bufferLayer,
      pointLayer,
      intersectingFeatures,
    ],
  })

  //set up listener for swipe
  arcgisSwipe.addEventListener('arcgisPropertyChange', (e) => {
    if (e.detail.name === 'state' && arcgisSwipe.state === 'ready') {
      arcgisMap.constraints.maxZoom = 11
      arcgisSwipe.trailingLayers.add(swipeLayers)
      arcgisSwipe.trailingLayers.add(brownfields_swipe)
      arcgisSwipe.leadingLayers.add(minimize)
      arcgisSwipe.leadingLayers.add(avoid)
    }
  })

  arcgisMap.addEventListener('arcgisViewClick', (e) => {
    mapStore.createBuffer(e)
  })
  //add legend symbols to toc layers list
  mapStore.getLegendData()
})
</script>

<template>
  <arcgis-map id="my-map" center="-95.5348, 38.7946" zoom="3">
    <arcgis-swipe v-show="mapStore.compare" swipe-position="50"></arcgis-swipe>
    <div
      v-if="mapStore.compare"
      style="position: absolute; left: 0px; width: calc(50%); top: 0px; z-index: 999"
    >
      <q-item-label
        overline
        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
        class="text-center q-pa-sm text-white text-bold"
        >AVOID / MINIMIZE DEVELOPMENT
      </q-item-label>
    </div>
    <div
      v-if="mapStore.compare"
      style="position: absolute; right: 0px; width: calc(50%); top: 0px; z-index: 999"
    >
      <q-item-label
        overline
        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
        class="text-center q-pa-sm text-white text-bold"
      >
        OPPORTUNITIES FOR DEVELOPMENT
      </q-item-label>
    </div>
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
