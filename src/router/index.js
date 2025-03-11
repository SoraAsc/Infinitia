import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Documentation from '../views/Documentation.vue'
import Examples from '../views/Examples.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/documentation',
    name: 'documentation',
    component: Documentation
  },
  {
    path: '/examples',
    name: 'examples',
    component: Examples
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
}) 