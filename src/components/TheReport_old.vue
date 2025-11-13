<script setup>
import { useMapStore } from '@/stores/map'
import TheResults from './TheResults_old.vue'
const mapStore = useMapStore()
import { ref } from 'vue'

</script>
<template>
  <div class="bg-white q-mr-sm">
    
    <the-results></the-results>
  </div>
</template>
