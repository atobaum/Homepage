"use strict";

let readings, modal;

function getRecentReadings(page) {
    $.ajax({
        type:"get",
        url: "/bookshelf/api/recentReading?page="+page,
        success: function(response){
            if(response.ok === 0){
                console.log(response.err);
                alert('오류 발생. 관리자에게 문의하세요.');
                return;
            }
            console.log(response.result);
            var maxPage = response.result[1];
            readings.readings = response.result[0];

            let pages = [];
            for (let i = (page > 5) ? page : 1,
                     last = (response.result[1] > page + 5 ? page + 5 : response.result[1]); i < last; i++)
                pages.push(i);
            readings.curPage = page;
            readings.pages = pages;
        },
        error: function(){alert('error');}
    });
}

let ViewAddReading = {
    template: ``
};
let app;
$(document).ready(function(){
    readings = new Vue({
        el: 'table#readings',
        data: {
            readings: [],
            curPage: 0,
            pages: [0, 0]
        },
        methods: {
            pageNumber: (event) => {
                getRecentReadings(event.target.textContent);
            }
        }
    });
    getRecentReadings(1);
    modal = new Vue({
        el: '#modal',
        data: {
            curView: 'test'
        },
        components: {
            test: {template: "<h1>asdf</h1>"}
        },
        methods: {
            showAddReading: () => {

            },
            viewReading: (id) => {
            },
        }
    });
    $('#addReading').click();
    const NotFound = {template: '<p>Page not found</p>'};
    const Home = {template: '<p>home page</p>'};
    const About = {template: '<p>about page</p>'};
    const routes = {
        '/': Home,
        '/about': About
    };
    app = new Vue({
        el: '#app',
        data: {
            currentRoute: window.location.pathname
        },
        computed: {
            ViewComponent () {
                return routes[this.currentRoute] || NotFound
            }
        },
        render (h) {
            return h(this.ViewComponent)
        }
    })
});
