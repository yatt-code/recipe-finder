<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Recipe' : 'Add New Recipe' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block mb-2">Recipe Name</label>
        <input v-model="form.name" id="name" type="text" required class="w-full p-2 border rounded">
      </div>
      <div class="mb-4">
        <label for="description" class="block mb-2">Description</label>
        <textarea v-model="form.description" id="description" required class="w-full p-2 border rounded"></textarea>
      </div>
      <div class="mb-4">
        <label for="ingredients" class="block mb-2">Ingredients (one per line)</label>
        <textarea v-model="ingredientsText" id="ingredients" required class="w-full p-2 border rounded"></textarea>
      </div>
      <div class="mb-4">
        <label for="instructions" class="block mb-2">Instructions (one per line)</label>
        <textarea v-model="instructionsText" id="instructions" required class="w-full p-2 border rounded"></textarea>
      </div>
      <div class="mb-4">
        <label for="image" class="block mb-2">Image URL</label>
        <input v-model="form.image[0]" id="image" type="url" class="w-full p-2 border rounded">
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {{ isEditing ? 'Update Recipe' : 'Add Recipe' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { useRoute, useRouter } from 'vue-router';
import type { Recipe } from '../services/api';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();

const isEditing = computed(() => route.name === 'edit-recipe');

const form = ref<Recipe>({
  name: '',
  description: '',
  image: [''],
  recipeIngredient: [],
  recipeInstructions: []
});

const ingredientsText = ref('');
const instructionsText = ref('');

onMounted(async () => {
  if (isEditing.value) {
    const recipeName = route.params.name as string;
    const recipe = await recipeStore.getRecipeByName(recipeName);
    if (recipe) {
      form.value = { ...recipe };
      ingredientsText.value = recipe.recipeIngredient.join('\n');
      instructionsText.value = recipe.recipeInstructions.map(i => i.text).join('\n');
    }
  }
});

const handleSubmit = () => {
  form.value.recipeIngredient = ingredientsText.value.split('\n').filter(i => i.trim());
  form.value.recipeInstructions = instructionsText.value
    .split('\n')
    .filter(i => i.trim())
    .map(text => ({ text }));

  if (isEditing.value) {
    recipeStore.editRecipe(form.value);
  } else {
    recipeStore.addRecipe(form.value);
  }

  router.push('/');
};
</script>
