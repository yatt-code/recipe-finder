<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero Section -->
    <div class="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 mb-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Discover Delicious Recipes
        </h1>
        <p class="mt-6 text-xl max-w-3xl">
          Explore our collection of mouthwatering recipes and find your next culinary adventure.
        </p>
        <!-- Improved Search Bar -->
        <div class="mt-8 max-w-xl">
          <div class="mt-1 relative rounded-md shadow-sm">
            <input
              v-model="searchQuery"
              @input="search"
              type="text"
              class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Search recipes..."
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.name" :recipe="recipe" class="transform transition duration-500 hover:scale-105" />
      </div>
      <div v-if="loading" class="text-center my-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <div v-if="!hasMore" class="text-center my-8 text-gray-500">No more recipes to load</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from './RecipeCard.vue'

const recipeStore = useRecipeStore()
const { recipes, loading, error, hasMore } = storeToRefs(recipeStore)

const searchQuery = ref('')

const filteredRecipes = computed(() => {
  if (!searchQuery.value) return recipes.value
  const query = searchQuery.value.toLowerCase()
  return recipes.value.filter(recipe => 
    (recipe.name && recipe.name.toLowerCase().includes(query)) ||
    (recipe.description && recipe.description.toLowerCase().includes(query)) ||
    (recipe.recipeIngredient && recipe.recipeIngredient.some(ingredient => ingredient && ingredient.toLowerCase().includes(query)))
  )
})

const search = () => {
  recipeStore.resetRecipes()
  recipeStore.setSearchQuery(searchQuery.value)
  recipeStore.fetchRecipes()
}

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading.value && hasMore.value) {
    recipeStore.fetchRecipes()
  }
}

onMounted(() => {
  recipeStore.fetchRecipes()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
