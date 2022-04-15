import Vue from 'vue';
import App from './App.vue';

import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyC8Eoo5TL9EW6nrWMDjAms9M2I4HoL2nuY",
  authDomain: "a-i-u-e-o.firebaseapp.com",
  projectId: "a-i-u-e-o",
  storageBucket: "a-i-u-e-o.appspot.com",
  messagingSenderId: "395286522266",
  appId: "1:395286522266:web:605e3689be9558d6c3b223"
});

export { firebaseApp };

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

require('@/assets/css/destyle.css');
