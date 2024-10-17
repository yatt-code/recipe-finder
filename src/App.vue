<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from './stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const currentUser = computed(() => userStore.currentUser)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold text-indigo-600">Recipe Collection</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/" class="nav-link">All Recipes</router-link>
              <router-link to="/favorites" class="nav-link">Favorites</router-link>
              <router-link v-if="currentUser" to="/add-recipe" class="nav-link">Add Recipe</router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div v-if="currentUser" class="ml-3 relative">
              <span class="mr-4">Welcome, {{ currentUser.username }}</span>
              <button @click="logout" class="btn btn-secondary">Logout</button>
            </div>
            <router-link v-else to="/login" class="btn btn-primary">Login/Register</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-16">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium;
}

.nav-link.router-link-active {
  @apply border-indigo-500 text-gray-900;
}

.nav-link:not(.router-link-active) {
  @apply border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700;
}
</style>
