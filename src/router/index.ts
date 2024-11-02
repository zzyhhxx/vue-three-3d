import { createRouter, createWebHistory } from 'vue-router'
import Design from '../views/design/design.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Design,
    meta: {
      title: '3d作图'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = String(
    to.matched[0] ? to.matched[0].meta.title : '3d作图'
  )
  next()
})

export default router
