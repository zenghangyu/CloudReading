import Vue from 'vue'
import Router from 'vue-router'
/*import login from '@/components/login/login';*/
import login from '../components/login/login.vue';
import register from '../components/register/register.vue';
import index from '../components/index/index.vue';
import findBook from '../components/findBook/findBook.vue';
import My from '../components/My/My.vue';
import examination from '../components/examination/examination.vue';
import examinationresult from '../components/examinationresult/examinationresult.vue';
import modifypassword from '../components/modifypassword/modifypassword.vue';
import Myspace from '../components/Myspace/Myspace.vue';
import Myresult from '../components/Myresult/Myresult.vue';
import searchResult from '../components/searchResult/searchResult.vue';
import megessList from '../components/megessList/megessList.vue';

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/findBook',
      name: 'findBook',
      component: findBook
    },
    {
      path: '/My',
      name: 'My',
      component: My
    },
    {
      path: '/examination',
      name: 'examination',
      component: examination
    },
    {
      path: '/examinationresult',
      name: 'examinationresult',
      component: examinationresult
    },
    {
      path: '/modifypassword',
      name: 'modifypassword',
      component: modifypassword
    },
    {
      path: '/Myspace',
      name: 'Myspace',
      component: Myspace
    },
    {
      path: '/Myresult',
      name: 'Myresult',
      component: Myresult
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: searchResult
    },
    {
      path: '/megessList',
      name: 'megessList',
      component: megessList
    },
  ],
  // scrollBehavior (to, from, savedPosition) {
  //   return { x: 0, y: 0 }
  // },
})
