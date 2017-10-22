<template lang="pug">
    .ui.search.fluid#book-search(v-if='show')
        .ui.icon.input
            input.prompt(type="text", placeholder='책 검색...')
            i.search.icon
        .results
            div(style="float:left;")
                table
                    tbody
                        tr
                            td
                                img
                            td
                                strong 제목
                                ul
                                    li 저자
                                    li 출판사|날짜
</template>

<script>
    export default {
        props: ['show'],
        mounted: function () {
            let search = this;
            $(this.$el).search({
                apiSettings: {
                    url: "/api/bookshelf/searchbook?keyword={query}",
                    onResponse: function (res) {
                        if (res.error)
                            console.error(res.error);
                        else {
                            res.result.forEach(book => {
                                book.strAuthors = book.authors.map(author => author.name + ' ' + author.type).join(', ');
                                book.desc = book.strAuthors + '<br>' + book.publisher + '|' + book.publishedDate;
                            });
                            return res;
                        }
                    }
                },
                searchDelay: 1000,
                onSelect: function (result) {
                    search.$emit("book-selected", result);
                },
                fields: {
                    results: 'result',
                    description: 'desc',
                    image: 'coverURL'
                }
            });
        }
    }

</script>

<style>

    .ui.search {
        margin: 15px;
    }

    .title {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .results {
        width: 300px;
    }

    .search .image {
        height: 98px !important;
        width: auto !important;
    }
</style>