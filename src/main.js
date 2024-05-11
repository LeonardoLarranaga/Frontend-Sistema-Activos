/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Plugins
import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from './router'

const app = createApp(App)

// Global variables
app.provide('isSignedIn', false)

registerPlugins(app)

app.use(router)
app.use(createPinia())
app.mount('#app')
