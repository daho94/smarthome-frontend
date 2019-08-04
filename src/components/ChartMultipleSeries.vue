<template>
    <base-chart class="chart-wrapper" :options="chartOptions"></base-chart>
</template>

<script>
import BaseChart from './BaseChart'

export default {
    name: 'chart-multiple-series',
    components: {
        BaseChart,
    },
    props: ["chartSeries", "activeTheme"],
    data () {
        return {
        }
    },
    computed: {
        chartOptions: function() {
            return {                   
                subtitle: {
                    text: "",
                    align: "left",
                    floating: false,
                    useHTML: false,
                    tyle: {
                    color: "#ffebee"
                    }
                },
                chart: {
                    type: "areaspline",
                    zoomType: "x",
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    style: { color: this.activeTheme === "dark" ? "white" : "black" },
                    headerFormat:
                        '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
                        '<b>{point.point.symbolDesc}</b><br>'
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {},
                    gridLineWidth: 0,
                },
                xAxis: {
                    title: {
                        text: "",
                    },
                    alignTicks: true,
                    minorGridLineDashStyle: "Solid",
                    gridLineDashStyle: "Solid",
                    visible: true,
                    labels: {},
                    type: 'datetime',
                    tickPixelInterval: 150,
                },
                legend: {
                    layout: "horizontal",
                    enabled: false
                },
                time: {
                    getTimezoneOffset: function() { return new Date().getTimezoneOffset() }
                },
                plotOptions: {
                    series: {
                        // color: this.plotColor,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: this.chartSeries,
            }
        }
    },
    methods: {

    },
    mounted() {
    }
}
</script>

<style scoped>
.chart-wrapper {
    padding: 5px;
}
</style>