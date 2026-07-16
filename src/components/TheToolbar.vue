<script setup>
import { useMapStore } from '@/stores/map'
let mapStore = useMapStore()
</script>

<template>
  <div id="" class="q-mb-md q-pb-md" style="border-bottom: 1px solid lightgrey">
    <p class="text-overline q-ml-sm q-mb-none">TOOLS
      <q-btn color="grey-8" icon="help_outline" size="xs" padding="xs" flat  class="q-ml-sm">
        <q-menu>
          <div class="q-pa-md" style="width: 300px">
            <p class="">
              <b>Site report:</b> Click this button to drop a pin on the map, choose buffer size, and generate an intersection summary.  <br/><br/>
              <b>Info:</b> This button opens the info panel with a table of contents for each of the data layers and their descriptions.
            </p>
          </div>
        </q-menu>
      </q-btn>
    </p>
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
  <div id="energyType" class="q-mb-md q-pb-md" style="border-bottom: 1px solid lightgrey">
    <p class="text-overline q-ml-sm q-mb-none">
      ENERGY FILTER FOR DATA LAYERS
      <q-btn color="grey-8" icon="help_outline" size="xs" padding="xs" flat  class="q-ml-sm">
        <q-menu>
          <div class="q-pa-md" style="width: 300px">
            <p class="">
              Use this option to control which energy related layers appear in the list below. The default is solar.
            </p>
          </div>
        </q-menu>
      </q-btn>
    </p>

    <div id="" class="bg-white text-left">
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
        <span class="material-symbols-outlined text-blue-grey-9 q-px-xs" style="font-size: 20px"
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
        <span class="material-symbols-outlined text-blue-grey-9 q-px-xs" style="font-size: 20px"
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
        <span class="material-symbols-outlined text-blue-grey-9 q-px-xs" style="font-size: 20px"
          >water_lux</span
        >

        <span class="text-caption text-weight-medium">Floating Solar</span>
      </q-btn>

      <q-space></q-space>
    </div>
  </div>
</template>
