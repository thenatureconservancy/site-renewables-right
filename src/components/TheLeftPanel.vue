<script setup>
import { useMapStore } from '@/stores/map'
import { ref, computed } from 'vue'
import TheLayerList from './TheLayerList.vue'

const mapStore = useMapStore()
const showLayers = ref(true)
const showTools = ref(true)
const showFilter = ref(true)
const toolsHeight = 52
const filterHeight = 58

const scrollHeight = computed(() => ({
  height: `calc(100vh - ${
    280 + (showTools.value ? toolsHeight : 0) + (showFilter.value ? filterHeight : 0)
  }px)`,
}))
</script>
<template>
  <div class="q-mx-md" style="border-top: 1px solid lightgray">
    <p class="text-body2 text-weight-medium q-mt-md q-mb-none">
      Explore where renewable energy development may face constraints, tradeoffs, or opportunities.
    </p>
    <div id="tools" class="" style="border-bottom: 1px solid lightgrey">
      <q-toolbar class="q-ma-none q-pa-none">
        <p class="text-overline q-ml-sm q-mb-none">
          TOOLS
          <q-btn color="grey-8" icon="help_outline" size="xs" padding="xs" flat class="q-ml-sm">
            <q-menu>
              <div class="q-pa-md" style="width: 300px">
                <p class="">
                  <b>Site report:</b> Click this button to drop a pin on the map, choose buffer
                  size, and generate an intersection summary. <br /><br />
                  <b>Info:</b> This button opens the info panel with a table of contents for each of
                  the data layers and their descriptions.
                </p>
              </div>
            </q-menu>
          </q-btn>
        </p>
        <q-space></q-space>
        <q-btn
          flat
          size="sm"
          padding="xs"
          :icon="showTools ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="showTools = !showTools"
        ></q-btn>
      </q-toolbar>
      <q-slide-transition>
        <div v-show="showTools">
          <div class="q-pb-md">
            <q-btn
              color="primary"
              size="12px"
              icon="table_chart"
              label="Site report"
              square
              unelevated
              @click="mapStore.showSiteReport = true"
            ></q-btn>
            <q-btn
              class="q-ml-sm"
              label="Info"
              size="12px"
              color="primary"
              icon="o_info"
              square
              unelevated
              flat
              @click="mapStore.showHelpPanel = true"
            ></q-btn>
          </div>
        </div>
      </q-slide-transition>
    </div>
    <div id="energyType" class="" style="border-bottom: 1px solid lightgrey">
      <q-toolbar class="q-ma-none q-pa-none">
        <p class="text-overline q-ml-sm q-mb-none">
          ENERGY TYPE FILTER
          <q-btn color="grey-8" icon="help_outline" size="xs" padding="xs" flat class="q-ml-sm">
            <q-menu>
              <div class="q-pa-md" style="width: 300px">
                <p class="">
                  Use this option to control which energy related layers appear in the list below.
                  The default is solar.
                </p>
              </div>
            </q-menu>
          </q-btn>
        </p>
        <q-space></q-space>
        <q-btn
          flat
          size="sm"
          padding="xs"
          :icon="showFilter ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="showFilter = !showFilter"
        ></q-btn>
      </q-toolbar>
      <q-slide-transition>
        <div v-show="showFilter">
          <div class="q-pb-md">
            <q-btn
              square
              size="md"
              unelevated=""
              @click="mapStore.filterLayers('wind')"
              :style="
                mapStore.category == 'wind'
                  ? 'border: 2px solid #64B45B; background-color: #e8f5e9'
                  : 'border: 2px solid #e8f5e9; '
              "
            >
              <span
                class="material-symbols-outlined text-blue-grey-9 q-px-xs"
                style="font-size: 20px"
                >wind_power</span
              ><span class="text-caption text-weight-medium">Wind</span>
            </q-btn>
            <q-btn
              square
              size="md"
              unelevated=""
              @click="mapStore.filterLayers('solar')"
              :style="
                mapStore.category == 'solar'
                  ? 'border: 2px solid #64B45B; background-color: #e8f5e9'
                  : 'border: 2px solid #e8f5e9; '
              "
              class="q-ml-sm"
            >
              <span
                class="material-symbols-outlined text-blue-grey-9 q-px-xs"
                style="font-size: 20px"
                >solar_power</span
              >

              <span class="text-caption text-weight-medium">Solar</span>
            </q-btn>
            <q-btn
              square
              size="md"
              unelevated=""
              @click="mapStore.filterLayers('floating solar')"
              :style="
                mapStore.category == 'floating solar'
                  ? 'border: 2px solid #64B45B; background-color: #e8f5e9'
                  : 'border: 2px solid #e8f5e9; '
              "
              class="q-ml-sm"
            >
              <span
                class="material-symbols-outlined text-blue-grey-9 q-px-xs"
                style="font-size: 20px"
                >water_lux</span
              >

              <span class="text-caption text-weight-medium">Floating Solar</span>
            </q-btn>
          </div>
        </div>
      </q-slide-transition>
    </div>

    <q-toolbar class="q-ma-none q-pa-none">
      <p class="text-overline q-ml-sm q-mb-none">
        DATA LAYERS ( {{ mapStore.category }} filter applied )
        <q-btn color="grey-8" icon="help_outline" size="xs" padding="xs" flat class="q-ml-sm">
          <q-menu>
            <div class="q-pa-md" style="width: 300px">
              <p class="">
                <b>Category:</b> Click each category to expand the list of layers and turn them on
                or off. Only one category can be active at a time. With the exception of native
                lands, which can be toggled on or off at any time. <br /><br />
                <b>Drag Indicator:</b> If a drag indicator appears next to a layer, you can click
                and drag it to reorder the layers in the list. <br /><br />
                <b>Info Button:</b> This button opens the info panel and will route you to the
                specific layer information. <br /><br />
                <b>Opacity Button:</b> Allows you to adjust the transparency of the layer on the
                map. <br /><br />
              </p>
            </div>
          </q-menu>
        </q-btn>
      </p>
      <q-space></q-space>
      <q-btn
        flat
        size="sm"
        padding="xs"
        :icon="showLayers ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="showLayers = !showLayers"
      ></q-btn>
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
          <the-layer-list></the-layer-list>
        </div>
      </q-slide-transition>
    </q-scroll-area>
  </div>
</template>
<style></style>
