<script setup>
import { useMapStore } from '@/stores/map'
import { ref } from 'vue'

const mapStore = useMapStore()
</script>

<template>
  <div class="bg-white q-ma-sm" v-for="(item, index) in mapStore.layers" :key="index">
    <div v-for="(layer, index) in item.subheaders" :key="index">
      <p class="text-body1">{{ layer.title }}</p>
      <p>{{ layer.description }}</p>
      <q-list>
        <q-item v-for="(sublayer, index) in layer.sublayers" :key="index" :id="sublayer.elid">
          <q-item-section>
            <q-item-label class="text-bold" :style="(mapStore.activeHelpElement == sublayer.elid) ? 'border: 2px solid green; padding: 5px' : ''">{{ sublayer.title }}</q-item-label>
            <q-item-label>{{ sublayer.longDescription }}</q-item-label>
          </q-item-section>

          <!--q-item-section side top>
            <div style="width: 20px; height: 20px" >
              <img :src="'data:image/gif;base64,' + mapStore.legend[sublayer.id]" />
            </div>
          </q-item-section-->
        </q-item>

        <q-separator spaced inset
      /></q-list>
    </div>
  </div>
</template>
