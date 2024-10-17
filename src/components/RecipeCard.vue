<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer" @click="goToDetails">
    <img v-if="recipe.image && recipe.image.length > 0" :src="recipe.image[0]" :alt="recipe.name" class="w-full h-48 object-cover">
    <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-500">No image available</span>
    </div>
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-2">{{ recipe.name }}</h2>
      <p class="text-gray-600">{{ recipe.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Recipe } from '../services/api'
import { useRouter } from 'vue-router'

const props = defineProps<{
  recipe: Recipe
}>()

const router = useRouter()

const goToDetails = () => {
  router.push(`/recipe/${encodeURIComponent(props.recipe.name)}`)
}
</script>
