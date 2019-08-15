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
                    type: "pie",
                },
                tooltip: {
                    shared: true,
                    style: { color: this.activeTheme === "dark" ? "white" : "black" },
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>'
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
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: this.activeTheme === "dark" ? "#f8f9fa" : "#212529",
                                "text-decoration": "underline"
                            },
                            connectorColor: 'silver'
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

<style lang="scss" scoped>
.chart-wrapper {
    padding: 5px;
}
</style>