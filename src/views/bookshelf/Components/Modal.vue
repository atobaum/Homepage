<template lang="pug">
    .ui.fullscreen.modal#modal
        i.close.icon
        .header {{ titles[viewName] }}
        .scrolling.content(:is="viewName")
        .actions
            .ui.approve.button adf
</template>
<script>
    import AddReading from './AddReading.vue'
    export default{
        data(){
            return {
                titles: {
                    "addReading": "읽은 책 추가하기.",
                    "viewReading": ""
                }
            }
        },
        props: ['viewName', 'show'],
        methods: {},
        watch: {
            show: function (t) {
                if (t) {
                    $(this.$el).modal('show');
                } else {
                    $(this.$el).modal('hide');
                }
            }
        },
        mounted: function () {
            let modal = this;
            $(this.$el).modal({
                onHidden: () => {
                    this.$emit('modalClosed');
                }
            })
        },
        components: {addReading: AddReading}
    }
</script>

<style>

</style>