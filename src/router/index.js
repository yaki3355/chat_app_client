import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Room from '../views/Room.vue';
import socket from '../socket';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      socket.emit('leaveRoom');
      next();
    }
  },
  {
    path: '/room',
    name: 'Room',
    component: Room,
    beforeEnter: (to, from, next) => {
      socket.emit('exists', exists => {
        if (exists) return next();
        next('/');
      });
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;