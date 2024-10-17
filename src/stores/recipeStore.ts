import { defineStore } from 'pinia'
import { fetchRecipes, Recipe } from '../services/api'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Recipe[],
    loading: false,
    error: null as string | null,
  }),
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
  },
})
