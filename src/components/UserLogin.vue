<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">{{ isRegistering ? 'Register' : 'Login' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="username" class="block mb-2">Username</label>
        <input v-model="username" id="username" type="text" required class="w-full p-2 border rounded">
      </div>
      <div class="mb-4">
        <label for="password" class="block mb-2">Password</label>
        <input v-model="password" id="password" type="password" required class="w-full p-2 border rounded">
      </div>
      <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {{ isRegistering ? 'Register' : 'Login' }}
      </button>
    </form>
    <p class="mt-4 text-center">
      {{ isRegistering ? 'Already have an account?' : 'Don\'t have an account?' }}
      <a href="#" @click.prevent="isRegistering = !isRegistering" class="text-blue-500 hover:underline">
        {{ isRegistering ? 'Login' : 'Register' }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const isRegistering = ref(false)

const handleSubmit = () => {
  if (isRegistering.value) {
    userStore.registerUser(username.value, password.value)
    router.push('/')
  } else {
    if (userStore.login(username.value, password.value)) {
      router.push('/')
    } else {
      alert('Invalid username or password')
    }
  }
}
</script>
