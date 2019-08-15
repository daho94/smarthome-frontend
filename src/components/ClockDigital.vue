<template>
    <section class="wrapper">
        <div>{{ pad(hours) }}:{{ pad(minutes) }}:{{ pad(seconds) }}</div>
    </section>
</template>
<script>
export default {
    props: {
        hours: Number,
        minutes: Number,
        seconds: Number
    },
    data() {
        return {}
    },
    methods: {
        pad(num) {
            return num.toString().padStart(2, '0')
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 4rem;
    font-family: 'Share Tech Mono', monospace;
    @include themify($themes) {
        color: themed('clockTextColor');  
        text-shadow: 0 0 20px themed('clockTextShadow'),  0 0 20px rgba(10, 175, 230, 0);
    }
    background-size: 100%;
}
</style>