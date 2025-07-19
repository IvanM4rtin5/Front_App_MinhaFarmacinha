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
  avatarUrl: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    name: localStorage.getItem("name") || "",
    user: JSON.parse(localStorage.getItem("user") || "false"),
    avatarUrl: localStorage.getItem("avatarUrl") || "",
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

    async deleteAccount(notify?: {
      success: (msg: string) => void;
      error: (msg: string) => void;
    }) {
      try {
        await api.delete("/users/account", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        this.logout();
        notify?.success("Conta deletada com sucesso!");
      } catch (error) {
        notify?.error("Erro ao deletar conta");
        console.error(error);
      }
    },

    logout() {
      this.name = "";
      this.user = false;
      this.avatarUrl = "";

      localStorage.removeItem("name");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("avatarUrl");

      delete api.defaults.headers.common["Authorization"];
    },

    async uploadAvatar(
      file: File,
      notify?: { success: (msg: string) => void; error: (msg: string) => void }
    ) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/users/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data?.avatar) {
          this.avatarUrl = `data:image/png;base64,${response.data.avatar}`;
          localStorage.setItem("avatarUrl", this.avatarUrl);
          notify?.success("Avatar atualizado com sucesso!");
        }
      } catch (error) {
        notify?.error("Erro ao atualizar avatar");
        console.error(error);
      }
    },
    async changePassword(
      oldPassword: string,
      newPassword: string,
      notify?: { success: (msg: string) => void; error: (msg: string) => void }
    ) {
      try {
        await api.post(
          "/users/change-password",
          {
            old_password: oldPassword,
            new_password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        notify?.success("Senha alterada com sucesso!");
      } catch (error) {
        const axiosError = error as AxiosError;
        const detail = (axiosError.response?.data as { detail?: string })
          ?.detail;
        if (detail) {
          notify?.error(detail);
        } else {
          notify?.error("Erro ao alterar senha");
        }
        console.error(error);
      }
    },
    async updateProfile(
      profileData: { name: string; email: string },
      notify?: { success: (msg: string) => void; error: (msg: string) => void }
    ) {
      try {
        const response = await api.put(
          "/users/profile",
          {
            username: profileData.name,
            email: profileData.email,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const userData = response.data;
        this.name = userData.username;
        if (this.user && typeof this.user === "object") {
          this.user = {
            ...this.user,
            name: userData.username,
            email: userData.email,
          };
        }
        localStorage.setItem("name", userData.username);
        localStorage.setItem("user", JSON.stringify(this.user));
        notify?.success("Perfil atualizado com sucesso!");
      } catch (error) {
        notify?.error("Erro ao atualizar perfil");
        console.error(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
