<template>
    <base-chart :options="chartOptions"></base-chart>
</template>

<script>
import { getLastHour, getLast24Hours } from '../calls/iobroker'
import BaseChart from './BaseChart'

export default {
    name: 'chart-history',
    components: {
        BaseChart,
    },
    props: ["objId", "objState", "timeSpan", "plotColor", "activeTheme"],
    data () {
        return {
            chartData: [],
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
                    zoomType: "x"
                },
                 tooltip: {
                    style: { color: this.activeTheme === "dark" ? "white" : "black" },
                    formatter: function () {
                        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y.toFixed(2)}</b>`
                    }
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
                        text: `Last ${this.timeSpan} hour(s)`,
                        reserveSpace: true
                    },
                    alignTicks: true,
                    minorGridLineDashStyle: "Solid",
                    gridLineDashStyle: "Solid",
                    visible: true,
                    labels: {},
                    type: 'datetime',
                    tickPixelInterval: 150
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
                        color: this.plotColor,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    data: this.chartData,
                }],
            }
        }
    },
    methods: {
        getData: async function(objId) {
            let data = this.timeSpan === 1 ? await getLastHour(objId) : await getLast24Hours(objId)
            try {
                this.chartData = data.map(point => [point.timestamp, point.val])
            } catch (error) {
                // do not update data
            }
        }
    },
    mounted() {
        this.getData(this.objId)
    },
    watch: {
        objId: function() {
            if (!this.objId) {
                this.chartData = []
                return
            }

            this.getData(this.objId)
        },
        objState: function() {
            if (!this.objState) {
                this.chartData = []
                return
            }
            this.chartData.push([this.objState.ts, this.objState.val])

        },
        // pull data for new timespan
        timeSpan: function() {
            this.getData(this.objId)
        },
    },
}
</script>

<style>

</style>