import { defineStore, acceptHMRUpdate } from "pinia";


interface User {
  name: string;
  email: string;
}

interface AuthState {
  name: string;
  user: User | false;
  avatarUrl: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    name: localStorage.getItem("name") || "",
    user: JSON.parse(localStorage.getItem("user") || "false"),
    avatarUrl: null as string | null,
  }),

  getters: {
    email: (state: AuthState) => {
      return state.user ? state.user.email : "";
    },
  },

  actions: {
    login(username: string, password: string): User | false {
      if (username === "admim" && password === "admim") {
        const user: User = {
          name: "Administrador",
          email: "admim@admim.com",
        };

        this.user = user;
        this.name = user.name;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("name", user.name);

        return user;
      } else {
        this.user = false;
        this.name = "";
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        return false;
      }
    },

    logout() {
      this.name = "";
      this.user = false;
      this.avatarUrl = null;

      localStorage.removeItem("name");
      localStorage.removeItem("user");
      localStorage.removeItem("avatarUrl");

    },

    setAvatar(url: string | null) {
      this.avatarUrl = url;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
