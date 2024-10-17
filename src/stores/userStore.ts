import { defineStore } from 'pinia'

interface User {
  id: string;
  username: string;
  password: string; // In a real app, never store passwords in plain text
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    users: [] as User[],
  }),
  actions: {
    registerUser(username: string, password: string) {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        password, // In a real app, hash the password
      }
      this.users.push(newUser)
      this.currentUser = newUser
      this.saveToLocalStorage()
    },
    login(username: string, password: string) {
      const user = this.users.find(u => u.username === username && u.password === password)
      if (user) {
        this.currentUser = user
        return true
      }
      return false
    },
    logout() {
      this.currentUser = null
    },
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    },
    loadFromLocalStorage() {
      const users = localStorage.getItem('users')
      const currentUser = localStorage.getItem('currentUser')
      if (users) this.users = JSON.parse(users)
      if (currentUser) this.currentUser = JSON.parse(currentUser)
    },
  },
})
