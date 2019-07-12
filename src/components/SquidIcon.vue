<template>
    <svg class="squid-icon" viewBox="0 0 48 48">
        <use v-bind="{'xlink:href':'/icons/squidink.svg#' + icon}"></use>
    </svg>
</template>
<script>


export default {
    name: "suqid-icon",
    props: ["icon"],
    data() {
        return {}
    },
}

</script>
<style>
.squid-icon {
    height: 100%;
}
</style>