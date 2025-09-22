<template>
  <q-btn
   id="sign-in-button"
    :ripple="false"
    icon="img:globe.png"
    no-caps=""
    :label=" authStore.buttonLabel"
    style="width: 100%; background: #0079c1; color: white"
    unelevated=""
    @click="authenticate()"
  > 
  </q-btn>

</template>

<script setup>
import { useAuthStore } from '../stores/auth.js'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()

function authenticate() {
 
  let userauth = localStorage.getItem('SRRUserWantsAuth')
  if (!userauth) {
    console.log('gets here')
    localStorage.setItem('SRRUserWantsAuth', 'yes')
    window.location.reload()
  }
  if (userauth == 'yes') {
    localStorage.removeItem('SRRUserWantsAuth')
    authStore.logout()
  }
}
// Function to sign in or out of the portal used by the sign in/out button click event.

onMounted(() => {
  //only run this if the user wants to login
  console.log(localStorage.getItem('SRRUserWantsAuth'))
  if (localStorage.getItem('SRRUserWantsAuth') == 'yes') {
    console.log()
    //Create a new OAuthInfo object.
    authStore.login()
  }
})
</script>
