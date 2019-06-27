<template>
    <section style="height: 100%">
        <highcharts class="chart" :options="options" :updateArgs="updateArgs"></highcharts>
        <resize-observer @notify="resizeDebounced" />
    </section>
</template>

<script>
import { Chart } from 'highcharts-vue'
import debounce from 'lodash/debounce'

export default {
    name: 'base-chart',
    components: {
        highcharts: Chart,
    },
    props: ["options"],
    data () {
        return {
            updateArgs: [true, true, {duration: 1000}],
        }
    },
    methods: {
        resize: async function() {
            await this.$nextTick()
            this.$children[0].chart.reflow()
        },
    },
    mounted() {
        this.resize()
    },
    created() {
        let vm = this
        this.resizeDebounced = debounce(function() { vm.resize() }, 300)
    },
}
</script>

<style>
.chart {
    height: 100%;
    width: 100%;
}
</style>