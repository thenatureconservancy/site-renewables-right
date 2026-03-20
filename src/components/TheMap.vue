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
    sublayers: [{ id: 12 }],
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
    popupTemplate: {
      title: '{NAME}',
      content:
        "This federally recognized tribal entity's functional status is defined as a(n) {FUNC_D}. The Census type is classified as: {AIANNHType}.",
    },
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
  //feature layer for vector tile
  let cjestFL = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CJEST_SRR_VTL/FeatureServer/0',
    id: 'cjestFL',
    visible: false,
    opacity: 0.8,
    maxScale: 300000,
  })
  //states for ca
  let states = new FeatureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer/0',
    id: 'states',
    visible: false,
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
  //button overlay
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
        <a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC 2023 Land-Use Screens for Electric System Planning</a>
       
      </div>
    `,
    },
  })
  const buttonLayer = new GraphicsLayer({
    id: 'buttonLayer',
    listMode: 'hide',
    visible: false,
    minScale: 18489297.737236,
  })
  buttonLayer.add(centroidGraphic)

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
      cjestFL,
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
  })

  arcgisMap.addEventListener('arcgisViewClick', async (e) => {
    try {
      if (mapStore.tab == 'sketch') {
        bufferLayer.visible = true
        pointLayer.visible = true
        mapStore.createBuffer(e)
      }

      // Ensure a selection layer exists and clear prior selections
      let selectionLayer = arcgisMap.view.map.layers.find((l) => l.title === 'Selection')
      if (!selectionLayer) {
        selectionLayer = new GraphicsLayer({ title: 'Selection' })
        arcgisMap.view.map.add(selectionLayer)
      } else {
        selectionLayer.removeAll()
      }
      //set a watch for popup

      const mapPoint = e.detail.mapPoint

      // --- HIT TEST GUARD ---
      // Convert to screen coords for hitTest, then check topmost result
      const screenPoint = arcgisMap.view.toScreen(mapPoint)
      const hit = await arcgisMap.view.hitTest(screenPoint)
      console.log(hit)
      if (!hit.results || hit.results.length === 0) {
        // No visible layer was hit at this location — skip the polygon query
        console.log('No layer was hit; skipping polygon query.')
        return
      }

      const top = hit.results[0]
      if (top.layer.id !== 'cjest') {
        // Something else is on top; do not query cjestFL
        console.log('Topmost hit is not cjestFL; skipping polygon query.')
        return
      }
      // --- END HIT TEST GUARD ---

      // Proceed with spatial query on cjestFL
      const query = cjestFL.createQuery()
      query.geometry = mapPoint
      query.spatialRelationship = 'intersects'
      query.returnGeometry = true // needed to build polygon graphics
      query.outFields = ['*'] // tighten to specific fields if desired

      const featureSet = await cjestFL.queryFeatures(query)
      const features = featureSet.features

      if (!features.length) {
        console.log('No polygon contains that point.')
        return
      }

      // Create graphics from returned polygon features
      const polygonGraphics = features.map((f) => {
        return new Graphic({
          geometry: f.geometry,
          attributes: f.attributes,
          symbol: {
            type: 'simple-fill',
            color: [0, 0, 0, 0],
            outline: {
              color: [0, 255, 255, 1],
              width: 0,
            },
          },
          popupTemplate: {
            title: 'Community Details', // adjust to your field name
            content: (event) => {
              const a = event.graphic.attributes

              // Define the fields and human-friendly labels
              const fields = [
                { label: 'Climate Disadvantaged', field: 'N_CLT_EOMI' },
                { label: 'Energy Disadvantaged', field: 'N_ENY_EOMI' },
                { label: 'Transportation Disadvantaged', field: 'N_TRN_EOMI' },
                { label: 'Housing Disadvantaged', field: 'N_HSG_EOMI' },
                { label: 'Pollution Disadvantaged', field: 'N_PLN_EOMI' },
                { label: 'Water Disadvantaged', field: 'N_WTR_EOMI' },
                { label: 'Health Disadvantaged', field: 'N_HLTH_90' },
                { label: 'Workforce Disadvantaged', field: 'N_WKFC_91' },
              ]

              // Keep only the 'Yes' ones (value === 1), then sort by label A→Z
              const yesOnly = fields
                .filter(({ field }) => Number(a[field]) === 1)
                .sort((x, y) => x.label.localeCompare(y.label))

              // Chip renderer (green "Yes" pill)
              const yesChip = `
      <span style="
        padding:2px 10px;border-radius:999px;
        font:600 12px system-ui,-apple-system,'Segoe UI',Roboto,Arial;
        color:#0a7a0a;background:rgba(10,122,10,.12);
        border:1px solid rgba(10,122,10,.35);
        white-space:nowrap;
      ">✓ Yes</span>`

              // Rows for each 'Yes' category
              const rows = yesOnly
                .map(
                  ({ label }) => `
      <div style="
        display:grid;grid-template-columns:1fr auto;
        align-items:center;padding:6px 8px;
        border-bottom:1px dashed rgba(0,0,0,.08)
      ">
        <div style="font:500 13px/1.3 system-ui">${label}</div>
        ${yesChip}
      </div>
    `,
                )
                .join('')

              // If no categories are 'Yes', show an empty state
              const yesSection = yesOnly.length
                ? `
        <div style="border:1px solid rgba(0,0,0,.08);border-radius:8px;overflow:hidden">
          ${rows}
        </div>`
                : `
        <div style="
          padding:10px;border:1px solid rgba(0,0,0,.08);
          border-radius:8px;background:rgba(120,120,120,.06);
          font:500 13px system-ui;color:#555
        ">
          No disadvantaged categories flagged for this feature.
        </div>`
              // ---- Percent (rounded to nearest 10) from P200_I_PFS ----
              const raw = a['P200_I_PFS']
              
              let decileDisplay = '—'

              if (raw !== null && raw !== undefined && raw !== '') {
                const num = Number(raw)
                if (!Number.isNaN(num)) {
                  let pct = null

                  if (num > 0 && num <= 1) {
                    // Value is 0–1 (fraction) → convert to percent
                    pct = num * 100
                  } else if (num >= 0 && num <= 100) {
                    // Value is already 0–100 (percent)
                    pct = num
                  } else if (num >= 1 && num <= 10 && Number.isInteger(num)) {
                    // Value is a decile 1–10 → convert to percent
                    pct = (num / 10) * 100
                  }

                  if (pct !== null) {
                    // Round to nearest 10 and clamp to 0..100
                    const rounded = Math.min(100, Math.max(0, Math.round(pct / 10) * 10))
                    decileDisplay = `${rounded}%`
                  }
                }
              }
              // ---------------------------------------

              // Build final HTML
              const container = document.createElement('div')
              container.innerHTML = `
      <div style="max-width:520px">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem">
          <div style="font:600 14px/1.2 system-ui;color:#1b5eab;letter-spacing:.2px">
            Disadvantaged Categories
          </div>
          <div style="font:12px/1 system-ui;color:#333">
            ${yesOnly.length} selected
          </div>
        </div>

        ${yesSection}

        <!-- Decile card -->
        <div style="
          display:flex;justify-content:space-between;align-items:center;
          margin-top:.75rem;padding:.6rem .7rem;
          border:1px solid rgba(0,0,0,.08);border-radius:8px;
          background:linear-gradient(180deg, rgba(27,94,171,0.06), rgba(27,94,171,0.02))
        ">
          <div style="font:600 13px/1.2 system-ui;color:#1b5eab">
            Household Income Percentile
          </div>
          <div style="font:700 14px/1.2 system-ui;color:#1f2937">${decileDisplay} - ${raw}</div>
        </div>
      </div>
    `
              return container
            },
          },
        })
      })

      // Add to selection layer
      selectionLayer.addMany(polygonGraphics)

      // Optional: open popup at click with all returned features
      arcgisMap.view.popup.open({
        location: mapPoint,
        features: polygonGraphics,
      })

      console.log(`Added ${polygonGraphics.length} polygon graphic(s) to Selection layer.`)
    } catch (err) {
      console.error('Guarded query error:', err)
    }
  })

  const slider = document.querySelector('calcite-slider')
  slider.addEventListener('calciteSliderChange', (event) => {
    mapStore.opacity = event.target.value / 100
    mapStore.changeOpacity()
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
      @click="mapStore.showOpacity = !mapStore.showOpacity"
      padding="6px"
      class="text-primary shadow-3 bg-white"
      unelevated
      square
      
      icon="opacity"
      stack
      style="z-index: 999; position: absolute; left: 65px; top: 15px"
      ><q-tooltip class="text-body2">Set layers opacity</q-tooltip>
    </q-btn>
    <q-slide-transition>
      <div
        class="bg-white q-pt-md q-px-md"
        v-show="mapStore.showOpacity"
        style="z-index: 999; position: absolute; left: 65px; top: 60px; width: 200px"
      >
        <calcite-label>
          Layers Opacity (%)
          <calcite-slider
            value="90"
            label-handles
            label-ticks
            max-label="100"
            min-label="0"
            ticks="100"
            class="green-slider"
          ></calcite-slider>
        </calcite-label>
      </div>
    </q-slide-transition>
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
      class="text-primary shadow-3  bg-white"
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
      class="text-green-9 shadow-3 "
      unelevated
      square
      stack
      ><q-tooltip class="text-body2">Sign in to ArcGIS Online to add your data</q-tooltip>
    </q-btn>

    <!-- report summary boxes-->
    <div
      class="bg-white shadow-3 rounded-borders"
      v-if="mapStore.tab == 'sketch'"
      style="z-index: 999; position: absolute; right: 15px; bottom: 30px; width: 300px"
    >
      <the-report></the-report>
    </div>
    <div>
      <q-btn
        v-if="mapStore.tab !== 'sketch'"
        style="z-index: 999; position: absolute; right: 15px; bottom: 30px; width: 300px"
        size="md"
        color="primary"
        class="q-mb-md q-ml-sm"
        label="Get site report"
        icon="article"
        square
        unelevated=""
        @click="mapStore.tab = 'sketch'"
      >
        <q-tooltip>Click to start site report</q-tooltip>
      </q-btn>
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

h2.esri-widget__heading {
  font-size: 14px !important;
  line-height: 1 !important;
}

calcite-slider {
  --calcite-color-brand: #49a942;
}
</style>
