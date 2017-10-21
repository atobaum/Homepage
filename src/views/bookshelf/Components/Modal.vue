<template lang="pug">
    .ui.modal
        i.close.icon
        .header
        component.body(v-bind:is="curView")
        .footer
</template>

<script>

</script>

<style>

</style>