import { defineStore } from 'pinia'
import { fetchRecipes, Recipe } from '../services/api'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Recipe[],
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
  },
  actions: {
    async fetchRecipes() {
      if (!this.hasMore || this.loading) return

      this.loading = true
      this.error = null
      try {
        const newRecipes = await fetchRecipes(this.page, this.limit)
        this.recipes.push(...newRecipes)
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
  },
})
