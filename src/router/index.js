import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/views/Home'
import Login from '@/components/views/Login'
import Consumption from '@/components/views/Consumption'

// roles are:
// 2 - admin
// 4 - abonent
// 999 - default, minimal role
const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requireAuth: true,
      title: 'Главная',
      acl: 4, // the role with the smallest privileges
    }
  }, {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Вход в систему'
    }
  }, {
    path: '/user_consumption',
    name: 'user_consumption',
    component: Consumption,
    meta: {
      requireAuth: true,
      title: 'Потребление ресурсов',
      acl: 4
    }
  }]
})

export default router