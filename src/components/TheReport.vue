<script setup>
import { useMapStore } from '@/stores/map'
import TheResults from './TheResults.vue'
const mapStore = useMapStore()
import { ref } from 'vue'
const showCustom = ref(false)
function buffer(size) {
  mapStore.bufferSize = size
  mapStore.createBuffer(mapStore.currentPoint)
}
</script>
<template>
  <div class="bg-white q-mr-sm">
    <div class="q-mb-md q-mt-xl" v-if="mapStore.currentPoint !== ''">
      <p class="text-bold q-pl-md q-mb-sm">
        Buffer Size:
        <q-btn class="q-ml-sm" flat square padding="none" icon="o_info" size="sm">
          <q-menu>
            <div class="q-pa-md" style="width: 300px">
              <p class="">
                Tracking species movement is approximate. Adjust the buffer so it aligns with the
                project scale and includes some of the surrounding area.
              </p>
              <q-btn color="blue" size="sm" flat>More info</q-btn>
            </div>
          </q-menu>
        </q-btn>
      </p>

      <p class="q-pb-none q-mb-none q-pl-sm">
        <q-btn
          square
          size="md"
          stack
          unelevated=""
          @click="buffer(0.5)"
          :style="mapStore.bufferSize == 0.5 ? 'border: 2px solid #536067' : ''"
          class="text-weight-light"
          label="0.5 Mile"
        >
        </q-btn>
        <q-btn
          square
          size="md"
          stack
          unelevated=""
          :style="mapStore.bufferSize == 1 ? 'border: 2px solid #536067' : ''"
          class="text-weight-light"
          @click="buffer(1)"
        >
          1 Mile
        </q-btn>
        <q-btn
          square
          size="md"
          stack
          unelevated=""
          :style="mapStore.bufferSize == 5 ? 'border: 2px solid #536067' : ''"
          class="text-weight-light q-mb-none"
          @click="buffer(5)"
        >
          5 Mile
        </q-btn>
          <q-btn
          square
          size="md"
          stack
          unelevated=""
          :style="mapStore.bufferSize !== 0.5 && mapStore.bufferSize !== 5 && mapStore.bufferSize !== 1 ? 'border: 2px solid #536067' : ''"
          class="text-weight-light q-mb-none"
          @click="mapStore.bufferSize = '';showCustom = 'true'"
        >
          CUSTOM
        </q-btn>
     <br/>
    
       </p>
         <p class="text-weight-light q-mr-md q-ml-md q-mt-md text-caption q-mt-none" v-if="showCustom">
        *CUSTOM BUFFER SIZE
        <input
          v-model="mapStore.bufferSize"
          type="number"
          style="width: 40px"
          @change="buffer(mapStore.bufferSize)"
        />
        MILES
      </p>
      <br />
    </div>
    <the-results></the-results>
  </div>
</template>
