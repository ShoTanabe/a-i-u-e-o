import Vue from 'vue';
import Router from 'vue-router';

import Home from "./views/home.vue";
import Quiz from "./views/quiz.vue";
import Free from "./views/free.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: '/', component: Home },
    { path: '/quiz', component: Quiz },
    { path: '/free', component: Free }
  ]
});
