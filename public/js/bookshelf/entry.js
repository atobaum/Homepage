/**
 * Created by Le Reveur on 2017-10-21.
 */

import VueRouter from "vue-router";
import MainPage from "./MainPage.vue";
import ReadingPage from "./ReadingPage.vue";
import NewReadingPage from "./NewReadingPage.vue";
Vue.use(VueRouter);

const routes = [
    {path: '/', component: MainPage},
    {path: '/reading/:id', component: ReadingPage},
    {path: '/newreading', component: NewReadingPage}
];
const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    router
});