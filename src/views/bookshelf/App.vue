<template lang="pug">
    div
        ReadingList
        a.ui.green.basic.button#addReading(href="/bookshelf/reading/add", v-if="isUser") 읽은 책 추가

</template>

<script>
    import ReadingList from "./Components/ReadingList.vue"
    export default {
        data () {
            return {
                readings: [],
                msg: 'Welcome to Your Vue.js App'
            }
        },
        props: ["isUser"],
        components: {ReadingList: ReadingList},

    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
