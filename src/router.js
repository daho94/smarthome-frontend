import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from './routes/DashboardPage'
import Login from './routes/LoginPage'

import { validate } from './calls/auth'

Vue.use(Router);

export const router = new Router({
  mode: 'hash',
  routes: [
    { path: '/', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/:dashboardId', name: 'dashboard', component: Dashboard },
    { path: '*', redirect: '/' },
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  if (authRequired) {
    validate().then(loggedIn => {
      if (!loggedIn) {
          return next('/login')
      }
      
      next()
    })
  }
  next()
})