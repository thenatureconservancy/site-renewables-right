<script setup>
import { markRaw, ref, onMounted, computed, watch, reactive } from 'vue'
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
  })
  let brownfields = new FeatureLayer({
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
    id: 'brownfields',
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
    listMode: 'hide',
    id: 'intersectingFeatures',
    visible: false,
  })
  //defining graphic layers to be used with the buffer tool
  let bufferLayer = new GraphicsLayer({ id: 'bufferLayer', listMode: 'hide' })
  let pointLayer = new GraphicsLayer({ id: 'pointLayer', listMode: 'hide' })

  arcgisMap.map = new Map({
    basemap: 'dark-gray',
    layers: [brownfields, develop, minimize, avoid, bufferLayer, pointLayer, intersectingFeatures],
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
  //add legend symbols to toc layers list
  mapStore.getLegendData()
})
</script>

<template>
  <arcgis-map id="my-map" center="-95.5348, 38.7946" zoom="3" :constraints="{ minZoom: 2 }">
    <arcgis-zoom position="bottom-left"></arcgis-zoom>
    <arcgis-search
      position="top-left"
      search-extent='{"xmin": -125, "ymin": 24.396308, "xmax": -66.93457, "ymax": 49.384358, "spatialReference": {"wkid": 4326}}'
    ></arcgis-search>

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

    <!--q-btn
      v-if="mapStore.panelState == 'open'"
      size="12px"
      @click="mapStore.togglePanel()"
      color="white"
      padding=""
      class="text-blue"
      unelevated
      square
      style="z-index: 999; position: absolute; right: 15px; top: 15px"
    >
      Close Panel
    </q-btn>
    <q-btn
      v-else
      size="12px"
      @click="mapStore.togglePanel()"
      color="white"
      padding=""
      class="text-blue"
      unelevated
      square
      style="z-index: 999; position: absolute; right: 15px; top: 15px"
    >
      Open Panel
    </q-btn-->
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
    <div
      style="z-index: 999; position: absolute; right: 15px; bottom: 15px"
      class="text-center bg-white q-px-sm q-pt-sm q-mb-md"
    >
      <q-knob
        show-value
        font-size="20px"
        class="text-secondary q-mb-none"
        v-model="mapStore.opacity"
        size="50px"
        :thickness="0.3"
        color="primary"
        track-color="grey-3"
        @update:model-value="mapStore.changeOpacity()"
      >
        <q-icon name="opacity" class="text-blue-grey-9">
          <q-tooltip>opacity: {{ mapStore.opacity }}%</q-tooltip>
        </q-icon>
      </q-knob>
      <p class="text-body1 text-blue-grey-9 q-mb-xs" style="text-shadow: 1px 1px 2px lightgray">
        &nbsp;{{ mapStore.opacity }}%
      </p>
    </div>
    <div
      style="z-index: 999; position: absolute; right: 95px; bottom: 15px; height: 86px"
      class="text-center bg-white q-pa-xs q-mb-md"
    >
      <q-btn
        @click="agolStore.showDialog = true"
        color="primary"
        :ripple="false"
        flat
        padding="xs"
        stack
        no-caps=""
        icon="img:globe.png"
        size="xl"
        class="q-mt-sm"
        ><p class="text-body2 text-weight-medium">Add Data</p>
      </q-btn>
    </div>
  </arcgis-map>
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
