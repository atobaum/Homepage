"use strict";

let readings;

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
});
