<template lang="pug">
    table.ui.celled.table
        thead
            tr
                th 책 제목
                th 저자
                th 날짜
                th 읽은 사람
        tbody
            tr(v-for="reading in readings")
                td.text-overflow
                    a(@click="viewBook(reading.book.isbn13)") {{ reading.book.title }}
                td {{ reading.book.authors.map(author => author.name + ' ' + author.type).join(', ') }}
                td
                    router-link(:to="'/reading/'+reading.id") {{ reading.date[0] }} ~ {{ reading.date[1] }}
                td {{ reading.user }}

        tfoot
            tr
                th(colspan=5).center.aligned
                    .ui.pagination.menu(v-for="num in pages")
                        a.item(href="#" v-bind:class="{ active: num == curPage }", @click="changePage(num)") {{ num }}

</template>

<script>
    import * as axios from "axios";
    export default{
        name: "ReadingList",
        props: ["isUser", "viewBook", "viewReading"],
        data(){
            return {
                readings: [],
                curPage: 0,
                maxPage: 1
            }
        },
        computed: {
            pages: function () {
                let result = [];
                let larger = (this.curPage + 5 > this.maxPage) ? this.maxPage : this.curPage + 5;
                for (let i = (this.curPage > 6 ? this.curPage - 5 : 1); i <= larger; i++)
                    result.push(i);
                return result;
            }
        },
        methods: {
            changePage: function (num) {
                axios.get('/api/bookshelf/recentreading?page=' + num)
                    .then(result => {
                        let res = result.data.result;
                        this.readings = res[0];
                        this.maxPage = res[1];
                        this.curPage = num;
                    })
                    .catch(e => {
                        throw e;
                    });
            },
        },
        mounted: function () {
            this.changePage(1);
        }
    }

</script>

<style>

</style>