<script setup>
import { useMapStore } from '@/stores/map'
import { ref } from 'vue'

const mapStore = useMapStore()
</script>

<template>
  <div class="bg-white q-ma-sm" v-for="(item, index1) in mapStore.layers" :key="index1">
    <div v-for="(layer, index2) in item.subheaders" :key="index2">
      <div class="bg-blue-grey-9 text-white text-center">
        <p v-if="index1 == 0" class="text-body1">{{item.header}} - <br/>{{ layer.title }}</p>
        <p v-if="index1 !== 0" class="text-body1">{{ layer.title }}</p>
      </div>
      <q-list class="">
        <q-item class="q-pl-sm" v-for="(sublayer, index3) in layer.sublayers" :key="index3" :id="sublayer.elid">
          <q-item-section class="">
            <q-item-label class="text-bold" :style="(mapStore.activeHelpElement == sublayer.elid) ? 'border: 2px solid green; padding: 5px' : ''">{{ sublayer.title }}</q-item-label>
            <q-item-label v-html="sublayer.longDescription"></q-item-label>
          </q-item-section>

          <!--q-item-section side top>
            <div style="width: 20px; height: 20px" >
              <img :src="'data:image/gif;base64,' + mapStore.legend[sublayer.id]" />
            </div>
          </q-item-section-->
        </q-item>
      </q-list>
    </div>
  </div>
</template>
