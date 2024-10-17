<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Favorite Recipes</h2>
    <div v-if="favoriteRecipes.length === 0" class="text-center text-gray-500">
      You haven't added any favorite recipes yet.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RecipeCard v-for="recipe in favoriteRecipes" :key="recipe.name" :recipe="recipe" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from './RecipeCard.vue'

const recipeStore = useRecipeStore()

const favoriteRecipes = computed(() => {
  return recipeStore.recipes.filter(recipe => recipeStore.isFavorite(recipe.name))
})
</script>
