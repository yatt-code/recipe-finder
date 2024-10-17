<template>
  <div v-if="recipe" class="recipe-details">
    <h2 class="text-2xl font-bold mb-4">{{ recipe.name }}</h2>
    <img v-if="recipe.image && recipe.image.length > 0" :src="recipe.image[0]" :alt="recipe.name" class="w-full h-64 object-cover mb-4 rounded-lg">
    <div v-else class="w-full h-64 bg-gray-200 flex items-center justify-center mb-4 rounded-lg">
      <span class="text-gray-500">No image available</span>
    </div>
    <p class="text-gray-700 mb-4">{{ recipe.description }}</p>
    
    <h3 class="text-xl font-semibold mb-2">Ingredients:</h3>
    <ul class="list-disc list-inside mb-4">
      <li v-for="ingredient in recipe.recipeIngredient" :key="ingredient" class="mb-1">
        {{ ingredient }}
      </li>
    </ul>
    
    <h3 class="text-xl font-semibold mb-2">Instructions:</h3>
    <ol class="list-decimal list-inside">
      <li v-for="(instruction, index) in recipe.recipeInstructions" :key="index" class="mb-2">
        {{ instruction.text }}
      </li>
    </ol>
  </div>
  <div v-else class="text-center text-gray-500">
    Recipe not found
  </div>
</template>

<script setup lang="ts">
import { Recipe } from '../services/api'

defineProps<{
  recipe: Recipe | null
}>()
</script>
