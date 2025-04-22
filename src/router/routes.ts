import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'profile', component: () => import('pages/UserProfile.vue') },
      { path: 'medicines', component: () => import('pages/MedicineList.vue') },
      { path: 'shopping', component: () => import('pages/ShoppingList.vue') },
      { path: 'chat', component: () => import('pages/ChatAssistant.vue') },
    ],
  },
  { path: '', component: () => import('pages/LogInPage.vue') },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
];

export default routes;
