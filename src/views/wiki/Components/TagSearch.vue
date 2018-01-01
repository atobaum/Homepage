<template lang="pug">
    .inline.fields
        .ui.small.search
            input.prompt(type="text", placeholder="태그 검색...")
            .results
        .ui.labels(v-for="(tag, index) in tags", :key="tag.id")
            a.ui.tag.label
                | {{ tag }}
                i.delete.icon(@click="deleteTag(index)")

</template>
<script>
    export default{
        props: ['tags'],
        methods: {
            addTag: function (tag) {
                if (this.tags.indexOf(tag) < 0)
                    this.tags.push(tag);
            },
            deleteTag: function (idx) {
                this.tags.splice(idx, 1);
            }
        },
        mounted: function () {
            let t = this;
            $(this.$el).search({
                apiSettings: {
                    url: '/api/search/tag?q={query}'
                },
                fields: {
                    results: 'result',
                    description: "count",
                    title: "name"
                },
                searchDelay: 500,
                onSelect: function (tag) {
                    t.addTag(tag.name);
                },
                showNoResults: false
            });
            $(this.$el).find('input').keydown(evt => {
                if (evt.keyCode == 13) {
                    evt.preventDefault();
                    t.addTag(evt.target.value);
                    evt.target.value = '';
                }
            })
        }
    }
</script>
<style scoped>
    .labels {
        margin-left: 5px;
    }

</style>