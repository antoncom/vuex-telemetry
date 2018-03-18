'use strict';
//// CSS ////
require('@/assets/font-awesome/css/font-awesome.css')
require('@/assets/css/animate.css')
require('@/assets/css/style.css')
//require('@/assets/css/bootstrap.css')

//// JS plugins ////
require('@/assets/js/plugins/metisMenu/jquery.metisMenu.js')
require('@/assets/js/plugins/slimscroll/jquery.slimscroll.min.js')
require('@/assets/js/inspinia.js')
require('@/assets/js/plugins/pace/pace.min.js')

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import 'bootstrap'

//// Vue, Vuex ////
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.config.productionTip = false

import App from './components/App'

//// Pretty Checkbox ////
import PrettyInput from 'pretty-checkbox-vue/input';
import PrettyCheck from 'pretty-checkbox-vue/check';
import PrettyRadio from 'pretty-checkbox-vue/radio';
Vue.component('p-input', PrettyInput);
Vue.component('p-check', PrettyCheck);
Vue.component('p-radio', PrettyRadio);

require('@/assets/css/plugins/pretty-checkbox/pretty-checkbox.min.css')
//import PrettyCheckbox from 'pretty-checkbox-vue';
//Vue.use(PrettyCheckbox);

//// Роутер ////
import router from './router'
import { sync } from 'vuex-router-sync'
// Promote to global variable
window.Vue = Vue
window.router = router
sync(store, router)

//// Axios ////
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'https://hometest.appix.ru/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.withCredentials = false

axios.interceptors.request.use(
    config => {
        nprogress.start()
        // Добавляем токен для всех запросов кроме /login
        if (store.state.token) {
            config.xsrfCookieName = 'AUTH-TOKEN'
            config.xsrfHeaderName = 'X-AUTH-TOKEN'
            config.headers['X-AUTH-TOKEN'] = sessionStorage.getItem('token')
        }
        //if (config.method == 'post') {
        //    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        //}
        return config
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

// http response Interceptor
axios.interceptors.response.use(
    response => {
        if (response.headers['set-cookie'] instanceof Array) {
            cookies = response.headers['set-cookie'].forEach(function(c) {
                cookieJar.setCookie(Cookie.parse(c), response.config.url, function(err, cookie) {});
            });
        }
        nprogress.done()
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT)
                    router.replace({
                        path: 'login',
                        query: { redirect: router.currentRoute.fullPath }
                    })
                case 500:
                    // TODO Bomb box prompts the error
                    break
            }
        }


        nprogress.done()
        return Promise.reject(error.response.data)
    }
);

//router.beforeEach((to, from, next) => {
//    if(to.meta.requireAuth) {
//        // проверяем роль
//        if(store.state.role <= to.meta.acl)  {
//            // доступ разрешён
//            next()
//        }
//        else if(store.state.role > to.meta.acl) {
//            // доступ запрещён
//            next({name: 'login'})
//        }
//        //next()
//    }
//    else {
//        // переходим на простую страницу, не требующую авторизации
//        next()
//    }
//})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        // Если требуется авторизация, то получаем текущую роль: /info
        // Сохраняем данные пользователя в store
        // Сравниваем роль и acl страницы

        if (sessionStorage.getItem('token')) {
            if (!store.state.authenticated) {
                store.state.token = sessionStorage.getItem('token')
                store.state.role = sessionStorage.getItem('role')
                store.state.authenticated = true
            }

            if(store.state.role <= to.meta.acl)  {
                // доступ разрешён
                console.log("Access permit")
                next()
            }
            else if(store.state.role > to.meta.acl) {
                // доступ запрещён
                console.log("Access DENIED")
                next({
                    path: '/login',
                    query: { redirect: to.fullPath }
                    })
            }
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath } // The jump of the routing path as a parameter, the login is successful jump to the routing
            })
        }
    } else {
        next();
    }
})

//// Прогресс бар ////
import NProgress from 'vue-nprogress'
Vue.use(NProgress)
// The loading bar
const nprogress = new NProgress(/*{ parent: '.nprogress-container' }*/)

//// Datatable ////
import Datatable from 'vue2-datatable-component'
Vue.use(Datatable)

//// Лодаш ////
import lodash from 'lodash'
//import VueLodash from 'vue-lodash'
Vue.use(lodash)

//// uiv bootstrap components ////
import 'bootstrap/dist/css/bootstrap.min.css'
import * as uiv from 'uiv'
Vue.use(uiv)

// tough-cookie The need net dependency
import tough from 'tough-cookie'
var Cookie = tough.Cookie
window.cookieJar = new tough.CookieJar()

//// Custom components ////
import store from './store'
import * as filters from './filters'
import * as types from './store/mutation-types'


// Registered filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  store,
  nprogress,
  render: h => h(App)
})



//const vm = new Vue({
//  // el: '#app',
//  router,
//  store,
//  nprogress,
//  render: h => h(App)
//}).$mount('#app')
