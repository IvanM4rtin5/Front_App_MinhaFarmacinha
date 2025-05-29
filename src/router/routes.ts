import type { RouteRecordRaw } from "vue-router";
import { authMiddleware } from "./middleware/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LogInPage.vue") },
      { path: "signup", component: () => import("pages/SignUpPage.vue") },
    ],
  },
  {
    path: "/app",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter: authMiddleware,
    children: [
      { path: "home", component: () => import("pages/HomePage.vue") },
      { path: "profile", component: () => import("pages/UserProfile.vue") },
      { path: "medicines", component: () => import("pages/MedicineList.vue") },
      { path: "shopping", component: () => import("pages/ShoppingList.vue") },
      { path: "chat", component: () => import("pages/ChatAssistant.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
