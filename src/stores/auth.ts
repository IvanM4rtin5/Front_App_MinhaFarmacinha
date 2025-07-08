import { defineStore, acceptHMRUpdate } from "pinia";
import { api } from "src/boot/axios";
import type { AxiosError } from "axios";

interface User {
  id: number;
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
    async login(
      email: string,
      password: string,
      notify?: { success: (msg: string) => void; error: (msg: string) => void }
    ): Promise<User | false> {
      try {
        const response = await api.post("/auth/login", {
          username: email,
          password: password,
        });

        if (response.data?.access_token) {
          localStorage.setItem("token", response.data.access_token);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.access_token}`;

          try {
            // console.log("Token recebido:", response.data.access_token);
            const tokenPayload = JSON.parse(
              atob(response.data.access_token.split(".")[1])
            );
            const userId = tokenPayload.sub;
            // console.log("ID extraído do token:", userId);
            const userResponse = await api.get(`/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            });
            // console.log("Resposta do GET /users:", userResponse);
            const userData = userResponse.data;

            const user: User = {
              id: userData.id,
              name: userData.username,
              email: userData.email,
            };

            this.user = user;
            this.name = user.name;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("name", user.name);

            notify?.success("Login realizado com sucesso!");
            return user;
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            throw error;
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        const status = axiosError.response?.status;

        switch (status) {
          case 401:
            notify?.error("Usuário ou senha incorretos");
            break;
          case 404:
            notify?.error("Usuário não encontrado");
            break;
          default:
            notify?.error("Erro ao realizar login. Por favor tente novamente.");
        }

        console.error(
          "Erro ao fazer login:",
          axiosError.response?.data || axiosError.message
        );
      }

      this.user = false;
      this.name = "";
      localStorage.removeItem("user");
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      return false;
    },

    logout() {
      this.name = "";
      this.user = false;
      this.avatarUrl = null;

      localStorage.removeItem("name");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("avatarUrl");

      delete api.defaults.headers.common["Authorization"];
    },

    setAvatar(file: File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.avatarUrl = base64;
        localStorage.setItem("avatarUrl", base64);
      };
      reader.readAsDataURL(file);
    },

    updateProfile(profileData: { name: string; email: string }) {
      this.name = profileData.name;
      if (this.user && typeof this.user === "object") {
        this.user = {
          ...this.user,
          email: profileData.email,
        };
      }

      localStorage.setItem("name", profileData.name);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
