import axios from 'axios'

const API_URL = 'https://raw.githubusercontent.com/micahcochran/json-cookbook/refs/heads/main/cookbook-100.json'

export interface Recipe {
  name: string
  description: string
  image: string[]
  recipeIngredient: string[]
  recipeInstructions: { text: string }[]
  // Add other properties as needed
}

export const fetchRecipes = async (page: number, limit: number): Promise<Recipe[]> => {
  try {
    const response = await axios.get<Recipe[]>(API_URL)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return response.data.slice(startIndex, endIndex)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}
