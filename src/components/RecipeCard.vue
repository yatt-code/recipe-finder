<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="relative h-48">
      <img 
        v-if="hasValidImage" 
        :src="recipe.image[0]" 
        :alt="recipe.name" 
        class="w-full h-full object-cover"
        @error="handleImageError"
      >
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
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
import { computed, ref } from 'vue'
import { Recipe } from '../services/api'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'

const props = defineProps<{
  recipe: Recipe
}>()

const router = useRouter()
const recipeStore = useRecipeStore()

const isFavorite = computed(() => recipeStore.isFavorite(props.recipe.name))
const hasValidImage = ref(props.recipe.image && props.recipe.image.length > 0)

const goToDetails = () => {
  router.push(`/recipe/${encodeURIComponent(props.recipe.name)}`)
}

const toggleFavorite = () => {
  recipeStore.toggleFavorite(props.recipe.name)
}

const handleImageError = () => {
  hasValidImage.value = false
}
</script>
