<template lang="pug">
    div
        book-panel(:book="reading && reading.book")
        book-form(:reading="reading", :edit="edit")
            .ui.buttons(v-if="reading && reading.own")
                button.ui.button.positive(v-if="edit", type='button', @click="save") 완료
                button.ui.button.yellow(v-else, type='button', @click="edit=true") 수정
                button.ui.button.negative(type='button') 삭제
            i.ui.close.icon(@click="reset(); $emit('resetAcc')")
</template>

<script>
    import BookPanel from "./BookPanel.vue"
    import BookForm from "./BookForm.vue"
    export default{
        data(){
            return {
                reading: null,
                book: null,
                edit: false
            }
        },
        watch: {
            id: function (id) {
                $.ajax({
                    method: 'get',
                    url: '/api/bookshelf/reading/' + id,
                    success: (res) => {
                        this.reading = res.reading;
                    },
                    error: (res, code, str) => {
                        console.error("ERROR(" + code + ')', res.error);
                    }
                })
            }
        },
        methods: {
            save: function () {
                $.ajax({
                    method: 'POST',
                    url: '/api/bookshelf/reading?action=edit',
                    data: JSON.stringify(this.reading),
                    contentType: 'application/json',
                    success: (res) => {
                        if (res.ok !== 1)
                            throw new Error("ok is 0 in success function: ViewReading.vue");
                        this.$emit('resetAcc');
                        this.edit = false;
                    },
                    error: (res, code) => {
                        console.error("ERROR(" + code + ')', res.error);
                    }
                })
            },
            reset: function () {
                this.edit = false;
            }
        },
        props: ['id'],
        components: {bookPanel: BookPanel, bookForm: BookForm}
    }
</script>

<style>

</style>