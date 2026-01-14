import { createRouter, createWebHistory } from 'vue-router'
import BuilderView from '../views/BuilderView.vue'
import PreviewView from '../views/PreviewView.vue'
import SubmissionsView from '../views/SubmissionsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/builder'
  },
  {
    path: '/builder',
    name: 'builder',
    component: BuilderView,
    meta: {
      title: 'Form Builder'
    }
  },
  {
    path: '/preview',
    name: 'preview',
    component: PreviewView,
    meta: {
      title: 'Prévisualisation'
    }
  },
  {
    path: '/submissions',
    name: 'submissions',
    component: SubmissionsView,
    meta: {
      title: 'Mes formulaires'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Dynamic Form Builder`
    : 'Dynamic Form Builder'
  next()
})

export default router
