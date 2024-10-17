import { defineStore } from 'pinia'
import { fetchRecipes, Recipe } from '../services/api'
import { useUserStore } from './userStore'

interface UserRecipe extends Recipe {
  userId: string;
  isUserCreated: boolean;
  originalId?: string; // Reference to the original API recipe if it's an edit
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
        const newRecipes = await fetchRecipes(this.page, this.limit)
        const apiRecipes = newRecipes.map(recipe => ({
          ...recipe,
          userId: 'public',
          isUserCreated: false
        }))
        this.recipes.push(...apiRecipes)
        this.page++
        this.hasMore = newRecipes.length === this.limit
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }
        console.error('Error fetching recipes:', error)
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
          userId: userStore.currentUser.id,
          isUserCreated: true
        }
        this.recipes.unshift(userRecipe) // Add to the beginning of the array
        this.saveToLocalStorage()
      }
    },
    editRecipe(updatedRecipe: UserRecipe) {
      const userStore = useUserStore()
      if (!userStore.currentUser) return

      const index = this.recipes.findIndex(r => r.name === updatedRecipe.name)
      if (index !== -1) {
        if (this.recipes[index].userId === 'public') {
          // If it's an API recipe, create a new user recipe
          const userRecipe: UserRecipe = {
            ...updatedRecipe,
            userId: userStore.currentUser.id,
            isUserCreated: true,
            originalId: this.recipes[index].name // Store the original recipe name as reference
          }
          this.recipes.unshift(userRecipe)
        } else {
          // If it's already a user recipe, just update it
          this.recipes[index] = updatedRecipe
        }
        this.saveToLocalStorage()
      }
    },
    saveToLocalStorage() {
      try {
        const userRecipes = this.recipes.filter(recipe => recipe.isUserCreated)
        localStorage.setItem('userRecipes', JSON.stringify(userRecipes))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
        // Optionally, you could set an error state here to display to the user
      }
    },
    loadFromLocalStorage() {
      try {
        const userRecipes = localStorage.getItem('userRecipes')
        if (userRecipes) {
          const parsedRecipes = JSON.parse(userRecipes) as UserRecipe[]
          // Merge user recipes with API recipes, prioritizing user recipes
          this.recipes = this.recipes.map(recipe => {
            const userVersion = parsedRecipes.find(r => r.originalId === recipe.name || r.name === recipe.name)
            return userVersion || recipe
          })
          // Add any new user-created recipes
          const newUserRecipes = parsedRecipes.filter(r => !this.recipes.some(recipe => recipe.name === r.name))
          this.recipes.unshift(...newUserRecipes)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        // Optionally, you could set an error state here to display to the user
      }
    },
    getRecipeForDisplay(recipeName: string): UserRecipe | undefined {
      const userStore = useUserStore()
      const userId = userStore.currentUser?.id

      // First, try to find a user-modified version of the recipe
      const userRecipe = this.recipes.find(r => r.name === recipeName && r.userId === userId)
      if (userRecipe) return userRecipe

      // If not found, return the original recipe (API or user-created)
      return this.recipes.find(r => r.name === recipeName)
    },
  },
})
