import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: () => import('../views/layout/Layout.vue'),
    redirect: '/dashboard/contacts',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'contacts',
        name: 'Contacts',
        component: () => import('../views/contacts/Contacts.vue'),
        meta: { title: '联系人管理' }
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import('../views/groups/Groups.vue'),
        meta: { title: '群组管理' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/dashboard'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated']
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    if (isAuthenticated && to.path === '/login') {
      next({ path: '/dashboard' })
    } else {
      next()
    }
  }
})

export default router