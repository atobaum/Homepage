<template lang="pug">
    .ui.segment#book-panel(v-if="book")
        .ui.img(style="float:left")
            img(:src="book && book.coverURL")
        .ui.list(style="float:left; margin:15px")
            .item
                strong {{ book && book.title }}
            .item {{ strAuthors }}
            .item {{ book && book.publisher }}|{{ book && book.publishedDate }}
</template>
<script>
    export default{
        data(){
            return {
                strAuthors: null
            }
        },
        props: ['book'],
        watch: {
            book: function (book) {
                if (book)
                    this.strAuthors = book.authors.map(i => i.name + ' ' + i.type).join(', ');
            }
        }
    }
</script>
<style>
    .ui.segment {
        height: 125px;
    }

    #book-panel img {
        height: 100px;
    }
</style>