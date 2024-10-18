# Recipe Collection App

## Overview
This Recipe Collection App is a Vue 3 application that allows users to browse, search, save, and manage recipes. It integrates with a public recipe API and provides a user-friendly interface for recipe management.

## Features

### Core Features (As per requirements)
1. **Vue 3 with TypeScript**: The application is built using Vue 3 and TypeScript for improved type safety and developer experience.
2. **API Integration**: Integrates with a public recipe API to fetch and display recipes.
3. **Recipe Display**: Populates recipes from the API into a responsive grid/list for easy browsing.
4. **Recipe Details**: Shows detailed information about each recipe, including name, ingredients, and instructions.
5. **Local Storage**: Users can save recipes locally, which are then displayed on the home page.
6. **Recipe Management**: Users can add or remove recipes from local storage.
7. **Package Management**: Uses npm for managing project dependencies.
8. **State Management**: Utilizes Pinia for efficient state management across the application.
9. **Reactivity**: Ensures real-time updates of the recipe list and other reactive components.
10. **Filtering**: Implements dynamic filtering of recipes by name, ingredients, or description.
11. **Component Structure**: Organized into reusable components like RecipeList, RecipeCard, RecipeForm, and SearchBar.
12. **Responsive Design**: Creates a responsive layout that works well on both desktop and mobile devices.
13. **UI Design**: Features a user-friendly and visually appealing interface.
14. **CSS Framework**: Uses TailwindCSS for styling and responsive design.

### Additional Features
1. **User Authentication**: Implements a basic user login and registration system.
2. **Favorite Recipes**: Users can mark recipes as favorites and view them in a separate list.
3. **Edit Recipes**: Users can edit both API-sourced and user-created recipes.
4. **Floating Search Bar**: A search bar that becomes fixed at the top of the screen when scrolling.
5. **Infinite Scrolling**: Implements infinite scrolling for loading more recipes as the user scrolls down.
6. **Toast Notifications**: Provides feedback to users for actions like adding/removing favorites or saving recipes.
7. **Loading Skeletons**: Displays skeleton loaders while fetching recipes for improved perceived performance.
8. **Modal Dialogs**: Uses modal windows for displaying recipe details and forms.
9. **Scroll to Top**: Includes a button to quickly scroll back to the top of the page.
10. **Error Handling**: Implements robust error handling for API requests and local storage operations.
11. **Image Error Handling**: Gracefully handles cases where recipe images fail to load.
12. **Custom Color Scheme**: Implements a custom color palette using TailwindCSS for a unique look.
13. **Custom Typography**: Uses custom fonts (Poppins and Merriweather) for enhanced readability and aesthetics.

## Setup and Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   ```
2. Navigate to the project directory:
   ```
   cd recipe-collection-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Usage

- Browse recipes on the home page
- Use the search bar to find specific recipes
- Click on a recipe card to view details
- Log in or register to access additional features like saving favorites and adding/editing recipes
- Add new recipes using the "Add Recipe" button
- Edit recipes by clicking the "Edit" button on recipe cards (for logged-in users)
- View favorite recipes in the "Favorites" section

## Technologies Used

- Vue 3
- TypeScript
- Pinia for state management
- Vue Router for navigation
- TailwindCSS for styling
- Axios for API requests
- Vue Toastification for notifications

## Future Enhancements

- Implement server-side user authentication
- Add recipe categories and tags
- Allow users to upload recipe images
- Implement social sharing features
- Add a meal planning feature

## Author

**Yatt**
- Website: [yatt.codes](https://yatt.codes)
- GitHub: [@yatt-code](https://github.com/yatt-code)

## Disclaimer

This project is a skill assessment task from Encore Med Sdn Bhd.

---

Copyright © 2024 Yatt. All rights reserved.
