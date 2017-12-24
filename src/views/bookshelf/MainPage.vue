<template lang="pug">
    div
        .ui.cards
            .ui.card#new_reading_card(v-if="isUser")
                router-link.ui.content(to="/newreading")
                    i.inverted.big.plus.icon
            reading-card(v-for="reading in curReadings", :key='reading.id', :reading="reading", @detailReadingInfo="showDetailReadingInfo")
        reading-list

</template>
<script>
    import ReadingList from "./Components/ReadingList.vue"
    import ReadingCard from "./Components/ReadingCard.vue"
    export default {
        components: {ReadingList, ReadingCard},
        data () {
            return {
                readings: null,
                isUser: document.getElementById('isUser').value == '1',
                readingNum: null,
                curReadings: [],
                selectedReading: null
            }
        },
        methods: {
            showDetailReadingInfo: function (id) {
                this.selectedReading = null;
                this.selectedReading = id;
            }
        },
        mounted: function () {
            $.getJSON("/api/bookshelf/currentreading")
                .done(data => {
                    if (data.ok == 1)
                        this.curReadings = data.result;
                    else {
                        console.log("Fail to load current readings");
                        console.log(data);
                    }
                })
                .fail((jqxhr, textStatus, error) => {
                    console.log("Fail to load current readings");
                    console.log(jqxhr, textStatus, error);
                });
        },
    }
</script>

<style>
    .ui.cards {
        margin: 10px;
    }

    #new_reading_card {
        background-color: lightgrey;
        max-width: 150px !important;
    }

    #new_reading_card i {
        margin: auto;
    }
</style>
