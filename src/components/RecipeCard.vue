<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <img v-if="recipe.image && recipe.image.length > 0" :src="recipe.image[0]" :alt="recipe.name" class="w-full h-48 object-cover">
    <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-500">No image available</span>
    </div>
    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold">{{ recipe.name }}</h2>
        <button @click.stop="toggleFavorite" class="text-2xl">
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
      </div>
      <p class="text-gray-600">{{ recipe.description }}</p>
      <button @click="goToDetails" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        View Details
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Recipe } from '../services/api'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'

const props = defineProps<{
  recipe: Recipe
}>()

const router = useRouter()
const recipeStore = useRecipeStore()

const isFavorite = computed(() => recipeStore.isFavorite(props.recipe.name))

const goToDetails = () => {
  router.push(`/recipe/${encodeURIComponent(props.recipe.name)}`)
}

const toggleFavorite = () => {
  recipeStore.toggleFavorite(props.recipe.name)
}
</script>
