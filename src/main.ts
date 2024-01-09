import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Terminal from './install'
const app = createApp(App)
app.use(Terminal)
app.mount('#app')
