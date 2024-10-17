import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import RecipeList from './components/RecipeList.vue'
import RecipeDetails from './components/RecipeDetails.vue'
import { useRecipeStore } from './stores/recipeStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RecipeList },
    { path: '/recipe/:name', component: RecipeDetails, props: true }
  ]
})
app.use(router)

const recipeStore = useRecipeStore()
recipeStore.loadFavoritesFromLocalStorage()

app.mount('#app')
