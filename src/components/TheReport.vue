<script setup>
import { useMapStore } from '@/stores/map'
const mapStore = useMapStore()

function getRange(val) {
  let newVal = val * 100
  let range = ''
  newVal > 0 && newVal < 26
    ? (range = '0 - 25%')
    : newVal > 25 && newVal < 51
      ? (range = '26 - 50%')
      : newVal > 50 && newVal < 76
        ? (range = '51 - 75%')
        : newVal > 75 && newVal < 101
          ? (range = '76 - 100%')
          : (range = '0 - 100%')
  return range
}
</script>
<template>
  <div>
    <q-btn
      :icon-right="mapStore.showReportDetails ? 'arrow_drop_down' : 'arrow_drop_up'"
      size="sm"
      class="text-black bg-white text-bold"
      style="width: 100%"
      @click="mapStore.showReportDetails = !mapStore.showReportDetails"
      :label="mapStore.showReportDetails ? 'Hide Details' : 'Show Details'"
    ></q-btn>
    <q-tab-panels v-model="mapStore.reportTab" v-if="mapStore.showReportDetails">
      <q-tab-panel name="conservation">
        <q-scroll-area style="height: calc(100vh - 265px)">
          <p class="text-weight-medium">Conservation Values Report Summary</p>

          <div class="bg-grey-3 q-pa-sm q-mb-sm">
            <p class="col text-body2 text-weight-medium q-pb-none q-mb-none">
              <q-icon size="xs" color="red" name="flag"></q-icon> Highly sensitive
            </p>
          </div>

          <!--p class="text-caption">
              Includes {{ mapStore.summary.highlySensitiveCount }} habitat types
            </p-->
          <div v-if="mapStore.summary.highlySensitiveTotalArea == 0">
            <ul>
              <li><p class="text-body2">None intersecting buffer</p></li>
            </ul>
          </div>
          <div v-for="(item, index) in mapStore.summary.highlySensitiveHabitats" :key="index">
            <q-item class="shadow-2 q-mb-sm">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption
                  >{{
                    new Intl.NumberFormat('en-US', { notation: 'compact' }).format(item.area)
                  }}
                  sq mi</q-item-label
                >
                <q-item-label>
                  <q-badge
                    color="grey-3"
                    text-color="black"
                    :label="getRange(item.percentOfTotal) + ' of total area'"
                    class="text-weight-medium"
                /></q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="bg-grey-3 q-mt-md q-pa-sm">
            <p class="text-body2 text-weight-medium q-mb-none">
              <q-icon size="xs" color="yellow-8" name="flag"></q-icon> Moderately sensitive
            </p>
          </div>
          <div v-if="mapStore.summary.moderatelySensitiveTotalArea == 0">
            <ul>
              <li><p class="text-body2">None intersecting buffer</p></li>
            </ul>
          </div>
          <q-item class="shadow-2 q-mb-sm q-mt-sm" v-if="mapStore.summary.moderatelySensitiveTotalArea > 0">
            <q-item-section>
              <q-item-label>Landscape connectivity</q-item-label>
              <q-item-label caption
                >{{
                  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(
                    mapStore.summary.moderatelySensitiveTotalArea,
                  )
                }}
                sq mi</q-item-label
              >
              <q-item-label>
                <q-badge
                  color="grey-3"
                  text-color="black"
                  class="text-weight-medium"
                  :label="
                    new Intl.NumberFormat('en-US', {
                      style: 'percent',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(
                      mapStore.summary.moderatelySensitiveTotalArea / mapStore.summary.bufferArea,
                    ) + 'of total area'
                  "
              /></q-item-label>
            </q-item-section>
          </q-item>
        
          <div class="bg-grey-3 q-mt-md q-pa-sm">
            <p class="text-body2 text-weight-medium q-mb-none">
              <q-icon size="xs" color="green" name="flag"></q-icon> Degraded and disturbed lands
            </p>
          </div>
          <div v-if="mapStore.summary.mines == 0 && mapStore.summary.brownfields == 0">
            <ul>
              <li><p class="text-body2">None intersecting buffer</p></li>
            </ul>
          </div>
          <ul class="q-pl-md text-left">
            <li v-if="mapStore.summary.brownfields > 0">
              <p class="text-body2 text-left q-mb-none">
                Brownfields: {{ mapStore.summary.brownfields }}
              </p>
            </li>
            <li v-if="mapStore.summary.waterBodies > 0">
              <p class="text-body2 q-mb-none">Mines: {{ mapStore.summary.mines }}</p>
            </li>
          </ul>
        </q-scroll-area>
      </q-tab-panel>
      <q-tab-panel name="agriculture">AGRICULTURE RESULTS</q-tab-panel>
      <q-tab-panel name="community">COMMUNITY RESULTS </q-tab-panel>
    </q-tab-panels>
    <q-tabs
      v-model="mapStore.reportTab"
      justified
      class="bg-white text-caption"
      dense
      active-class="bg-primary text-white"
      indicator-color="blue-grey-9"
    >
      <q-tab dense name="conservation" class="q-pa-sm q-ma-none">
        <template #default>
          <div class="text-bold" style="font-size: 10px">
            <span class="text-body1">
              <q-icon size="xs" class="q-mb-xs" name="flag"></q-icon>&nbsp;7</span
            >
            <p class="q-ma-none q-pa-none">CONSERVATION</p>
          </div>
        </template>
      </q-tab>
      <q-tab name="agriculture">
        <template #default>
          <div class="text-bold" style="font-size: 10px">
            <div class="text-bold" style="font-size: 10px">
              <span class="text-body1"> 0</span>
              <p class="q-ma-none q-pa-none">AGRICULTURE</p>
            </div>
          </div>
        </template>
      </q-tab>
      <q-tab name="community">
        <template #default>
          <div class="text-bold" style="font-size: 10px">
            <span class="text-body1">
              <q-icon size="xs" class="q-mb-xs" name="flag"></q-icon>&nbsp;3</span
            >
            <p class="q-ma-none q-pa-none">COMMUNITY</p>
          </div>
        </template>
      </q-tab>
    </q-tabs>
  </div>
</template>

<style scoped>
.border {
  border: 2px solid #49aa43;
}
</style>
