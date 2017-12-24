<template lang="pug">
    .ui.card
        .ui.move.reveal.image(v-if="reading.book")
            img.visible.content.ui.centered.small.image(:src="reading.book.coverURL")
            .hidden.content.ui.list
                .item
                    strong {{ reading.book.title }}
                .item {{ reading.book.authors.map(aut=>aut.name + ' ' + aut.type).join(', ') }}
                .item {{ reading.book.publisher }}
                .item {{ reading.book.publishedDate }}

        .content
            .ui.list
                .item {{ reading.date[0] }} ~
                .item {{ reading.date[1] ? reading.date[1] : '읽는 중' }}
        .extra.content
            span.left.floated
                i.user.icon
                | {{ reading.user }}
            router-link.ui.button.right.floated(:to="'/reading/'+reading.id") 자세히
</template>
<script>
    export default{
        props: ["reading"],
        methods: {
            viewDetailInfo: function () {
                this.$emit('detailReadingInfo', this.reading.id);
            }
        }
    }
</script>
<style scoped>
    .card {
        max-width: 150px !important;
    }
</style>