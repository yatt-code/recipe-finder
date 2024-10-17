<template>
  <div>
    <input
      v-model="searchQuery"
      @input="search"
      placeholder="Search recipes..."
      class="w-full p-2 mb-4 border rounded"
    />
    <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.name" :recipe="recipe" />
    </div>
    <div v-if="loading" class="text-center my-4">Loading more recipes...</div>
    <div v-if="!hasMore" class="text-center my-4">No more recipes to load</div>
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
