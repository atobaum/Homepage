<template lang="pug">
    form.ui.segment.form
        .fields.inline
            .field
                label 읽은 날짜
                input(type="date", name="date_started", :readonly="!edit", v-model="reading.date[0]", required=true)
            .field
                label ~
            .field
                input(type="date", :readonly="!edit", v-model="reading.date[1]")
        .field
            label 평점
            star-rating(v-bind:rating="reading.rating && reading.rating/2", v-bind:increment="0.5", v-bind:star-size="25", :read-only="!edit", @rating-selected="updateRating")
        .field
            label 후기
            textarea(name='comment', v-model='reading.comment', :readonly="!edit")
        #is_secret.inline.field(style="display:none")
            .ui.toggle.checkbox
                input(type="checkbox", tabindex="0", :readonly="!edit")
                label 비밀
        .field
            label 읽은 사람
            a {{ reading && reading.user }}
        slot
</template>

<script>
    import StarRating from "vue-star-rating"
    export default {
        data(){
            return {
                rating: null
            }
        },
        methods: {
            updateRating: function (val) {
                this.reading.rating = val * 2;
            }
        },
        watch: {
            reading: function (reading) {
                this.rating = reading.rating / 2;
            },
        },
        mounted: function () {
            let submit = this.submit;
            $(this.$el).submit(() => {
                submit();
                return false;
            })
        },
        props: ['user', 'reading', 'edit', 'submit'],
        components: {StarRating: StarRating}
    }
</script>

<style>

</style>