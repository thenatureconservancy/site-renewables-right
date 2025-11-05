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
    sublayers: [{id: 3}],
    visible: true,
    opacity: .8
  })
  let protectedL = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'protected',
    sublayers: [{id: 6}],
    visible: true,
    opacity: .8
  })
  let resilient = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'resilient',
    sublayers: [{id: 7}],
    visible: true,
    opacity: .8
  })
  let prairie = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'prairie',
    sublayers: [{id: 5}],
    visible: true,
    opacity: .8
  })
  let whoopwind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopwind',
    sublayers: [{id: 8}],
    visible: true,
    opacity: .8
  })
   let whoopsolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopsolar',
    sublayers: [{id: 9}],
    visible: true,
    opacity: .8
  })
  let qualitywater = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/6',
    id: 'qualitywater',
    visible: true,
    opacity: .8
  })
  // moderate sensitive
  let landscape = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'landscape',
    sublayers: [{id: 4}],
    visible: true,
    opacity: .8
  })
  // degraded and disturbed lands
  let abandonedmines = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/7',
    id: 'abandonedmines',
    visible: true,
    opacity: .8
  })
   let brownfields = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/8',
    id: 'brownfields',
    visible: true,
    opacity: .8
  })
  // agriculture
  let abandonedag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'abandonedag',
    sublayers: [{id: 1}],
    visible: false,
    opacity: .8
  })

  let highestag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'highestag',
    sublayers: [{id: 2}],
    visible: false,
    opacity: .8
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
    layers: [ abandonedmines, brownfields, wetlands, protectedL, resilient, qualitywater, 
    prairie, whoopsolar, whoopwind, landscape,  
    highestag,abandonedag, bufferLayer, pointLayer],
    
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
  mapStore.getLegendData();

  // Add other listeners after map is ready
  arcgisMap.addEventListener('arcgisViewChange', (e) => {
    if (arcgisMap.extent) {
      mapStore.currentMapExtent = markRaw(arcgisMap.extent);
    }
    showResetZoomButton.value = arcgisMap.zoom > 3;
  });

  arcgisMap.addEventListener('arcgisViewClick', (e) => {
    if (mapStore.tab === 'sketch') {
      bufferLayer.visible = true;
      pointLayer.visible = true;
      mapStore.createBuffer(e);
    }
  });
});

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

  <arcgis-map  id="my-map" center="-95.5348, 38.7946" zoom="3" :constraints="{ minZoom: 2 }">
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
