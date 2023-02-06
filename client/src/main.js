import { createApp } from 'vue'
import NewGame from "@/pages/NewGame.vue";
import GameExists from "@/pages/GameExists.vue";
import {createRouter, createWebHistory} from "vue-router";
import App from "@/App.vue";

const routes = [
    { path: '/', component: NewGame },
    { path: '/account/:id', component: GameExists },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
