import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import RecipeList from './components/RecipeList.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RecipeList }
  ]
})
app.use(router)

app.mount('#app')
