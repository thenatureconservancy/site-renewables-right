<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { startTour } from '@/utils/appTour'
import { onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMapStore } from '@/stores/map'
import { useHelpStore } from './stores/help'
import TheHelp from '@/components/TheHelp.vue'
import { ref } from 'vue'


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


const height = ref(window.innerHeight)
const width = ref(window.innerWidth / 2.2)
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-dark text-body1">
      <q-toolbar>
        <a href="https://www.nature.org/en-us/" target="_blank">
          <img
            src="./assets/tnc_globe.jpg"
            style="width: 30px;margin-top:3px; "
          />
      </a>
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
          data-tour="download-data"
        ></q-btn>
        <q-btn
          color="primary"
          class="q-mr-sm"
          label="Start Tour"
          unelevated
          square
          size="12px"
          icon="play_arrow"
          @click="startTour(mapStore)"
          flat
        ></q-btn>

        <q-btn
          color="primary"
          label="Layer Info"
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
      
      <TheHelp ></TheHelp>
   
    </q-drawer>
  </q-layout>
</template>
