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

export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axios.get<Recipe[]>(API_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}
