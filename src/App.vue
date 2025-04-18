<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useQuasar } from 'quasar'

//import esri component libs globally so they are available in multiple components 
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-swipe";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-search";

const $q = useQuasar()
const mobile = computed(() => {
  return $q.screen.lt.sm || $q.screen.lt.xs ? true : false
})
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-dark text-body1 shadow-1">
      <q-toolbar>
       <a href="https://www.nature.org/en-us/"> <img
          src="./assets/logo.svg"
          :style="
            mobile
              ? 'width: 100px;'
              : 'width: 100px; padding-top: 5px; margin: 5px'
          "
        ></img></a>
        <q-separator vertical spaced inset></q-separator>
        <span :class="mobile ? 'text-body2' : 'q-ml-md text-weight-bold' ">
          Site Renewables Right</span
        >
        <q-space></q-space>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>
   
  </q-layout>
</template>


<style scoped></style>
