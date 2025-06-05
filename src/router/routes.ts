import type { RouteRecordRaw } from "vue-router";

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
    children: [
      {
        path: "home",
        component: () => import("pages/HomePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        component: () => import("pages/UserProfile.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "medicines",
        component: () => import("pages/MedicineList.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "shopping",
        component: () => import("pages/ShoppingList.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "chat",
        component: () => import("pages/ChatAssistant.vue"),
        meta: { requiresAuth: true },
      },  
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
