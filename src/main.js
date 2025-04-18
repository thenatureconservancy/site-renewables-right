import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar';
import App from './App.vue'
import router from './router'
import quasarUserOptions from './quasar-user-options';
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, quasarUserOptions);
app.mount('#app')
