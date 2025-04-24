<script setup>
import { useMapStore } from '../stores/map'
const mapStore = useMapStore()
</script>

<template>
  <div v-if="mapStore.results.length > 0">
    <q-separator></q-separator>
    <q-separator></q-separator>
    <q-expansion-item
      expand-separator
      label="Avoid developing critical ecological areas"
      class="text-body1 text-weight-light text-white bg-blue-grey-9"
      default-opened=""
    >
      <q-list bordered="">
        <p class="q-ml-md q-mb-sm q-mt-sm text-body2 text-caption">
          Features: {{ mapStore.getCounts().avoid }}
        </p>
        <div v-for="(item, index) in mapStore.results" :key="index">
          <q-item
            class=""
            v-if="
              item.totalArea !== 0 &&
              item.map !== 'opportunities' &&
              item.layerName !== 'Landscape Connectivity'
            "
          >
            <q-item-section class="col-4" :style="{ background: item.color }">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                {{ item.layerName }}</q-item-label
              >
            </q-item-section>
            <q-item-section class="col-4 q-pl-md" style="border-right: 1px solid gainsboro">
              <span class="text-caption">Area <br /></span>
              {{ item.totalArea }} KM2
            </q-item-section>
            <q-item-section class="q-pl-md">
              <span class="text-caption">Perc of Total <br /></span>
              {{ item.percentOfTotal }}
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>
    <q-separator></q-separator>
    <q-expansion-item
      expand-separator
      label="Minimize development in vital connectivity corridors"
      class="text-body1 text-weight-light text-white bg-blue-grey-9"
      default-opened=""
    >
      <q-list bordered="">
        <p class="q-ml-md q-mb-sm q-mt-sm text-caption">
          Features: {{ mapStore.getCounts().minimize }}
        </p>
        <div v-for="(item, index) in mapStore.results" :key="index">
          <q-item
            class=""
            v-if="item.layerName === 'Landscape Connectivity' && item.totalArea !== 0"
          >
            <q-item-section class="col-4" :style="{ background: item.color }">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                {{ item.layerName }}</q-item-label
              >
            </q-item-section>
            <q-item-section class="col-4 q-pl-md" style="border-right: 1px solid gainsboro">
              <span class="text-caption">Area <br /></span>
              {{ item.totalArea }} KM2
            </q-item-section>
            <q-item-section class="q-pl-md">
              <span class="text-caption">Perc of Total <br /></span>
              {{ item.percentOfTotal }}
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>

    <q-separator></q-separator>
    <q-expansion-item
      expand-separator
      label="Focus development in areas with lower ecological impact"
      class="text-body1 text-weight-light text-white bg-blue-grey-9"
      default-opened=""
    >
      <p class="q-ml-md q-mb-sm q-mt-sm text-caption">
        Features: {{ mapStore.getCounts().develop }}
      </p>
      <div v-for="(item, index) in mapStore.results" :key="index">
        <q-item class="" v-if="item.totalArea !== 0 && item.map == 'opportunities'">
          <q-item-section class="col-4" :style="{ background: item.color }">
            <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
              {{ item.layerName }}</q-item-label
            >
          </q-item-section>
          <q-item-section class="col-4 q-pl-md" style="border-right: 1px solid gainsboro">
            <span class="text-caption">Area <br /></span>
            {{ item.totalArea }} KM2
          </q-item-section>
          <q-item-section class="q-pl-md">
            <span class="text-caption">Perc of Total <br /></span>
            {{ item.percentOfTotal }}
          </q-item-section>
        </q-item>
      </div>
      <q-list bordered="">
        <div v-for="(item, index) in mapStore.oppResults" :key="index">
          <q-item class="" v-if="item.count > 0">
            <q-item-section class="col-4 bg-yellow-1">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                {{ item.layerName }}</q-item-label
              >
            </q-item-section>
            <q-item-section class="col-4 q-pl-md" style="border-right: 1px solid gainsboro">
              <span class="text-caption">#Features <br /></span>
            </q-item-section>
            <q-item-section class="col-4 q-pl-md" style="border-right: 1px solid gainsboro">
              {{ item.count }}
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>
    <q-separator></q-separator>
    <q-expansion-item
      expand-separator
      label="Further review may be needed"
      class="text-body1 text-weight-light text-white bg-blue-grey-9"
      default-opened=""
    >
      <p class="q-ml-md q-mb-none q-mt-none text-body2 text-caption">
        Features: {{ mapStore.getCounts().review }}
      </p>
      <q-list class="q-pl-md" bordered="" dense>
        <div v-for="(item, index) in mapStore.results" :key="index">
          <q-item
            class=""
            v-if="
              item.totalArea == 0 &&
              item.map !== 'opportunities' &&
              item.layerName !== 'Landscape Connectivity'
            "
          >
            <q-item-section>
              <q-item-label class="text-white text-body2"> {{ item.layerName }}</q-item-label>
            </q-item-section>
            <q-item-section side :style="{ background: item.color }"> </q-item-section>
          </q-item>
        </div>
      </q-list>

      <p class="text-body1 q-pa-md q-mb-none">Coming Soon</p>
      <q-list class="q-pa-md" bordered="">
        <div>
          <q-item class="">
            <q-item-section style="background: #98c6f7">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                Wetlands (solar)</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item class="">
            <q-item-section style="background: #98c6f7">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                Wetlands (wind)</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>
    <!--p class="q-ma-md">Stats for QAQC:</p>
    <ul>
      <li>Total area intersected: {{ mapStore.results.totalArea }} km2</li>
      <li>Total number of features: {{ mapStore.results.numFeatures }}</li>
      <li>Buffer area: {{ mapStore.results.bufferArea }} km2</li>
      <li>Percent of total: {{ mapStore.results.percentOfTotal }}</li>
    </ul-->
  </div>
  <div
    v-if="mapStore.results.length == 0"
    class="shadow-2 q-pa-lg q-mg-lg text-h6 text-weight-light text-grey"
  >
    <div class="text-center q-mb-md">
      <q-icon name="o_pin_drop" size="xl" class="text-center"></q-icon>
    </div>
    <p class="q-pb-xl q-mb-xl">
      Click anywhere on the map to generate a Site Renewables Right area summary
    </p>
  </div>
</template>
