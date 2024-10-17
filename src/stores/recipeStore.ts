import { defineStore } from 'pinia'
import { fetchRecipes, Recipe } from '../services/api'
import { useUserStore } from './userStore'

interface UserRecipe extends Recipe {
  userId: string;
}

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as UserRecipe[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
    favorites: [] as string[],
    page: 1,
    limit: 12, // Number of recipes per page
    hasMore: true,
  }),
  getters: {
    filteredRecipes(): Recipe[] {
      if (!this.searchQuery) return this.recipes
      const query = this.searchQuery.toLowerCase()
      return this.recipes.filter(recipe => 
        (recipe.name && recipe.name.toLowerCase().includes(query)) ||
        (recipe.description && recipe.description.toLowerCase().includes(query)) ||
        (recipe.recipeIngredient && recipe.recipeIngredient.some(ingredient => ingredient && ingredient.toLowerCase().includes(query)))
      )
    },
    isFavorite: (state) => (recipeName: string) => {
      return state.favorites.includes(recipeName)
    },
    userRecipes(): UserRecipe[] {
      const userStore = useUserStore()
      return this.recipes.filter(recipe => recipe.userId === userStore.currentUser?.id)
    },
  },
  actions: {
    async fetchRecipes() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const newRecipes = await fetchRecipes(this.page, this.limit)
        const userRecipes = newRecipes.map(recipe => ({
          ...recipe,
          userId: userStore.currentUser?.id || 'public'
        }))
        this.recipes.push(...userRecipes)
        this.page++
        this.hasMore = newRecipes.length === this.limit
      } catch (error) {
        this.error = 'Failed to fetch recipes'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    resetRecipes() {
      this.recipes = []
      this.page = 1
      this.hasMore = true
    },
    async getRecipeByName(name: string): Promise<Recipe | undefined> {
      if (this.recipes.length === 0) {
        await this.fetchRecipes()
      }
      return this.recipes.find(recipe => recipe.name === name)
    },
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    toggleFavorite(recipeName: string) {
      const index = this.favorites.indexOf(recipeName)
      if (index === -1) {
        this.favorites.push(recipeName)
      } else {
        this.favorites.splice(index, 1)
      }
      this.saveFavoritesToLocalStorage()
    },
    saveFavoritesToLocalStorage() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },
    loadFavoritesFromLocalStorage() {
      const favorites = localStorage.getItem('favorites')
      if (favorites) {
        this.favorites = JSON.parse(favorites)
      }
    },
    addRecipe(recipe: Omit<Recipe, 'userId'>) {
      const userStore = useUserStore()
      if (userStore.currentUser) {
        const userRecipe: UserRecipe = {
          ...recipe,
          userId: userStore.currentUser.id
        }
        this.recipes.push(userRecipe)
        this.saveToLocalStorage()
      }
    },
    editRecipe(updatedRecipe: UserRecipe) {
      const index = this.recipes.findIndex(r => r.name === updatedRecipe.name && r.userId === updatedRecipe.userId)
      if (index !== -1) {
        this.recipes[index] = updatedRecipe
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('recipes', JSON.stringify(this.recipes))
    },
    loadFromLocalStorage() {
      const recipes = localStorage.getItem('recipes')
      if (recipes) this.recipes = JSON.parse(recipes)
    },
  },
})
