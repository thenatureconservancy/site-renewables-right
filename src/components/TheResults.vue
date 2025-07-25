<script setup>
import { useMapStore } from '../stores/map'
const mapStore = useMapStore()

</script>

<template>
  <div v-if="mapStore.currentPoint !== ''">
    <q-separator></q-separator>
    <q-separator></q-separator>
    <q-expansion-item
      expand-separator
      label="Highly Sensitive"
      class="text-body1 bg-white"
      default-opened=""
    >
      <q-list>
        <!--p class="q-ml-md q-mb-sm q-mt-sm text-body2 text-caption">
          Number of features: {{ mapStore.getCounts().avoid }}
        </p-->
        <div>
          <q-item dense>
            <q-item-section class="col-5 text-caption"> Highly Sensitive Habitats </q-item-section>
            <q-item-section class="col-3 q-pl-md text-caption"> Area (sq mi) </q-item-section>
            <q-item-section class="q-pl-md text-caption"> Percent of total </q-item-section>
          </q-item>
        </div>
        
        <div v-for="(item, index) in mapStore.results" :key="index">
          <q-item
            class=""
            v-if="
              item.totalArea !== 0 &&
              item.map !== 'opportunities' &&
              item.layerName !== 'Landscape Connectivity'
            "
          >
           <q-item-section class="col">
              <q-checkbox size="sm"></q-checkbox>
            </q-item-section>
            <q-item-section class="col-1">
              <q-avatar square :style="{ background: item.color }" size="sm"></q-avatar>
            </q-item-section>

            <q-item-section class="col-4">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                {{ item.layerName }}</q-item-label
              >
            </q-item-section>
            <q-item-section
              class="col-3 q-pl-md text-caption text-center"
              style="border-right: 1px solid gainsboro"
            >
              {{ item.totalArea }}
            </q-item-section>
            <q-item-section class="q-pl-md">
              <q-linear-progress size="25px" :value="item.percentOfTotal" color="blue">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="blue" :label="getRange(item.percentOfTotal)" />
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      label="Moderately Sensitive"
      class="text-body1 bg-white"
      default-opened=""
    >
      <q-list>
        <!--p class="q-ml-md q-mb-sm q-mt-sm text-caption">
         Number of features: {{ mapStore.getCounts().minimize }}
        </p-->
        <q-item dense>
          <q-item-section class="col-5 text-caption">
            Moderately Sensitive Habitats
          </q-item-section>
          <q-item-section class="col-3 q-pl-md text-caption"> Area (sq mi) </q-item-section>
          <q-item-section class="q-pl-md text-caption"> Percent of total </q-item-section>
        </q-item>
        <div v-for="(item, index) in mapStore.results" :key="index">
          <q-item
            class=""
            v-if="item.layerName === 'Landscape Connectivity' && item.totalArea !== 0"
          >
            <q-item-section class="col-1">
              <q-avatar square :style="{ background: item.color }" size="sm"></q-avatar>
            </q-item-section>

            <q-item-section class="col-4">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                {{ item.layerName }}</q-item-label
              >
            </q-item-section>
            <q-item-section
              class="col-3 q-pl-md text-caption text-center"
              style="border-right: 1px solid gainsboro"
            >
              {{ item.totalArea }}
            </q-item-section>
            <q-item-section class="q-pl-md">
              <q-linear-progress size="25px" :value="item.percentOfTotal" color="blue">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="blue" :label="getRange(item.percentOfTotal)" />
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      label="Second Life Lands and Waters"
      class="text-body1 bg-white"
      default-opened=""
    >
      <!--p class="q-ml-md q-mb-sm q-mt-sm text-caption">
        Features: {{ mapStore.getCounts().develop }}
      </p-->
      <q-item dense >
        <q-item-section class="col-5 text-caption"> </q-item-section>
        <q-item-section class="col-3 q-pl-md text-caption"> Area (sq mi) </q-item-section>
        <q-item-section class="q-pl-md text-caption"> Percent of total </q-item-section>
      </q-item>
      <div v-for="(item, index) in mapStore.results" :key="index">
        <q-item class="" v-if="item.totalArea !== 0 && item.map == 'opportunities'">
          <q-item-section class="col-1">
            <q-avatar square :style="{ background: item.color }" size="sm"></q-avatar>
          </q-item-section>

          <q-item-section class="col-4">
            <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
              {{ item.layerName }}</q-item-label
            >
          </q-item-section>
          <q-item-section
            class="col-3 q-pl-md text-caption text-center"
            style="border-right: 1px solid gainsboro"
          >
            {{ item.totalArea }}
          </q-item-section>
          <q-item-section class="q-pl-md">
            <q-linear-progress size="25px" :value="item.percentOfTotal" color="blue">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="blue" :label="getRange(item.percentOfTotal)" />
              </div>
            </q-linear-progress>
          </q-item-section>
        </q-item>
      </div>
      <q-list>
        
        <div v-for="(item, index) in mapStore.oppResults" :key="index">
          <q-item class="" v-if="item.count > 0">
            <q-item-section class="col-1">
              <q-avatar square color="yellow-1" size="sm"></q-avatar>
            </q-item-section>
            <q-item-section class="col-4">
              <q-item-label class="text-blue-grey-9 text-body2 q-pa-md text-bold">
                {{ item.layerName }}</q-item-label
              >
            </q-item-section>
 <q-item-section class="col-3">
              <q-item-label class="text-blue-grey-9 text-caption q-pa-md ">
                Number of features</q-item-label
              >
            </q-item-section>
            <q-item-section class="q-pl-md" style="border-right: 1px solid gainsboro">
              {{ item.count }}
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-expansion-item>

    <!--q-expansion-item
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
    </q-expansion-item-->
    <!--p class="q-ma-md">Stats for QAQC:</p>
    <ul>
      <li>Total area intersected: {{ mapStore.results.totalArea }} sq mi</li>
      <li>Total number of features: {{ mapStore.results.numFeatures }}</li>
      <li>Buffer area: {{ mapStore.results.bufferArea }} sq mi</li>
      <li>Percent of total: {{ mapStore.results.percentOfTotal }}</li>
    </ul-->
  </div>
  <div
    v-if="mapStore.results.length == 0"
    class="q-pa-lg q-mg-lg q-mt-xl text-h6 text-weight-light text-grey"
  >
    <div class="text-center q-mb-md q-pa-md">
      <q-icon name="o_pin_drop" size="xl" class="text-center"></q-icon>

      <p class="q-pb-xl q-mb-xl">
        Click anywhere on the map to generate a Site Renewables Right area summary
      </p>
    </div>
  </div>
</template>
