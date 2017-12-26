<template lang="pug">
    .div
        book-panel(v-if="reading.book", :book="reading.book")
        reading-form(:edit="edit", :reading="reading")
            .ui.buttons(v-if="reading && reading.own")
                .ui.orange.button(v-if="!edit", @click="edit=true") 수정
                .ui.positive.button(v-else, @click="submit") 저장
                .ui.negative.button(@click="deleteReading") 삭제

</template>
<script>
    import BookPanel from './Components/BookPanel.vue'
    import ReadingFrom from './Components/ReadingForm.vue'
    export default{
        data(){
            return {
                reading: {book: null, date: []},
                edit: false //true while editing
            }
        },
        props: ['viewName'],
        methods: {
            submit: function () {
                let router = this.$router;
                $.post('/api/bookshelf/reading?action=edit', {data: JSON.stringify(this.reading)})
                    .done(data => {
                        if (data.ok == 1) {
                            router.go(-1);
                        } else {
                            console.log("Error while submit reading: ", data.error);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        console.log('Error occurred: ', textStatus, errorThrown);
                    })
            },
            deleteReading: function () {
                if (confirm('기록을 삭제할까요?')) {
                    let router = this.$router;
                    $.ajax({
                        url: '/api/bookshelf/reading?id=' + this.reading.id,
                        type: 'DELETE'
                    })
                        .done(data => {
                            router.go(-1);
                        })
                        .fail((jqXHR, textStatus, errorThrown) => {
                            console.log('Error occurred: ', textStatus, errorThrown);
                        })

                }
            }
        },
        created: function () {
            let thisCom = this;
            $.get('/api/bookshelf/reading/' + this.$route.params.id)
                .done(data => {
                    if (data.ok == 1) {
                        thisCom.reading = data.result;
                    } else {
                        console.log("Error while load reading: ", data.error);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log('Error occurred: ', textStatus, errorThrown);
                })
        },
        components: {bookPanel: BookPanel, readingForm: ReadingFrom}
    }
</script>

<style>

</style>
