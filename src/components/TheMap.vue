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
import TileLayer from '@arcgis/core/layers/TileLayer'
import Basemap from '@arcgis/core/Basemap'
import TheIntersectionResults from '@/components/TheIntersectionResults.vue'
import BasemapSwitcher from '@/components/BasemapSwitcher.vue'
import DistanceMeasurement2DViewModel from '@arcgis/core/widgets/DistanceMeasurement2D/DistanceMeasurement2DViewModel.js'
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
let measureVM = null
const measuring = ref(false)

function toggleMeasure() {
  if (measuring.value) {
    stopMeasure()
  } else {
    startMeasure()
  }
}

function startMeasure() {
  console.log('starting measure')
  measuring.value = true
  measureVM?.start()
}

function stopMeasure() {
  measuring.value = false
  measureVM?.clear()
}
onMounted(() => {
  const arcgisMap = document.querySelector('arcgis-map')
  // highly sensitive
  let bats = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'bats',
    sublayers: [{ id: 25 }],
    visible: false,
    opacity: 1,
  })
  let bigGameSolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'bigGameSolar',
    sublayers: [{ id: 10 }],
    visible: false,
    opacity: 1,
  })
  let birdsWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'birdsWind',
    sublayers: [{ id: 11 }],
    visible: false,
    opacity: 1,
  })
  let prairieGrouse = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'prairieGrouse',
    sublayers: [{ id: 30 }],
    visible: false,
    opacity: 1,
  })
  let protectedAreas = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'protectedAreas',
    sublayers: [{ id: 6 }],
    visible: false,
    opacity: 1,
  })
  let resilientConnected = new TileLayer({
    url: 'https://tiles.arcgis.com/tiles/F7DSX1DSNSiWmOqh/arcgis/rest/services/RCN_Simple/MapServer',
    id: 'resilientConnected',
    visible: false,
    opacity: 1,
  })
  let threatenedEndangeredSpecies = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'threatenedEndangeredSpecies',
    sublayers: [{ id: 18 }],
    visible: false,
    opacity: 1,
  })
  let floodPlainsWetlands = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'floodPlainsWetlands',
    sublayers: [{ id: 3 }],
    visible: false,
    opacity: 1,
  })
  let whoopingCraneSolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopingCraneSolar',
    sublayers: [{ id: 28 }],
    visible: false,
    opacity: 1,
  })
  let whoopingCraneWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'whoopingCraneWind',
    sublayers: [{ id: 29 }],
    visible: false,
    opacity: 1,
  })
  let qualitywater = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/6',
    id: 'qualitywater',
    visible: false,
    opacity: 0.8,
  })
  let landscapeIntactness = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'landscapeIntactness',
    sublayers: [{ id: 23 }],
    visible: false,
    opacity: 1,
  })
  let migratoryBirdStopoverWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'migratoryBirdStopoverWind',
    sublayers: [{ id: 13 }],
    visible: false,
    opacity: 1,
  })
  // degraded and disturbed lands
  let abandonedmines = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/7',
    id: 'abandonedmines',
    visible: false,
    opacity: 0.8,
  })
  let brownfields = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/8',
    id: 'brownfields',
    visible: false,
    opacity: 0.8,
  })
  // agriculture
  let highestag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'highestag',
    sublayers: [{ id: 12 }],
    visible: false,
    opacity: 0.8,
  })
  let ag2 = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'ag2',
    sublayers: [{ id: 37 }],
    visible: false,
    opacity: 0.8,
  })
  let ag3 = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'ag3',
    sublayers: [{ id: 35 }],
    visible: false,
    opacity: 0.8,
  })
  let ag4 = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'ag4',
    sublayers: [{ id: 36 }],
    visible: false,
    opacity: 0.8,
  })
  let abandonedag = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'abandonedag',
    sublayers: [{ id: 27 }],
    visible: false,
    opacity: 0.8,
  })
  //wind and solar best locations
  let lassoWind = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'lassoWind',
    sublayers: [{ id: 2 }],
    visible: false,
    opacity: 0.8,
  })
  let lassoSolar = new MapImageLayer({
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters/MapServer',
    id: 'lassoSolar',
    sublayers: [{ id: 1 }],
    visible: false,
    opacity: 0.8,
  })
  // native lands
  let nativeLands = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/9',
    id: 'nativeLands',
    visible: true,
    opacity: 1,

    popupTemplate: {
      title: '{NAME}',
      content:
        "This federally recognized tribal entity's functional status is defined as a(n) {FUNC_D}. The Census type is classified as: {AIANNHType}.",
    },
  })
  //mosaic layer for in
  let imageLayer = new ImageryLayer({
    // URL to the imagery service
    url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/SRR_MosaicRasters/ImageServer',
    visible: false,
    id: 'imageLayer',
  })
  //water limited areas
  let waterLimited = new TileLayer({
    url: 'https://tiles.arcgis.com/tiles/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_WaterLimitedLand/MapServer',
    id: 'waterLimited',
    visible: false,
  })
  // CJEST
  // vector tile layer
  let cjest = new VectorTileLayer({
    url: 'https://vectortileservices.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CJEST_SRR_VTL/VectorTileServer',
    style: 'styles/P200_I_PFS.json',
    id: 'cjest',
    visible: false,
  })
  //feature layer for vector tile
  let cjestFL = new FeatureLayer({
    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CJEST_SRR_VTL/FeatureServer/0',
    id: 'cjestFL',
    visible: false,
    opacity: 0.8,
  })
  let states = new FeatureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized_Boundaries/FeatureServer/0',
    id: 'states',
    visible: true,
    // Added California to your filter expression
    definitionExpression:
      "STATE_NAME = 'Maine' or STATE_NAME = 'Georgia' or STATE_NAME = 'California'",
    minScale: 9244648,

    labelingInfo: [
      {
        labelPlacement: 'always-horizontal',

        labelExpressionInfo: {
          expression: "'ℹ️ View ' + $feature.STATE_NAME + ' Info'",
        },
        symbol: {
          type: 'text',
          color: '#FFFFFF',
          font: {
            size: 11,
            weight: 'bold',
            family: 'sans-serif',
          },
          backgroundColor: '#0079c1',
          borderLineColor: '#004b75',
          borderLineSize: 1,
          haloColor: '#0079c1',
          haloSize: 4,
        },
      },
    ],
    popupTemplate: {
      title: '{STATE_NAME} Details',
      content: (feature) => {
        const state = feature.graphic.attributes.STATE_NAME

        if (state === 'Maine') {
          return `
      <strong>Maine Policy Details:</strong>
        TNC recommends referring to <a href="https://www.maine.gov/dep/land/rules/index.html" target="_blank">
        Maine Department of Environmental Protection’s Chapter 375 rules</a> and permitting information for
        solar energy on <a href="https://www.maine.gov/dacf/ard/solar/solar-hval.shtml" target="_blank">
        high-value agricultural land.</a> These policies were supported by TNC and other partners and
        developed with extensive public input.
      `
        }

        if (state === 'Georgia') {
          return `
        <strong>Georgia Solar Details:</strong> 
        TNC recommends use of the <a href="https://galowimpactsolar.tnc.org/" target="_blank">Georgia Low Impact Solar Siting Tool</a> as an environmental sensitivity screening tool to guide solar development to places of lower environmental impact. The tool was developed by TNC, United States Fish and Wildlife Service, Georgia Department of Natural Resources, industry stakeholders and others.
      `
        }

        if (state === 'California') {
          return `
        <strong>California Policy Details:</strong> TNC recommends use of the State of California’s screening tool for energy planning, developed with TNC and other stakeholders: <a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC 2023 Land-Use Screens for Electric System Planning</a>
      `
        }

        return 'No information available.'
      },
    },

    renderer: {
      type: 'simple',
      symbol: {
        type: 'simple-fill',
        color: [246, 245, 239, 0.9],
        outline: {
          color: [246, 245, 239, 0.9], // beige fill, 0.9 opacity
          width: 6,
        },
      },
    },
  })

  //defining graphic layers to be used with the buffer tool
  let bufferLayer = new GraphicsLayer({ id: 'bufferLayer', listMode: 'hide' })
  let pointLayer = new GraphicsLayer({ id: 'pointLayer', listMode: 'hide' })
  const basemap = new Basemap({
    portalItem: {
      id: 'd22aed9a4acb4bc8ae8f2141732af496', // Replace with your desired basemap item ID (e.g., "668f436dc2dc4f2c83ceb0c064380590" for Topo US worldview)
    },
  })

  //todo: verify if reporting layers need to be added to map.
  arcgisMap.map = new Map({
    basemap: basemap,
    layers: [
      highestag,
      ag2,
      ag3,
      ag4,
      abandonedag,
      waterLimited,
      brownfields,
      abandonedmines,
      cjest,
      cjestFL,
      lassoSolar,
      lassoWind,
      migratoryBirdStopoverWind,
      landscapeIntactness,
      birdsWind,
      qualitywater,
      whoopingCraneSolar,
      whoopingCraneWind,
      threatenedEndangeredSpecies,
      resilientConnected,
      protectedAreas,
      prairieGrouse,
      floodPlainsWetlands,
      bigGameSolar,
      bats,
      nativeLands,
      states,
      bufferLayer,
      pointLayer,
      imageLayer,
    ],
  })

  mapStore.filterLayers('solar')

  arcgisMap.addEventListener('arcgisViewChange', (e) => {
    console.log('CurrentExtent:', arcgisMap.scale)
    arcgisMap.extent ? (mapStore.currentMapExtent = markRaw(arcgisMap.extent)) : ''
    arcgisMap.zoom > 3 ? (showResetZoomButton.value = true) : (showResetZoomButton.value = false)
  })
  arcgisMap.addEventListener('arcgisViewDoubleClick', async (e) => {
    if (measuring.value == false) {
      mapStore.showDemo = true
      try {
        bufferLayer.visible = true
        pointLayer.visible = true
        mapStore.createBuffer(e)
        // Ensure a selection layer exists and clear prior selections
        let selectionLayer = arcgisMap.map.findLayerById('Selection')
        if (!selectionLayer) {
          selectionLayer = new GraphicsLayer({ title: 'Selection' })
          arcgisMap.view.map.add(selectionLayer)
        } else {
          selectionLayer.removeAll()
        }
      } catch (err) {
        console.error('Guarded query error:', err)
      }
    }
  })
  arcgisMap.addEventListener('arcgisViewClick', async (e) => {
    if (measuring.value == false) {
      try {
        //set a watch for popup
        let selectionLayer = arcgisMap.map.findLayerById('Selection')
        if (!selectionLayer) {
          selectionLayer = new GraphicsLayer({ title: 'Selection' })
          arcgisMap.view.map.add(selectionLayer)
        } else {
          selectionLayer.removeAll()
        }
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
                  { label: 'Climate Burdened', field: 'N_CLT_EOMI' },
                  { label: 'Energy Burdened', field: 'N_ENY_EOMI' },
                  { label: 'Transportation Burdened', field: 'N_TRN_EOMI' },
                  { label: 'Housing Burdened', field: 'N_HSG_EOMI' },
                  { label: 'Pollution Burdened', field: 'N_PLN_EOMI' },
                  { label: 'Water Burdened', field: 'N_WTR_EOMI' },
                  { label: 'Health Burdened', field: 'N_HLTH_90' },
                  { label: 'Workforce Burdened', field: 'N_WKFC_91' },
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
          No Burdened categories flagged for this feature.
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
            Burdened Categories
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
            Low Income Percentile
          </div>
          <div style="font:700 14px/1.2 system-ui;color:#1f2937">${decileDisplay}</div>
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
    }
  })
  arcgisMap.addEventListener('arcgisViewReadyChange', (event) => {
    // Force the popup to always open in a docked state
    arcgisMap.view.popup.dockEnabled = true

    // Configure default docking placement and behavior
    arcgisMap.view.popup.dockOptions = {
      // Set the default position (e.g., "bottom-right", "top-right", "top-left", "bottom-left")
      position: 'bottom-right',

      // Set to false to prevent the popup from undocking on large screens
      breakpoint: false,

      // Set to false if you want to hide the manual dock/undock toggle button
      buttonEnabled: true,
    }
    measureVM = new DistanceMeasurement2DViewModel({
      view: event.target.view,
      unit: 'meters',
    })
  })
  const slider = document.querySelector('calcite-slider')
  slider.addEventListener('calciteSliderChange', (event) => {
    mapStore.opacity = event.target.value / 100
    mapStore.changeOpacity()
  })
})
</script>

<template>
  <arcgis-map
    id="my-map"
    center="-95.5348, 38.7946"
    zoom="3"
    :constraints="{ scale: 18000, minZoom: 2, maxZoom: 14, rotationEnabled: false }"
  >
    <arcgis-scale-bar position="bottom-right" bar-style="line" unit="metric"></arcgis-scale-bar>
    <arcgis-zoom position="top-left"></arcgis-zoom>
    <q-btn
      square
      padding="2px"
      flat
      unelevated=""
      class=""
      size="sm"
      color="grey-9"
      label="*lon, lat"
      style="position: absolute; top: 50px; right: 20px; z-index: 999"
    >
      <q-tooltip
        ><p class="text-body2 text-white q-mb-none">
          For coordinates, use format: longitude, latitude ie: -75.16, 39.95
        </p></q-tooltip
      >
    </q-btn>
    <!--arcgis-legend position="bottom-left"></arcgis-legend-->
    <arcgis-search
      position="top-right"
      search-extent='{"xmin": -125, "ymin": 24.396308, "xmax": -66.93457, "ymax": 49.384358, "spatialReference": {"wkid": 4326}}'
    ></arcgis-search>
    <div style="position: absolute; bottom: 15px; left: 15px; z-index: 999">
      <BasemapSwitcher />
    </div>
    <!-- help button next to search-->

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
      class="text-primary shadow-3 bg-white"
      unelevated
      square
      icon="home"
      stack
      style="z-index: 999; position: absolute; left: 145px; top: 15px"
      ><q-tooltip class="text-body2">Reset zoom</q-tooltip>
    </q-btn>
    <q-btn
      size="md"
      @click="toggleMeasure()"
      padding="6px"
      :class="
        measuring == false ? 'text-primary shadow-3 bg-white' : 'text-primary shadow-3 bg-green-2'
      "
      unelevated
      square
      icon="straighten"
      stack
      style="z-index: 999; position: absolute; left: 185px; top: 15px"
      ><q-tooltip class="text-body2">Measure distance</q-tooltip>
    </q-btn>
    <!-- agol login-->
    <q-btn
      style="z-index: 999; position: absolute; left: 105px; top: 15px"
      @click="agolStore.showDialog = true"
      icon="img:globe.png"
      size="md"
      color="white"
      padding="6px"
      class="text-green-9 shadow-3"
      unelevated
      square
      stack
      ><q-tooltip class="text-body2">Sign in to ArcGIS Online to add your data</q-tooltip>
    </q-btn>

    <!-- report summary boxes-->

    <TheIntersectionResults />
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
  height: calc(100vh - 50px);
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
