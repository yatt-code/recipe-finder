import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import RecipeList from './components/RecipeList.vue'
import RecipeDetails from './components/RecipeDetails.vue'
import FavoriteRecipes from './components/FavoriteRecipes.vue'
import { useRecipeStore } from './stores/recipeStore'
import UserLogin from './components/UserLogin.vue'
import { useUserStore } from './stores/userStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RecipeList },
    { path: '/favorites', component: FavoriteRecipes },
    { path: '/recipe/:name', component: RecipeDetails, props: true },
    { path: '/login', component: UserLogin },
  ]
})
app.use(router)

const recipeStore = useRecipeStore()
recipeStore.loadFavoritesFromLocalStorage()

const userStore = useUserStore()
userStore.loadFromLocalStorage()

app.mount('#app')
