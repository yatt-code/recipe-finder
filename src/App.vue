<script setup lang="ts">
// Component logic will go here
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Recipe Collection</h1>
    <nav class="mb-4">
      <router-link to="/" class="mr-4 text-blue-500 hover:text-blue-700">All Recipes</router-link>
      <router-link to="/favorites" class="text-blue-500 hover:text-blue-700">Favorites</router-link>
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
