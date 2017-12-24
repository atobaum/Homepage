<template lang="pug">
    .ui.segment
        .ui.img(style="float:left")
            img(:src="book.coverURL")
        .ui.list(style="float:left; margin:15px")
            .item
                strong {{ book.title }}
            .item {{ book.authors.map(i => i.name + ' ' + i.type).join(', ')}}
            .item {{ book.publisher }}|{{ book.publishedDate }}
</template>
<script>
    export default{
        data(){
            return {
                strAuthors: null,
            }
        },
        props: ['book'],
    }
</script>
<style scoped>
    .ui.segment {
        overflow: auto;
    }
</style>