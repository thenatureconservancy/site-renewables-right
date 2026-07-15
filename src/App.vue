<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMapStore } from '@/stores/map'
import { useHelpStore } from './stores/help'
import { useShepherd } from 'vue-shepherd'
import TheHelp from '@/components/TheHelp.vue'
import { ref } from 'vue'
const tour = useShepherd({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: 'shepherd-theme-bright',
    scrollTo: { behavior: 'smooth', block: 'center' },
    cancelIcon: { enabled: true },
  },
})

//import esri component libs globally so they are available in multiple components
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-basemap-gallery'
import '@arcgis/map-components/components/arcgis-layer-list'
import '@arcgis/map-components/components/arcgis-search'
import '@arcgis/map-components/components/arcgis-zoom'
import '@arcgis/map-components/components/arcgis-home'
import '@arcgis/map-components/components/arcgis-legend'
import "@arcgis/map-components/components/arcgis-scale-bar";

const mapStore = useMapStore()
const helpStore = useHelpStore()

const $q = useQuasar()
const mobile = computed(() => {
  return $q.screen.lt.sm || $q.screen.lt.xs ? true : false
})

onMounted(async () => {
  tour.addStep({
    attachTo: { element: '#energyType', on: 'right' },
    title: '1: Select energy type',
    text: 'This will filter the layers to show only those relevant to the energy type you want to develop on your site.',
    cancelIcon: {
      enabled: true,
      label: '✖',
      className: 'shepherd-cancel-icon',
    },
    buttons: [
      {
        text: 'Next',
        action: tour.next,
      },
    ],
  })

  tour.addStep({
    attachTo: { element: '#dataDownload', on: 'right' },
    title: '2: Download data & report',
    text: 'Download all data as a .zip file and a report summarizing potential risks and considerations for your site.  The report button becomes active after you have selected a site on the map.',
    cancelIcon: {
      enabled: true,
      label: '✖',
      className: 'shepherd-cancel-icon',
    },
    buttons: [
      {
        text: 'Finish',
        action: tour.cancel,
      },
    ],
  })
})
const height = ref(window.innerHeight)
const width = ref(window.innerWidth / 2.2)
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-dark text-body1">
      <q-toolbar>
        <a href="https://www.nature.org/en-us/">
          <img
            src="./assets/logo.svg"
            :style="mobile ? 'width: 100px;' : 'width: 100px; padding-top: 5px; margin: 5px'"
        /></a>
        <q-separator vertical spaced inset></q-separator>
        <span :class="mobile ? 'text-body2' : 'q-ml-md text-weight-bold'">
          Site Renewables Right</span
        >
        <q-space></q-space>

        <div style="border: 1.5px solid red">
          <p class="text-overline q-mb-none q-pa-xs text-red" style="font-size: 25px">
            Draft - Internal use only
          </p>
        </div>
        <q-space></q-space>
        <q-btn
          color="blue"
          class="q-mr-sm"
          label="Download Data"
          unelevated
          square
          size="12px"
          icon="download"
          outline
        ></q-btn>
        <q-btn
          color="primary"
          class="q-mr-sm"
          label="Start Tour"
          unelevated
          square
          size="12px"
          icon="play_arrow"
          @click="tour.start()"
          flat
        ></q-btn>

        <q-btn
          color="primary"
          label="Help"
          flat
          icon="info_outline"
          unelevated
          square
          size="12px"
          @click="mapStore.showHelpPanel = true"
        ></q-btn>
        <q-btn
          class="q-ml-sm"
          color="primary"
          flat
          label="About"
          unelevated
          square
          size="12px"
          @click="helpStore.showDialog = true"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>
    <q-drawer
      class="shadow-5 no-scroll full-height"
      overlay
      v-model="mapStore.showHelpPanel"
      side="right"
      :width="width"
      :height="height"
      bordered
    >
      <q-toolbar class="bg-blue-grey-9 text-white">
        <span class="text-h6 text-weight-bold">Help Topics</span>
        <q-space></q-space>
        <q-btn flat icon="close" @click="mapStore.showHelpPanel = false"></q-btn>
      </q-toolbar>
      <TheHelp ></TheHelp>
   
    </q-drawer>
  </q-layout>
</template>
