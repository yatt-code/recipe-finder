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
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Recipe Collection</h1>
    <nav class="mb-4 flex justify-between items-center">
      <div>
        <router-link to="/" class="mr-4 text-blue-500 hover:text-blue-700">All Recipes</router-link>
        <router-link to="/favorites" class="mr-4 text-blue-500 hover:text-blue-700">Favorites</router-link>
        <router-link v-if="currentUser" to="/add-recipe" class="text-blue-500 hover:text-blue-700">Add Recipe</router-link>
      </div>
      <div v-if="currentUser">
        <span class="mr-4">Welcome, {{ currentUser.username }}</span>
        <button @click="logout" class="text-blue-500 hover:text-blue-700">Logout</button>
      </div>
      <router-link v-else to="/login" class="text-blue-500 hover:text-blue-700">Login/Register</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
