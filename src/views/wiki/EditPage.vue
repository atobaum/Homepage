<template lang="pug">
    .ui.container.segment
        h1
            a(:href="'/wiki/view/'+page.fulltitle") {{ page.fulltitle }}
            small {{ page.revId ? " (R"+page.revId+" 수정)" : " (새 문서 만들기)" }}
        .ui.form
            .ui.top.attached.tabular.menu
                a.item.active(data-tab="edit") 편집
                a.item(data-tab="preview") 미리보기
            .ui.bottom.attached.tab.segment.active(data-tab="edit")
                textarea.ui.textarea(rows=25 name="src", :readonly="page.readOnly", v-model="page.srcStr")
            .ui.bottom.attached.tab.segment(data-tab="preview")
                .wiki_content.language-javascript.preview
            div(v-if="!page.readOnly")
                tag-search(:tags="page.tags")
            .fields(v-if="!page.readOnly")
                .ui.field.small.input.ten.wide
                    input(type="text" v-model="page.comment" placeholder="Comment...")
                button.right.ui.primary.button(type='submit', @click="submit()") 제출
</template>
<script>
    import TagSearch from './Components/TagSearch.vue'
    export default{
        data(){
            return {
                page: {
                    tags: []
                }
            }
        },
        methods: {
            submit: function () {
                let t = this;
                $.post({
                    url: '/api/wiki/edit',
                    data: {data: JSON.stringify(this.page)},
                    dataType: 'json'
                })
                    .done(data => {
                        console.log(data);
                        if (data.ok === 1) {
                            window.location.href = '/wiki/view/' + t.page.fulltitle;
                        } else {
                            console.log("Error while submit edited page: ", data.error);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        console.log('Error occurred: ', textStatus, errorThrown);
                    })
            }
        },
        created: function () {
            $.get('/api/wiki/src?title=' + $('#wiki_title').val())
                .done(data => {
                    if (data.ok === 1) {
                        this.page = data.result;
                    } else {
                        console.log("Error while reading source: ", data.error);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log('Error occurred: ', textStatus, errorThrown);
                })
        },
        mounted: function () {
            let t = this;
            $('.tabular.menu .item').tab({
                cache: false
            });
            $('.tabular.menu a.item[data-tab="preview"]').click(function () {
                $('.ui.dimmer').dimmer('show');
                $.post('/api/wiki/parse', {text: t.page.srcStr, title: t.page.fulltitle})
                    .done((res) => {
                        $('.preview').html(res.result);
                        $('.wiki-syntaxhl code').each(function (i, elem) {
                            Prism.highlightElement(elem)
                        })
                    })
                    .fail((xhr, status, error) => {
                        console.log(xhr.responseText);
                    })
            });
        },
        components: {TagSearch}
    }
</script>
<style>

</style>