import type { RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "../../stores/auth";

export function authMiddleware(_to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  console.log("Rota acessada:", _to.path);

  if (!authStore.user) {
    return { path: "/" };
  }

  return true;
}
