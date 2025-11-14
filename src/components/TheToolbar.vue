<script setup>
import { useMapStore } from '@/stores/map'
let mapStore = useMapStore()
</script>

<template>
  <div class="q-mt-md q-mb-md bg-white text-left row">
    <q-btn
      square
      size="sm"
      stack
      unelevated=""
      @click="mapStore.filterLayers('wind')"
      :class="mapStore.category == 'wind' ? 'bg-blue-grey-9 text-white' : ''"
    >
      <span
        :class="
          mapStore.category == 'wind'
            ? 'material-symbols-outlined text-white'
            : 'material-symbols-outlined text-blue-grey-9'
        "
        style="font-size: 28px"
        >wind_power</span
      >
      &nbsp;Wind
    </q-btn>
    <q-btn
      square
      size="sm"
      stack
      unelevated=""
      @click="mapStore.filterLayers('solar')"
      :class="mapStore.category == 'solar' ? 'bg-blue-grey-9 text-white q-ml-sm' : 'q-ml-sm'"
    >
      <span
        :class="
          mapStore.category == 'solar'
            ? 'material-symbols-outlined text-white'
            : 'material-symbols-outlined text-blue-grey-9'
        "
        style="font-size: 28px"
        >solar_power</span
      >
      &nbsp;Solar
    </q-btn>
    <q-btn
      square
      size="sm"
      stack
      unelevated=""
      @click="mapStore.filterLayers('floating')"
      :class="mapStore.category == 'floating' ? 'bg-blue-grey-9 text-white q-ml-sm' : 'q-ml-sm'"
    >
      <span
        :class="
          mapStore.category == 'floating'
            ? 'material-symbols-outlined text-white'
            : 'material-symbols-outlined text-blue-grey-9'
        "
        style="font-size: 28px"
        >water_lux</span
      >
      &nbsp;Floating <br />Solar
    </q-btn>
    <q-space></q-space>
    <q-separator inset spaced class="" vertical=""></q-separator>
    <q-btn square padding="xs" flat size="xs" stack color="blue-grey-9" class="q-ml-md">
      <q-tooltip>Download data</q-tooltip>
      <calcite-icon class="q-mb-xs" icon="download" scale="s"></calcite-icon>Download <br />Data
    </q-btn>
     <q-btn v-if="mapStore.tab == 'sketch'" square padding="xs" flat size="xs" stack color="blue-grey-9" class="q-ml-md">
      <q-tooltip>Download report</q-tooltip>
      <calcite-icon class="q-mb-xs" icon="file-report-generic" scale="s"></calcite-icon>Download <br />Report
    </q-btn>
 
  </div>
</template>
