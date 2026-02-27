<script setup>
import { useMapStore } from '@/stores/map'
let mapStore = useMapStore()
</script>

<template>
  <div id="energyType" class="q-mb-md">
    <p class="text-overline q-ml-sm q-mb-none">ENERGY TYPE</p>

    <div id="" class="bg-white text-left row q-ml-sm">
      <q-btn
        square
        size="md"
        stack
        unelevated=""
        @click="mapStore.filterLayers('wind')"
        :style="
          mapStore.category == 'wind'
            ? 'border: 2px solid #64B45B; background-color: #e8f5e9'
            : 'border: 2px solid #e8f5e9; '
        "
      >
        <span class="material-symbols-outlined text-blue-grey-9 q-px-sm" style="font-size: 28px"
          >wind_power</span
        ><span class="text-caption text-weight-medium">Wind</span>
      </q-btn>
      <q-btn
        square
        size="md"
        stack
        unelevated=""
        @click="mapStore.filterLayers('solar')"
        :style="
          mapStore.category == 'solar'
            ? 'border: 2px solid #64B45B; background-color: #e8f5e9'
            : 'border: 2px solid #e8f5e9; '
        "
        class="q-ml-sm"
      >
        <span class="material-symbols-outlined text-blue-grey-9 q-px-sm" style="font-size: 28px"
          >solar_power</span
        >

        <span class="text-caption text-weight-medium">Solar</span>
      </q-btn>
      <q-btn
        square
        size="sm"
        stack
        unelevated=""
        @click="mapStore.filterLayers('floating')"
        :style="
          mapStore.category == 'floating'
            ? 'border: 2px solid #64B45B; background-color: #e8f5e9'
            : 'border: 2px solid #e8f5e9; '
        "
        class="q-ml-sm"
      >
        <span class="material-symbols-outlined text-blue-grey-9 q-px-sm" style="font-size: 28px"
          >water_lux</span
        >
        &nbsp;Floating <br />Solar
      </q-btn>
    </div>
  </div>
  <div
    id="dataDownload"
    class="q-mb-md"
    style="border-top: 1px solid lightgrey; border-bottom: 1px solid lightgrey"
  >
    <p class="text-overline q-ml-sm q-mb-none">SAVE DATA & REPORT</p>

    <q-btn
      size="md"
      outline
      color="primary"
      class="q-ml-sm q-mb-md"
      label="Download Data"
      icon="download"
    >
      <q-tooltip>Download Data</q-tooltip>
    </q-btn>
    <q-btn
      size="md"
      outline
      disable=""
      color="grey-5"
      class="q-ml-md q-mb-md"
      label="Save Report"
      icon="article"
    >
      <q-tooltip>Create site report to save</q-tooltip>
    </q-btn>
  </div>
</template>
