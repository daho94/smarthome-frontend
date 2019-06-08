<template>
    <section style="height: 100%">
        <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
        <resize-observer @notify="resizeDebounced" />
    </section>
</template>

<script>
import { Chart } from 'highcharts-vue'
import debounce from 'lodash/debounce'

export default {
    name: 'chart-test',
    components: {
        highcharts: Chart,
    },
    data () {
        return {
            chartOptions: {                   
                "title": {
                    "text": ""
                },
                "subtitle": {
                    "text": "",
                    "align": "left",
                    "floating": false,
                    "useHTML": false,
                    "style": {
                    "color": "#ffebee"
                    }
                },
                "exporting": {},
                "chart": {
                    "type": "line",
                    "backgroundColor": "#2d2d2f"
                },
                "yAxis": {
                    "title": {},
                    "labels": {}
                },
                "xAxis": {
                    "crosshair": {
                    "snap": true
                    },
                    "title": {
                    "text": "Last 24 hours",
                    "reserveSpace": true
                    },
                    "alignTicks": true,
                    "minorGridLineDashStyle": "Solid",
                    "gridLineDashStyle": "Solid",
                    "visible": true,
                    "labels": {}
                },
                "legend": {
                    "layout": "horizontal",
                    "enabled": false
                },
                "pane": {
                    "background": []
                },
                "responsive": {
                    "rules": []
                },
                "series": [{
                    data: [1,2,3] // sample data
                }],
                credits: {
                    enabled: false
                },
            },
            updateArgs: [true, true, {duration: 1000}]
        }
    },
    methods: {
        resize: async function() {
            await this.$nextTick()
            this.$children[0].chart.reflow()
        },
        resizeDebounced: debounce(function() { this.resize() }, 300)
    },
    mounted() {
        this.resize()
    },
    watch: {

    }
}
</script>

<style>
.chart {
    height: 100%;
    width: 100%;
}
</style>