import Vue from 'nativescript-vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '../components/Home';
import Signals from '../components/Signals';

const router = new VueRouter({
  routes: [{
      path: '/home',
      component: Home,
      meta: {
        title: 'Home',
      },
    }, {
      path: '/signals',
      component: Signals,
      meta: {
        title: 'signals',
      },
    },
    {
      path: '*',
      redirect: '/home'
    },
  ],
});

router.replace('/home');

export default router;