import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import { VueFire, VueFireAuth } from 'vuefire'
// Vuetify
import 'vuetify/styles'
import 'font-awesome/css/font-awesome.min.css'
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa4'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import {
  firebaseApp,
  
} from "./firebase";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})

const intervalMS = 3
const updateSW = registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
updateSW({ immediate: true })

const app = createApp(App).use(vuetify)
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})
// app.config.globalProperties.$messaging = firebaseMessaging
app.mount('#app')
