<template>
    <svg class="squid-icon" viewBox="0 0 48 48" :stroke="stroke" :fill="fill">
        <use v-bind="{'xlink:href':'/icons/squidink.svg#' + icon}"></use>
    </svg>
</template>
<script>


export default {
    name: "suqid-icon",
    props: ["icon", "stroke", "fill"],
    data() {
        return {}
    },
}

</script>
<style>
.squid-icon {
    /* width: 100%; */
    height: 100%;
}
</style>