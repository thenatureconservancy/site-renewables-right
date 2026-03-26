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
  if (mapStore.checkboxHideSplash) {
    localStorage.setItem('showSRRSplash', 'hide')
  } else {
    localStorage.setItem('showSRRSplash', 'show')
  }
}

onMounted(() => {
  //set initial active tool to legend
  if (localStorage.getItem('showSRRSplash') == 'hide') {
    mapStore.checkboxHideSplash = true
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
  <q-dialog
    persistent=""
    transition-show="slide-right"
    transition-hide="slide-left"
    transition-duration="250"
    v-model="helpStore.showDialog"
    backdrop-filter="blur(4px)"
    full-width=""
  >
    <q-card class="q-pa-none q-ma-none no-scrollbar" style="overflow: hidden">
      <div class="row q-pa-none q-ma-none">
        <q-card-section class="col-sm-5 col-md-6 col-lg-6 q-pa-none q-ma-none">
          <q-img
            src="/srr.png"
            style="object-fit: contain; max-width: 100%; max-height: 100%; margin-bottom: 0px"
            alt="windmills"
          >
          </q-img>
        </q-card-section>

        <q-card-section
          class="col-sm-7 col-md-6 col-lg-6 q-pa-lg column self-stretch"
          style="min-height: 0"
        >
          <q-scroll-area style="height: calc(100vh - 100px)" class="q-pa-lg">
            <div id="topdiv">
              <a href="https://www.nature.org/en-us/">
                <img
                  src="../assets/logo.svg"
                  :style="mobile ? 'width: 100px;' : 'width: 150px; padding-top: 5px; margin: 5px'"
              /></a>
              <p class="text-overline text-green-9 text-weight-bold">
                CLEAN ENERGY TOOL (NAME COMING SOON)
              </p>
              <p class="text-h6">
                Accelerating clean energy that works in harmony with nature and people
              </p>
              <p class="text-body2 text-italic">
                For a clean energy project to come together, developers need the right land
                topography, a nearby grid connection, willing landowners and more. Finding locations
                that fulfill all these requirements is a challenge unto itself.

                <br />
                <br />

                When projects are proposed in places that are important to communities and the
                environment, they can be met with opposition—at times amplified by
                misinformation—that leads to project delays, cost increases and cancelations. These
                challenges slow the clean energy transition at a time when pace and scale are
                critical.

                <br />
                <br />

                With energy demand rising, clean energy plays an important role in quickly
                delivering affordable, reliable power. This tool helps inform the development of
                projects with benefits for climate, conservation and communities—the “3Cs”—with the
                goal of building public support for rapid clean energy deployment.

                <br />
                <br />

                This tool is a first-stop, early screening tool for planning, siting and procuring
                renewable energy projects. It can be used for high-level information gathering about
                sensitive wildlife and habitat as well as best practices for engaging communities
                and Tribes. It can help with identifying potential risks and late-stage surprises.

                <br />
                <br />

                This tool is not intended to be used on its own to determine where clean energy
                should or should not be sited. The datasets are high-quality, but they are also
                coarse. They serve to complement—not replace—site-level assessments, community input
                and consultations with local, state and federal agencies.
              </p>
            </div>
            <div class="row q-mt-xl">
              <div id="bottom-div" class="text-left col-6 self-center">
                <q-checkbox size="xs" v-model="mapStore.checkboxHideSplash">
                  <span class="text-body2 text-weight-medium">
                    Hide splash screen at startup</span
                  ></q-checkbox
                >
              </div>
              <div class="text-right q-pt-lg col-6">
                <q-btn
                  unelevated=""
                  color="primary"
                  square
                  label="Enter Tool"
                  icon-right="arrow_forward_ios"
                  size="md"
                  class="q-mb-md"
                  @click="dialogControl()"
                />
              </div>

              <!--div class="text-caption q-pa-md" style="border-top: 1px solid gainsboro">
                TNC is advancing energy solutions that reduce carbon emissions, protect natural
                lands and support livelihoods worldwide. Visit us at
                <a
                  href="https://www.nature.org/en-us/what-we-do/our-priorities/tackle-climate-change/clean-energy-transition/"
                  target="_blank"
                  >nature.org</a
                >
                to learn more.
              </div-->
            </div>
          </q-scroll-area>
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
<style>
.q-dialog__inner {
  overflow-y: auto; /* still lets it scroll if needed */
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
}

.q-dialog__inner::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.q-dialog__inner--standard .q-dialog__inner::-web {
  display: none;
}
</style>
