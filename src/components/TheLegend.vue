<script setup>
import { useMapStore } from '@/stores/map'
import { ref } from 'vue'

const mapStore = useMapStore()
</script>
<template>
  <div class="bg-white" v-for="(item, index) in mapStore.layers" :key="index">
    <div class="q-mb-md q-ml-sm" v-for="(layer, index) in item.subheaders" style="border-bottom: 1px solid gainsboro" :key="index">
      <q-item-section class="text-bold text-body2 text-grey-9"  v-if="layer.visible"  :key="index">
        {{ layer.title }}
      </q-item-section>

      <q-list dense v-for="(sublayer, index) in layer.sublayers" >
        <q-item v-if="sublayer.visibleModel">
          <q-item-section class="text-grey-7">{{ sublayer.title }}</q-item-section>

          <q-item-section side>
            <div style="width: 20px; height: 20px">
              <img :src="'data:image/gif;base64,' + mapStore.legend[sublayer.id]" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
