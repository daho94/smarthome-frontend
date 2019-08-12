<template>
    <svg viewBox="0 0 440 100">
        <use v-bind="{'xlink:href':'/icons/AppIcons.svg#' + icon}"></use>
    </svg>
</template>
<script>


export default {
    name: "app-icon",
    props: ["icon"],
    data() {
        return {}
    },
}

</script>