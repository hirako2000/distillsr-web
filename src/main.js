
import { createApp } from 'vue';
import App from './App.vue';
import './assets/style.css';
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import HowView from './views/HowView.vue'
import AboutView from './views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/how', component: HowView },
    { path: '/about', component: AboutView }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')