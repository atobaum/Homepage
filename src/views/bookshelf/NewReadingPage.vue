<template lang="pug">
    .div
        .ui.error.message(v-if="noBookError")
            .header 책을 선택하세요.
        book-search(:reading="reading")
        reading-form(:edit="true", :reading = "reading", :submit = "submit")
            button.ui.positive.button(type="submit") 저장

</template>
<script>
    import BookSearch from './Components/BookSearch.vue'
    import ReadingFrom from './Components/ReadingForm.vue'
    export default{
        data(){
            return {
                reading: {book: null, date: []},
                noBookError: false
            }
        },
        props: ['viewName'],
        methods: {
            submit: function () {
                if (!this.reading.book)
                    this.noBookError = true;
                else {
                    let router = this.$router;
                    $.post('/api/bookshelf/reading?action=new', {data: JSON.stringify(this.reading)})
                        .done(data => {
                            if (data.ok == 1) {
                                router.go(-1);
                            } else {
                                console.log("Error while submit reading: ", data.error);
                                console.log(data);
                            }
                        })
                        .fail((jqXHR, textStatus, errorThrown) => {
                            console.log('Error occurred: ', textStatus, errorThrown);
                        });
                }
            }
        },
        components: {bookSearch: BookSearch, readingForm: ReadingFrom}
    }
</script>

<style>

</style>
