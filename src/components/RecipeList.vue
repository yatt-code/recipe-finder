<template>
  <div>
    <div v-if="loading" class="text-center">Loading recipes...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RecipeCard v-for="recipe in recipes" :key="recipe.name" :recipe="recipe" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from './RecipeCard.vue'

const recipeStore = useRecipeStore()

onMounted(() => {
  recipeStore.fetchRecipes()
})

const { recipes, loading, error } = recipeStore
</script>
