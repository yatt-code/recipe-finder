<template>
  <div class="card transform transition duration-300 hover:scale-105" @click="$emit('click')">
    <div class="relative pb-2/3">
      <img 
        v-if="hasValidImage" 
        :src="imageSrc" 
        :alt="recipe.name" 
        class="absolute h-full w-full object-cover"
        @error="handleImageError"
        loading="lazy"
      >
      <div v-else class="absolute h-full w-full bg-gray-200 flex items-center justify-center">
        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    </div>
    <div class="p-4">
      <h2 class="text-xl font-serif font-bold mb-2 truncate">{{ recipe.name }}</h2>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ recipe.description }}</p>
      <div class="flex justify-between items-center">
        <button v-if="isLoggedIn" @click.stop="$emit('edit')" class="btn btn-secondary text-sm">
          Edit
        </button>
        <button @click.stop="toggleFavorite" class="text-2xl focus:outline-none">
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Recipe } from '../services/api'
import { useRecipeStore } from '../stores/recipeStore'
import { useUserStore } from '../stores/userStore'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  recipe: Recipe
}>()

const recipeStore = useRecipeStore()
const userStore = useUserStore()
const toast = useToast()

const isFavorite = computed(() => recipeStore.isFavorite(props.recipe.name))
const hasValidImage = ref(props.recipe.image && props.recipe.image.length > 0)
const imageSrc = ref(props.recipe.image && props.recipe.image.length > 0 ? props.recipe.image[0] : '')

const isLoggedIn = computed(() => !!userStore.currentUser)

const toggleFavorite = () => {
  recipeStore.toggleFavorite(props.recipe.name)
  if (isFavorite.value) {
    toast.success(`${props.recipe.name} added to favorites!`)
  } else {
    toast.info(`${props.recipe.name} removed from favorites.`)
  }
}

const handleImageError = () => {
  hasValidImage.value = false
  imageSrc.value = '' // Clear the image source to prevent further attempts to load
}

defineEmits<{
  (e: 'click'): void
  (e: 'edit'): void
}>()
</script>

<style scoped>
.pb-2\/3 {
  padding-bottom: 66.666667%;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
