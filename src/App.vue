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
import '@arcgis/map-components/components/arcgis-scale-bar'

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
    <q-header class="bg-white text-dark text-body1 shadow-1"   data-tour="header-about">
      <q-toolbar>
        <a href="https://www.nature.org/en-us/" target="_blank">
          <img src="./assets/tnc_globe.jpg" style="width: 30px; margin-top: 3px" />
        </a>
        <q-separator vertical spaced inset class="bg-green-1"></q-separator>
        <div class="app-title-block">
          <p class="app-title">
            <span class="title-strong">Clean Energy </span>
            <span class="title-accent">Compass</span>
          </p>
          <div class="app-subtitle">
            Navigating 3Cs considerations for clean energy
            planning
          </div>
        </div>
        <q-space></q-space>

        
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
          href="https://tnc.app.box.com/file/2402477476742?s=0u67qsxf5s9ydcb8yigdcrztmztobw4o"
          target="_blank"
        ></q-btn>
       
        <q-btn
          color="secondary"
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
          color="secondary"
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
          color="secondary"
          flat
          label="About"
          unelevated
          square
          size="12px"
          @click="helpStore.showDialog = true"
          data-tour="header-about"
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
      <TheHelp></TheHelp>
    </q-drawer>
  </q-layout>
</template>
<style scoped>
.app-title-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.15;
  margin: 10px;
}

.app-title {
  font-weight: 600;
  font-size: 22px;
  letter-spacing: -0.3px;
  margin: 0;
}
.title-strong {
  color: #1a3a2e;
}
.title-accent {
  color: #64b45b;
}

.app-subtitle {
  font-size: 12px;
  color: #5c635f;
  font-weight: 400;
  letter-spacing: 0.1px;
  margin-top: 2px;
  white-space: nowrap; /* keep it one line */
  
}
.subtitle-accent { color: #1a3a2e; font-weight: 700; }
.q-header.soft-shadow {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05) !important;
}
</style>
