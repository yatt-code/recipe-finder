import axios from 'axios'

const API_URL = 'https://raw.githubusercontent.com/micahcochran/json-cookbook/refs/heads/main/cookbook-100.json'

export interface Recipe {
  name: string
  description: string
  image: string[]
  recipeIngredient: string[]
  recipeInstructions: { text: string }[]
  userId?: string
  isUserCreated?: boolean
  originalId?: string
}

export const fetchRecipes = async (page: number, limit: number): Promise<Recipe[]> => {
  try {
    const response = await axios.get<Recipe[]>(API_URL)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return response.data.slice(startIndex, endIndex)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message)
      throw new Error(`Failed to fetch recipes: ${error.message}`)
    } else {
      console.error('Unexpected error:', error)
      throw new Error('An unexpected error occurred while fetching recipes')
    }
  }
}
