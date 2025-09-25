<script setup>
import { useSearchStore } from '@/stores/searchBar'
const searchStore = useSearchStore()

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
    v-model="searchStore.searchTerm"
    @update:model-value="searchStore.searchTerm? props.searchFunction(): ''"
    @clear="function(){
      searchStore.searchResults.results = []
    }"
    ><template v-slot:prepend> <q-icon name="search" /> </template
  ></q-input>
</template>
