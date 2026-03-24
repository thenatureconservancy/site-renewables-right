<script setup>
import { useMapStore } from '@/stores/map'
let mapStore = useMapStore()
</script>

<template>
  <div id="dataDownload" class="q-mb-md row" style="border-bottom: 1px solid lightgrey">
    <div class="col"><p class="text-overline q-ml-sm q-mb-none q-pb-none">GET DATA</p></div>
    <div class="col">
      <q-btn
        size="md"
        outline
        color="primary"
        class="q-mb-md"
        label="Download Data"
        icon="download"
        square
      >
        <q-tooltip>Download Data</q-tooltip>
      </q-btn>
    </div>
  </div>
  <div id="energyType" class="q-mb-md q-pb-md" style="border-bottom: 1px solid lightgrey">
    <p class="text-overline q-ml-sm q-mb-none">ENERGY TYPE</p>

    <div id="" class="bg-white text-left row">
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
</template>
