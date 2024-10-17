<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-primary-700 text-white relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/hero-background.jpg" alt="Cooking background" class="w-full h-full object-cover opacity-30">
      </div>
      <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative z-10">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6 font-serif">
          Discover Delicious Recipes
        </h1>
        <p class="mt-6 text-xl max-w-3xl mx-auto">
          Explore our collection of mouthwatering recipes and find your next culinary adventure.
        </p>
        <!-- Search Bar in Hero Section -->
        <div class="mt-8 max-w-xl mx-auto">
          <div class="relative rounded-md shadow-sm">
            <input
              v-model="searchQuery"
              @input="search"
              type="text"
              class="input pr-10 text-gray-900 placeholder-gray-500 w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search recipes..."
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Search Bar -->
    <div 
      v-show="showFloatingSearch" 
      class="fixed top-0 left-0 right-0 bg-white shadow-md transition-all duration-300 ease-in-out z-10"
      :class="{ 'translate-y-0': showFloatingSearch, '-translate-y-full': !showFloatingSearch }"
    >
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="relative rounded-md shadow-sm">
          <input
            v-model="searchQuery"
            @input="search"
            type="text"
            class="input pr-10 text-gray-900 placeholder-gray-500 w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search recipes..."
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="error" class="text-center text-red-500 mb-4">{{ error }}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="loading && recipes.length === 0">
          <RecipeCardSkeleton v-for="n in 6" :key="n" />
        </template>
        <RecipeCard 
          v-else
          v-for="recipe in filteredRecipes" 
          :key="recipe.name" 
          :recipe="recipe" 
          class="card"
          @click="openRecipeDetails(recipe)"
          @edit="openEditRecipeForm(recipe)"
        />
      </div>
      <div v-if="loading && recipes.length > 0" class="text-center my-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
      <div v-if="!hasMore" class="text-center my-8 text-gray-500">No more recipes to load</div>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" @close="closeModal">
      <RecipeDetails v-if="selectedRecipe" :recipe="selectedRecipe" />
      <RecipeForm 
        v-if="showRecipeForm" 
        :recipe-to-edit="recipeToEdit" 
        @save="saveRecipe"
        @cancel="closeModal"
      />
    </Modal>

    <!-- Add Recipe Button -->
    <button @click="openAddRecipeForm" class="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Scroll to Top Button -->
    <button
      v-show="showScrollTopButton"
      @click="scrollToTop"
      class="fixed bottom-20 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300 z-10"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecipeStore } from '../stores/recipeStore'
import RecipeCard from './RecipeCard.vue'
import RecipeDetails from './RecipeDetails.vue'
import RecipeForm from './RecipeForm.vue'
import Modal from './Modal.vue'
import type { Recipe } from '../services/api'
import { debounce } from 'lodash-es'
import RecipeCardSkeleton from './RecipeCardSkeleton.vue'
import { useToast } from 'vue-toastification'

const recipeStore = useRecipeStore()
const { recipes, loading, error, hasMore } = storeToRefs(recipeStore)

const searchQuery = ref('')
const showModal = ref(false)
const selectedRecipe = ref<Recipe | null>(null)
const showRecipeForm = ref(false)
const recipeToEdit = ref<Recipe | null>(null)
const showFloatingSearch = ref(false)
const showScrollTopButton = ref(false)

const filteredRecipes = computed(() => {
  let filtered = recipes.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipe => 
      (recipe.name && recipe.name.toLowerCase().includes(query)) ||
      (recipe.description && recipe.description.toLowerCase().includes(query)) ||
      (recipe.recipeIngredient && recipe.recipeIngredient.some(ingredient => ingredient && ingredient.toLowerCase().includes(query)))
    )
  }
  // Sort to display user-created recipes first
  return filtered.sort((a, b) => (b.isUserCreated ? 1 : 0) - (a.isUserCreated ? 1 : 0))
})

const debouncedSearch = debounce(() => {
  recipeStore.resetRecipes()
  recipeStore.setSearchQuery(searchQuery.value)
  recipeStore.fetchRecipes()
}, 300)

const search = () => {
  debouncedSearch()
}

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loading.value && hasMore.value) {
    recipeStore.fetchRecipes()
  }

  // Show floating search bar when scrolled past hero section
  const heroSection = document.querySelector('.bg-primary-700')
  if (heroSection) {
    showFloatingSearch.value = window.scrollY > heroSection.clientHeight
  }

  // Show scroll to top button when scrolled down 500px
  showScrollTopButton.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const openRecipeDetails = (recipe: Recipe) => {
  selectedRecipe.value = recipeStore.getRecipeForDisplay(recipe.name) || null
  showRecipeForm.value = false
  showModal.value = true
}

const openAddRecipeForm = () => {
  selectedRecipe.value = null
  recipeToEdit.value = null
  showRecipeForm.value = true
  showModal.value = true
}

const openEditRecipeForm = (recipe: Recipe) => {
  recipeToEdit.value = recipeStore.getRecipeForDisplay(recipe.name) || null
  showRecipeForm.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedRecipe.value = null
  showRecipeForm.value = false
  recipeToEdit.value = null
}

const toast = useToast()

const saveRecipe = (recipe: Recipe) => {
  if (recipeToEdit.value) {
    recipeStore.editRecipe(recipe)
    toast.success('Recipe updated successfully!')
  } else {
    recipeStore.addRecipe(recipe)
    toast.success('Recipe added successfully!')
  }
  closeModal()
}

onMounted(() => {
  recipeStore.fetchRecipes()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all duration-300 ease-in-out;
}
</style>
