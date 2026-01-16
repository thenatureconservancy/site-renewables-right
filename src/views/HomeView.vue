<script setup>
import TheMap from '../components/TheMap.vue'
import TheLeftPanel from '@/components/TheLeftPanel.vue'
import TheHelp from '@/components/TheHelp.vue'
import TheLegend from '@/components/TheLegend.vue'
import TheReport from '@/components/TheReport_old.vue'
import { useMapStore } from '../stores/map'
import { useHelpStore } from '@/stores/help'
//import LocalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/LocalBasemapsSource.js'
import PortalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource.js'
import Basemap from '@arcgis/core/Basemap.js'
import LocalBasemapsSource from '@arcgis/core/widgets/BasemapGallery/support/LocalBasemapsSource.js'
import { ref, onMounted } from 'vue'
import { useAgolStore } from '@/stores/arcGisOnline'
import TileLayer from '@arcgis/core/layers/TileLayer'

const mapStore = useMapStore()
const helpStore = useHelpStore()

const agolStore = useAgolStore()
function openPanel(active) {
  mapStore.panelState = 'open'
  mapStore.activeTool = active
}
function dialogControl() {
  helpStore.showDialog = false
  localStorage.setItem('showSRRSplash', 'no')
}
onMounted(() => {
  //set initial active tool to legend
  if (localStorage.getItem('showSRRSplash') == 'no') {
    helpStore.showDialog = false
  } else {
    helpStore.showDialog = true
  }
  if (localStorage.getItem('SRRUserWantsAuth') == 'yes') {
    agolStore.showDialog = true
  }
  setTimeout(() => {
    console.log(portal)
  }, 5000)
})

const portal = new PortalBasemapsSource({
  portal: 'https://tnc.maps.arcgis.com',
  filterFunction: async (item, index, basemaps) => {
    let bool = true
    await item.load().then((loadedBasemap) => {
      console.log(loadedBasemap.title, loadedBasemap.portal)
     
      // filter out basemaps - console loadedBasemap.title to get list of names
      const basemaps = [
        'Enhanced Contrast Dark Map',
        'Enhanced Contrast Map',
        'Environment Map',
        'Imagery (WGS84)',
        'Light Gray Canvas',
        'Ocean Basemap',
        'OpenStreetMap',
        'Streets',
        // 'TNC Dark Gray Map',
        'TNC Outdoor Map',
        'USA NAIP Imagery',
        'USA Topo Maps',
        'USGS National Map',
        'World Hillshade',
        'World Imagery (Firefly)',
      ]

      if (basemaps.includes(loadedBasemap.title)) {
        bool = false
      }
    })

    return bool
  },
 
})


</script>

<template>
  <q-dialog v-model="helpStore.showDialog" backdrop-filter="blur(4px)" full-width="">
    <q-card class="q-pa-none q-ma-none">
      <div class="row q-pa-none q-ma-none">
        <q-card-section class="col-5 q-pa-none q-ma-none">
          <q-img
            src="/srr.png"
            style="object-fit: contain; max-width: 100%; max-height: auto; margin-bottom: 0px"
            alt="windmills"
          >
          </q-img>
        </q-card-section>

        <q-card-section class="q-pa-lg col-7">
          <p class="text-body1 q-ma-md">
            The Site Renewables Right tool identifies where renewable energy can be developed in the
            continental U.S. while considering the needs of communities, conservation, and climate.
            Site Renewables Right is an early screening tool meant to identify potential conflicts
            before they develop. The tool does not include technical feasibility specifications and
            is not to be used as a primary resource in siting wind or solar facilities. Instead,
            Site Renewables Right provides a basis for companies and communities to engage in the
            right conversations to avoid project delays and prevent impacts to the same communities
            and natural areas we aim to protect from climate change.
          </p>
          <div class="text-center q-pt-lg">
            <q-btn
              unelevated=""
              color="blue-grey-9"
              square
              label="Enter Site"
              size="lg"
              @click="dialogControl()"
            />
          </div>
          <div class="absolute-bottom text-caption q-pa-md" style="border-top: 1px solid gainsboro">
            TNC is advancing energy solutions that reduce carbon emissions, protect natural lands
            and support livelihoods worldwide. Visit us at
            <a
              href="https://www.nature.org/en-us/what-we-do/our-priorities/tackle-climate-change/clean-energy-transition/"
              target="_blank"
              >nature.org</a
            >
            to learn more.
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
  <div class="row">
    <div class="col-4"><TheLeftPanel></TheLeftPanel></div>

    <div class="col"><the-map></the-map></div>
    <div class="col-1" style="width: 40px">
      <div
        class="bg-white text-dark"
        style="height: 100%; border-right: 1px solid gainsboro; border-top: 1px solid gainsboro"
      >
        <div id="" class="text-center">
          <q-btn
            square
            padding="xs"
            flat
            size="md"
            :icon="mapStore.panelState == 'open' ? 'chevron_right' : 'chevron_left'"
            class="q-mt-md"
            @click="
              mapStore.panelState == 'open'
                ? (mapStore.panelState = 'closed')
                : (mapStore.panelState = 'open')
            "
          >
            <q-tooltip>Collapse | Expand</q-tooltip> </q-btn
          ><br />
          <q-btn
            square
            padding="xs"
            size="md"
            flat
            :class="
              mapStore.activeTool == 'legend' ? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'
            "
            @click.stop="openPanel('legend')"
          >
            <q-tooltip>Legend</q-tooltip>
            <calcite-icon icon="legend" scale="m"></calcite-icon> </q-btn
          ><br />
          <!--q-btn
            square
            padding="xs"
            flat
            size="md"
            :class="
              mapStore.activeTool == 'set opacity' ? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'
            "
            @click.stop="openPanel('set opacity')"
          >
            <q-tooltip>Set Opacity</q-tooltip>
            <calcite-icon icon="transparency" scale="m"></calcite-icon> </q-btn
          ><br /-->
          <q-btn
            square
            padding="xs"
            size="md"
            flat
            :class="
              mapStore.activeTool == 'basemaps' ? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'
            "
            @click.stop="openPanel('basemaps')"
          >
            <q-tooltip>Basemaps</q-tooltip>
            <calcite-icon icon="basemap" scale="m"></calcite-icon> </q-btn
          ><br />
          <!--q-btn
            square
            padding="xs"
            size="md"
            flat
            :class="
              mapStore.activeTool == 'supporting layers'
                ? 'q-mt-md bg-blue-grey-9 text-white'
                : 'q-mt-md'
            "
            @click.stop="openPanel('supporting layers')"
          >
            <q-tooltip>Supporting Layers</q-tooltip>
            <calcite-icon icon="layers" scale="m"></calcite-icon> </q-btn
          ><br /-->

          <q-btn
            square
            padding="xs"
            flat
            size="md"
            :class="mapStore.activeTool == 'help' ? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'"
            @click.stop="openPanel('help')"
          >
            <q-tooltip>Help</q-tooltip>
            <calcite-icon icon="question" scale="m"></calcite-icon>
          </q-btn>
          <!--q-btn
            square
            padding="xs"
            flat
            size="md"
            :class="
              mapStore.activeTool == 'Site Report' ? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'
            "
            @click.stop="openPanel('Site Report')"
          >
            <q-tooltip>Site Report</q-tooltip>
            <calcite-icon icon="file-report" scale="m"></calcite-icon>
          </q-btn-->
        </div>
      </div>
    </div>
    <div
      class="col-1"
      :style="
        mapStore.panelState == 'open' ? 'width: 25%; border-top: 1px solid gainsboro' : 'width: 0;'
      "
    >
      <div class="sub q-pa-sm q-ml-sm">
        <p class="text-caption q-mb-none text-weight-medium">
          {{ mapStore.activeTool.toUpperCase() }}
        </p>
      </div>
      <div v-show="mapStore.activeTool == 'Site Report'" id="report">
        <q-scroll-area style="height: calc(100vh - 50px)">
          <TheReport></TheReport>
        </q-scroll-area>
      </div>
      <div v-show="mapStore.activeTool == 'legend'" id="legend">
        <q-scroll-area style="height: calc(100vh - 90px)">
          <!--arcgis-legend reference-element="my-map"></arcgis-legend-->
          <TheLegend></TheLegend>
        </q-scroll-area>
      </div>
      <div v-show="mapStore.activeTool == 'basemaps'" id="basemaps" class="basemaps">
        <q-scroll-area style="height: calc(100vh - 90px)">
          <arcgis-basemap-gallery
            reference-element="my-map"
            :source="portal"
          ></arcgis-basemap-gallery>
        </q-scroll-area>
      </div>
      <div v-if="mapStore.activeTool == 'set opacity'" class="text-center">
        <q-scroll-area style="height: calc(100vh - 90px)">
          <q-knob
            show-value
            font-size="20px"
            class="text-secondary q-mt-xl"
            v-model="mapStore.opacity"
            size="130px"
            :thickness="0.3"
            color="secondary"
            track-color="grey-3"
            @update:model-value="mapStore.changeOpacity()"
          >
            <q-icon name="opacity" class="">
              <q-tooltip>opacity: {{ mapStore.opacity }}%</q-tooltip>
            </q-icon>
          </q-knob>
          <p class="text-h6 q-mt-md">{{ mapStore.opacity }}%</p>
        </q-scroll-area>
      </div>

      <div v-if="mapStore.activeTool == 'help'">
        <q-scroll-area style="height: calc(100vh - 90px)">
          <TheHelp></TheHelp>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>
