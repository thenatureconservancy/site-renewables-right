<script setup>
import TheMap from '../components/TheMap.vue'
import TheLeftPanel from '@/components/TheLeftPanel.vue'
import TheHelp from '@/components/TheHelp.vue'
import TheReport from '@/components/TheReport_old.vue'
import { useMapStore } from '../stores/map'
import { useHelpStore } from '@/stores/help'
import { ref, onMounted } from 'vue'
import { useAgolStore } from '@/stores/arcGisOnline'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
const mapStore = useMapStore()
const helpStore = useHelpStore()

const agolStore = useAgolStore()
function openPanel(active) {
  mapStore.panelState = 'open'
  mapStore.activeTool = active
}
function dialogControl() {
  helpStore.showDialog = false
  if (mapStore.checkboxHideSplash) {
    localStorage.setItem('showSRRSplash', 'hide')
  } else {
    localStorage.setItem('showSRRSplash', 'show')
  }
}
const $q = useQuasar()
const mobile = computed(() => {
  return $q.screen.lt.sm || $q.screen.lt.xs ? true : false
})

onMounted(() => {
  //set initial active tool to legend
  if (localStorage.getItem('showSRRSplash') == 'hide') {
    mapStore.checkboxHideSplash = true
    helpStore.showDialog = false
  } else {
    helpStore.showDialog = true
  }
  if (localStorage.getItem('SRRUserWantsAuth') == 'yes') {
    agolStore.showDialog = true
  }
})
</script>

<template>
  <q-dialog
    persistent=""
    transition-show="slide-right"
    transition-hide="slide-left"
    transition-duration="250"
    v-model="helpStore.showDialog"
    backdrop-filter="blur(4px)"
    full-width=""
  >
    <q-card class="q-pa-none q-ma-none no-scrollbar" style="overflow: hidden">
      <div class="row q-pa-none q-ma-none">
        <q-card-section class="col-sm-5 col-md-6 col-lg-6 q-pa-none q-ma-none">
          <q-img
            src="/srr.png"
            style="object-fit: contain; max-width: 100%; max-height: 100%; margin-bottom: 0px"
            alt="windmills"
          >
          </q-img>
        </q-card-section>

        <q-card-section
          class="col-sm-7 col-md-6 col-lg-6 q-pa-lg column self-stretch"
          style="min-height: 0"
        >
          <q-scroll-area style="height: calc(100vh - 100px)" class="q-pa-lg">
            <div id="topdiv">
              <a href="https://www.nature.org/en-us/">
                <img
                  src="../assets/logo.svg"
                  :style="mobile ? 'width: 100px;' : 'width: 150px; padding-top: 5px; margin: 5px'"
              /></a>
              <p class="text-overline text-green-9 text-weight-bold">
                CLEAN ENERGY TOOL (NAME COMING SOON)
              </p>
              <p class="text-h6">
                Accelerating clean energy that works in harmony with nature and people
              </p>
              <p class="text-body2 text-italic">
                For a clean energy project to come together, developers need the right land
                topography, a nearby grid connection, willing landowners and more. Finding locations
                that fulfill all these requirements is a challenge unto itself.

                <br />
                <br />

                When projects are proposed in places that are important to communities and the
                environment, they can be met with opposition—at times amplified by
                misinformation—that leads to project delays, cost increases and cancelations. These
                challenges slow the clean energy transition at a time when pace and scale are
                critical.

                <br />
                <br />

                With energy demand rising, clean energy plays an important role in quickly
                delivering affordable, reliable power. This tool helps inform the development of
                projects with benefits for climate, conservation and communities—the “3Cs”—with the
                goal of building public support for rapid clean energy deployment.

                <br />
                <br />

                This tool is a first-stop, early screening tool for planning, siting and procuring
                renewable energy projects. It can be used for high-level information gathering about
                sensitive wildlife and habitat as well as best practices for engaging communities
                and Tribes. It can help with identifying potential risks and late-stage surprises.

                <br />
                <br />

                This tool is not intended to be used on its own to determine where clean energy
                should or should not be sited. The datasets are high-quality, but they are also
                coarse. They serve to complement—not replace—site-level assessments, community input
                and consultations with local, state and federal agencies.
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
</style>
