import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar';
import App from './App.vue'
import router from './router'
import 'shepherd.js/dist/css/shepherd.css'
import '@/assets/tour-theme.css'   // the TNC-green theme file
import quasarUserOptions from './quasar-user-options';
const app = createApp(App)
import { createGtag } from 'vue-gtag'


app.use(createGtag({
    tagId: 'G-K304PL78RD'
}))
app.use(createPinia())
app.use(router)
app.use(Quasar, quasarUserOptions);
app.mount('#app')
