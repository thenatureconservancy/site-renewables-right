<script setup>
import TheMap from '../components/TheMap.vue'
import TheLeftPanel from '@/components/TheLeftPanel.vue'
import { useMapStore } from '../stores/map'
import { ref, onMounted } from 'vue'
import { useAgolStore } from '@/stores/arcGisOnline'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { startTour } from '@/utils/appTour'

const mapStore = useMapStore()
const agolStore = useAgolStore()

function dialogControl() {
  mapStore.showDialog = false
  if (mapStore.checkboxHideSplash) {
    localStorage.setItem('showSRRSplash', 'hide')
  } else {
    localStorage.setItem('showSRRSplash', 'show')
  }
  if (!mapStore.tourCompleted) {
    startTour(mapStore)
  }
}
const $q = useQuasar()
const mobile = computed(() => {
  return $q.screen.lt.sm || $q.screen.lt.xs ? true : false
})

onMounted(() => {
  if (localStorage.getItem('showSRRSplash') == 'hide') {
    mapStore.checkboxHideSplash = true
    mapStore.showDialog = false
  } else {
    mapStore.showDialog = true
  }
  if (localStorage.getItem('SRRUserWantsAuth') == 'yes') {
    agolStore.showDialog = true
  }
  if (localStorage.getItem('SRRTourCompleted') == 'yes') {
    mapStore.tourCompleted = true
  }
})
</script>

<template>
  <q-dialog
    persistent=""
    transition-show="slide-right"
    transition-hide="slide-left"
    transition-duration="250"
    v-model="mapStore.showDialog"
    backdrop-filter="blur(4px)"
    full-width=""
  >
    <q-card class="q-pa-none q-ma-none no-scrollbar full-height" style="overflow: hidden">
      <div class="row q-pa-none q-ma-none">
        <q-card-section class="col-sm-5 col-md-6 col-lg-6 q-pa-none q-ma-none">
          <q-img src="/srr.jpg" class="full-height" fit="cover"></q-img>
        </q-card-section>

        <q-card-section
          class="col-sm-7 col-md-6 col-lg-6 q-pa-lg column self-stretch"
          style="min-height: 0"
        >
          <q-scroll-area style="height: calc(100vh - 80px); margin-right: -20px" class="q-pa-lg">
            <div id="topdiv">
              <a href="https://www.nature.org/en-us/">
                <img
                  src="../assets/logo.svg"
                  :style="mobile ? 'width: 100px;' : 'width: 150px; padding-top: 5px; margin: 5px'"
              /></a>
              <div class="splash-header">
                <!-- App name = THE title now -->
                <h1 class="splash-title">
                  The Clean Energy <span class="title-accent">Compass</span>
                </h1>

                <!-- Tagline = supporting subtitle -->
                <p class="splash-tagline">
                  Navigating 3Cs considerations for clean energy planning
                </p>
              </div>
              <p class="text-body2">
                Welcome to the Clean Energy Compass, The Nature Conservancy’s first-stop tool for
                clean energy planning. It is designed to inform—not determine—planning decisions.
                <br />
                <br />
                Use the map to identify potential <b>climate, conservation and community (3C)</b>
                considerations that may warrant further evaluation. The Compass provides
                national-scale information to support early-stage planning and should be used
                alongside site-specific assessments, input from state and federal wildlife agencies,
                robust community engagement, Tribal consultation and other local analyses.
                <br />
                <br />
                It is important to note that the presence of wildlife and habitat resources or
                community considerations does not necessarily preclude wind and solar development,
                as many impacts can be avoided, minimized or addressed through thoughtful project
                design, operations and mitigation measures. The <b>Compass Resource Hub</b> helps
                the user navigate these considerations. Learn more
                <a href="https://www.nature.org/cleanenergycompass" target="_blank"
                  >www.nature.org/cleanenergycompass</a
                >
              </p>
            </div>
            <div class="row q-mt-xl">
              <div id="bottom-div" class="text-left col-6 self-center">
                <q-checkbox size="xs" v-model="mapStore.checkboxHideSplash">
                  <span class="text-body2 text-weight-medium">
                    Hide splash screen at startup</span
                  ></q-checkbox
                >
              </div>
              <div class="text-right q-pt-lg col-6">
                <q-btn
                  unelevated=""
                  color="primary"
                  square
                  label="Enter Tool"
                  icon-right="arrow_forward_ios"
                  size="md"
                  class="q-mb-md"
                  @click="dialogControl()"
                />
              </div>

              <!--div class="text-caption q-pa-md" style="border-top: 1px solid gainsboro">
                TNC is advancing energy solutions that reduce carbon emissions, protect natural
                lands and support livelihoods worldwide. Visit us at
                <a
                  href="https://www.nature.org/en-us/what-we-do/our-priorities/tackle-climate-change/clean-energy-transition/"
                  target="_blank"
                  >nature.org</a
                >
                to learn more.
              </div-->
            </div>
          </q-scroll-area>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>

  <div class="row" style="height: calc(100vh - 64px)">
    <div class="col-4"><TheLeftPanel></TheLeftPanel></div>
    <div class="col"><the-map></the-map></div>
  </div>
</template>
<style>
.q-dialog__inner {
  overflow-y: auto; /* still lets it scroll if needed */
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
}

.q-dialog__inner::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.q-dialog__inner--standard .q-dialog__inner::-web {
  display: none;
}

.splash-title {
  font-size: 34px; /* big — this is the star */
  font-weight: 700;
  color: #1a3a2e; /* deep near-black green */
  letter-spacing: -0.3px;
  margin: 20px 0 6px;
  line-height: 1.1;
}
.splash-title .title-accent {
  color: #64b45b; /* brand green accent, matches app header */
}
.splash-tagline {
  font-size: 16px; /* smaller than title, bigger than body */
  font-weight: 500;
  color: #5a6b62; /* muted gray-green */
  margin: 0 0 24px;
  font-style: normal; /* NOT italic — differentiate from body */
}
</style>
