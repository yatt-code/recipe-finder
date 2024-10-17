<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <img :src="recipe.image[0]" :alt="recipe.name" class="w-full h-48 object-cover">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-2">{{ recipe.name }}</h2>
      <p class="text-gray-600">{{ recipe.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Recipe } from '../services/api'

defineProps<{
  recipe: Recipe
}>()
</script>
