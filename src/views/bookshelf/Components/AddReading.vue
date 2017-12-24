<template lang="pug">
    div
        book-search(@book-selected="setBook", :show="!book")
        book-panel(v-show="book", :book="book")
        book-form(edit="true", :reading="reading")
            .ui.buttons
                button.ui.button.positive(type="button",@click="saveReading") 완료
                button.ui.button.negative(type='reset', @click="reset; $emit('resetAcc')") 취소
</template>

<script>
    import BookSearch from "./BookSearch.vue"
    import BookPanel from './BookPanel.vue'
    import BookForm from './ReadingForm.vue'
    export default{
        data(){
            return {
                book: null,
                reading: {book: {}, date: []}
            }
        },
        methods: {
            saveReading: function () {
                $.ajax({
                    method: 'POST',
                    url: '/api/bookshelf/reading?action=new',
                    data: JSON.stringify(this.reading),
                    contentType: 'application/json',
                    success: (res) => {
                        if (res.ok !== 1)
                            throw new Error("ok is 0 in success function: AddReading.vue");
                        this.book = null;
                        this.reading = {book: {}, date: []};
                        this.edit = false;
                        this.$emit('resetAcc');
                    },
                    error: (res, code) => {
                        console.error("ERROR(" + code + ')', res.error);
                    }
                })
            },
            setBook: function (book) {
                this.book = book;
                this.reading.book = book;
                $('#book-form input[name="date_started"]').focus();
            },
            reset: function () {
                this.book = null;
                this.reading = {book: {}, date: []};
                $('#book-search').show();
            }
        },
        components: {
            BookSearch: BookSearch,
            BookPanel: BookPanel,
            BookForm: BookForm
        }
    }
</script>

<style>

</style>