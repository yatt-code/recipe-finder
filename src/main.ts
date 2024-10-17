import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import './index.css'
import RecipeList from './components/RecipeList.vue'
import RecipeDetails from './components/RecipeDetails.vue'
import FavoriteRecipes from './components/FavoriteRecipes.vue'
import UserLogin from './components/UserLogin.vue'
import RecipeForm from './components/RecipeForm.vue'
import { useRecipeStore } from './stores/recipeStore'
import { useUserStore } from './stores/userStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(Toast)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: RecipeList },
    { path: '/favorites', component: FavoriteRecipes },
    { path: '/recipe/:name', component: RecipeDetails, props: true },
    { path: '/login', component: UserLogin },
    { path: '/add-recipe', component: RecipeForm },
    { path: '/edit-recipe/:name', component: RecipeForm, name: 'edit-recipe' },
  ]
})
app.use(router)

const recipeStore = useRecipeStore()
recipeStore.loadFavoritesFromLocalStorage()
recipeStore.loadFromLocalStorage()

const userStore = useUserStore()
userStore.loadFromLocalStorage()

app.mount('#app')
