<template>
  <div class="recipe-form">
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
      <div class="mt-4">
        <button type="submit" class="btn btn-primary mr-2">
          {{ isEditing ? 'Update Recipe' : 'Add Recipe' }}
        </button>
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { useUserStore } from '../stores/userStore';
import type { Recipe, UserRecipe } from '../services/api';

const props = defineProps<{
  recipeToEdit?: Recipe
}>()

const emit = defineEmits<{
  (e: 'save', recipe: UserRecipe): void
  (e: 'cancel'): void
}>()

const recipeStore = useRecipeStore()
const userStore = useUserStore()

const isEditing = computed(() => !!props.recipeToEdit);

const form = ref<UserRecipe>({
  name: '',
  description: '',
  image: [''],
  recipeIngredient: [],
  recipeInstructions: [],
  userId: '',
  isUserCreated: false
});

const ingredientsText = ref('');
const instructionsText = ref('');

onMounted(() => {
  if (props.recipeToEdit) {
    form.value = { ...props.recipeToEdit };
    ingredientsText.value = props.recipeToEdit.recipeIngredient.join('\n');
    instructionsText.value = props.recipeToEdit.recipeInstructions.map(i => i.text).join('\n');
  }
});

const handleSubmit = () => {
  form.value.recipeIngredient = ingredientsText.value.split('\n').filter(i => i.trim());
  form.value.recipeInstructions = instructionsText.value
    .split('\n')
    .filter(i => i.trim())
    .map(text => ({ text }));

  if (userStore.currentUser) {
    form.value.userId = userStore.currentUser.id
    form.value.isUserCreated = true
  }

  if (isEditing.value && props.recipeToEdit?.userId === 'public') {
    form.value.originalId = props.recipeToEdit.name
  }

  emit('save', form.value);
};
</script>
