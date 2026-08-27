<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed } from 'vue'
import TheLayersList from './TheLayersList.vue'

const mapStore = useMapStore()
const showLayers = ref(true)
const showTools = ref(true)
const showFilter = ref(true)
const toolsHeight = 52
const filterHeight = 58

const scrollHeight = computed(() => ({
  height: `calc(100vh - ${
    150 + (showTools.value ? toolsHeight : 0) + (showFilter.value ? filterHeight : 0)
  }px)`,
}))
</script>
<template>
  <div class="q-mx-xs" style="border-top: 1px solid lightgray" data-tour="intro-text">
    <div id="tools" class="q-pb-md q-mt-sm" style="border-bottom: 1px solid lightgrey" data-tour="tools-header">
      <q-toolbar class="q-mb-md q-pa-none section-header" data-tour="tools-header">
        <p class="text-overline q-ml-sm q-mb-none text-bold">TOOLS</p>
        <q-space></q-space>
        <q-btn
          color="white"
          icon="help_outline"
          size="sm"
          padding="xs"
          flat
          class="q-ml-sm q-mr-md"
        >
          <q-menu>
            <div class="q-pa-md" style="width: 300px">
              <p class="">
                <b>Site report:</b> Click this button to drop a pin on the map, choose buffer size,
                and generate an intersection summary. <br /><br />
                <b>Layer Info:</b> This button opens the info panel with a table of contents for
                each of the data layers and their descriptions.
              </p>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <q-slide-transition>
        <div v-show="showTools">
          <div class="q-pb-md">
            <q-btn
              color="secondary"
              size="12px"
              icon="table_chart"
              label="Site report"
              square
              unelevated
              data-tour="tools-report"
              :flat="mapStore.showSiteReport ? false : true"
              @click="
                mapStore.showSiteReport ? mapStore.hideSiteReport() : mapStore.viewSiteReport()
              "
            ></q-btn>
            <q-btn
              class="q-ml-sm"
              label="Layer Info"
              size="12px"
              color="secondary"
              icon="o_info"
              square
              unelevated
              data-tour="tools-layer-info"
              :flat="mapStore.showHelpPanel ? false : true"
              @click="mapStore.showHelpPanel = !mapStore.showHelpPanel"
            ></q-btn>
          </div>
        </div>
      </q-slide-transition>
    </div>

    <q-toolbar class="q-mb-sm q-pa-none section-header" data-tour="data-layers">
      <p class="text-overline q-ml-sm q-mb-none text-bold">DATA LAYERS</p>
      <q-space></q-space>
      <q-btn color="white" icon="help_outline" size="sm" padding="xs" flat class="q-ml-sm q-mr-md">
        <q-menu>
          <div class="q-pa-md" style="width: 300px">
            <p class="">
              <b>Category:</b> Click each category to expand the list of layers and turn them on or
              off. Only one category can be active at a time. With the exception of indigenous
              lands, which can be toggled on or off at any time. <br /><br />
              <b>Drag Indicator:</b> If a drag indicator appears next to a layer, you can click and
              drag it to reorder how the layers appear on the map. <br /><br />
              <b>Info Button:</b> This button opens the layer info panel and will route you to the
              specific layer information. <br /><br />
              <b>Opacity Button:</b> Allows you to adjust the transparency of the layer on the map.
              <br /><br />
            </p>
          </div>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-scroll-area
      class="q-pr-sm"
      :style="scrollHeight"
      :thumb-style="{
        right: '2px',
        borderRadius: '8px',
        backgroundColor: '#64B45B',
        width: '4px',
        opacity: 0.3,
      }"
      :bar-style="{
        right: '2px',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        width: '4px',
      }"
    >
      <q-slide-transition>
        <div v-show="showLayers">
          <the-layers-list></the-layers-list>
        </div>
      </q-slide-transition>
    </q-scroll-area>
  </div>
</template>
<style>
.section-header {
  background: #34406b; /* deep solar blue */
  color: #ffffff; /* white text now works! */
  border-left: 4px solid #64b45b; /* keep green as the accent stripe */
  padding: 9px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.q-toolbar {
  min-height: 35px !important;
}
</style>
