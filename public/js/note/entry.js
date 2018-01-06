/**
 * Created by Le Reveur on 2017-10-21.
 */
import Vue from "vue";
import VueRouter from "vue-router";
import MainPage from "./MainPage.vue";
Vue.use(VueRouter);

const routes = [
    {path: '/', component: MainPage},
];
const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    router
});