<template>
  <div class="max-w-2xl mx-auto">
    <button @click="goBack" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Back to Recipes
    </button>
    <div v-if="loading" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-64 bg-gray-200 rounded mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
      <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6 mb-1"></div>
      <div class="h-4 bg-gray-200 rounded w-3/6 mb-4"></div>
      <div class="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6 mb-1"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6 mb-1"></div>
      <div class="h-4 bg-gray-200 rounded w-3/6 mb-1"></div>
    </div>
    <div v-else-if="recipe">
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
    <div v-else class="text-center text-red-500">Failed to load recipe</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '../stores/recipeStore';
import type { Recipe } from '../services/api';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const recipe = ref<Recipe | null>(null);
const loading = ref(true);

onMounted(async () => {
  const recipeName = route.params.name as string;
  loading.value = true;
  try {
    recipe.value = await recipeStore.getRecipeByName(recipeName);
  } catch (error) {
    console.error('Failed to load recipe:', error);
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push('/');
};
</script>
