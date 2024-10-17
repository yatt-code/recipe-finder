import { defineStore } from 'pinia'
import { fetchRecipes, Recipe } from '../services/api'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Recipe[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
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
  },
  actions: {
    async fetchRecipes() {
      this.loading = true
      this.error = null
      try {
        this.recipes = await fetchRecipes()
      } catch (error) {
        this.error = 'Failed to fetch recipes'
        console.error(error)
      } finally {
        this.loading = false
      }
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
  },
})
