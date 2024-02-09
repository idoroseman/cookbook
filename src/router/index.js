import { createRouter, createWebHistory } from 'vue-router'
import RecepiesListVue from '@/views/RecepiesList.vue'
import RecepieDetails from '@/views/RecepieDetails.vue'
import RecepiesCreate from '@/views/RecepiesCreate.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: RecepiesListVue
  },
  {
    path: '/recepie/new',
    name: 'new',
    component: RecepiesCreate
  },
  {
    path: '/recepie/:id?',
    name: 'recepieView',
    component: RecepieDetails,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
