import { defineStore, acceptHMRUpdate } from 'pinia';

interface User {
  name: string
  email: string 
}
interface AuthState {
  user: User| false
}

export const useAuthStore = defineStore('auth', {
  state: () : AuthState => ({
    user: false
  }),

  getters: {
    name: (state: AuthState) => {
      return state.user ? state.user.name : ''
    },
    email: (state: AuthState) => {
      return state.user ? state.user.email : ''
    }
  },
  
  actions: {
    login(username: string, passoword: string): User|false {
      this.user = false
      if(username === 'admim' && passoword === 'admim') {
        this.user = {
          name: 'Adminstrador',
          email: 'admim@admim.com'
        }
      }
      return this.user
    },

    logout() {
      
      this.user = false
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
