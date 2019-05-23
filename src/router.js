import Vue from 'vue';
import Router from 'vue-router';

import Home from './routes/Home'
import Login from './routes/Login'

import { validate } from './calls/auth'

Vue.use(Router);

export const router = new Router({
  mode: 'hash',
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/:dashboardId', name: 'dashboard', component: Home },
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