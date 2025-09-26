<script setup>
import { useAgolStore } from '@/stores/arcGisOnline'
const agolStore = useAgolStore()

const props = defineProps({
  searchFunction: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <q-input
    clearable
    filled
    label="Search"
    color="blue-grey-9"
    debounce="500"
    v-model="agolStore.searchTerm"
    @update:model-value="agolStore.searchTerm? props.searchFunction(1): ''"
    @clear="function(){
      agolStore.searchResults.results = []
    }"
    ><template v-slot:prepend> <q-icon name="search" /> </template
  ></q-input>
</template>
