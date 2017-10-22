<template lang="pug">
    div
        .ui.styled.fluid.accordion
            .title
            view-reading(:id="readingNum", @resetAcc="resetAcc()").content
            .title
            add-reading.content(v-if="isUser", @resetAcc="resetAcc()")

        a.ui.green.basic.button(v-if="addButton", @click="openAddReading") 읽은 책 추가
        reading-list(:viewReading="openViewReading")
</template>
<script>
    import ReadingList from "./Components/ReadingList.vue"
    import ViewReading from "./Components/ViewReading.vue"
    import AddReading from "./Components/AddReading.vue"
    export default {
        data () {
            return {
                readings: [],
                isUser: document.getElementById('isUser').value == '1',
                readingNum: null,
                addButton: $('#isUser').val() == '1'
            }
        },
        methods: {
            openViewReading: function (num) {
                $(this.$el).children('.accordion').accordion('open', 0);
                $(this.$el).children('.accordion').accordion('close', 1);
                this.addButton = this.isUser;
                this.readingNum = num;
            },
            openAddReading: function () {
                $(this.$el).children('.accordion').accordion('close', 0);
                $(this.$el).children('.accordion').accordion('open', 1);
                this.addButton = false;
            },
            resetAcc: function () {
                $(this.$el).children('.accordion').accordion('close', 0);
                $(this.$el).children('.accordion').accordion('close', 1);
                this.addButton = this.isUser;
            }
        },
        mounted: function () {
            $(this.$el).children('.accordion').accordion();
        },
        components: {ViewReading: ViewReading, ReadingList: ReadingList, AddReading: AddReading},
    }
</script>

<style>
    .accordion > .title {
        display: none;
    }

    .ui.green.basic.button {
        margin: 10px;
    }
</style>
