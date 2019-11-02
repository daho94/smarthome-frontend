<template>
     <base-chart class="chart-wrapper" :options="chartOptions"></base-chart>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import BaseChart from './BaseChart'
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more'

More(Highcharts)

export default {
    name:"widget-printer",
    mixins: [SubscriptionMixin, SettingsMergeMixin],
    components: {
        BaseChart,
    },
    props: ["settings", "activeTheme"],
    data() {
        let widgetSettings = {
            objId: {
            val: "javascript.0.printer.JSON",
            component: "form-input",
            type: "text",
            category: "settings"
            }   
        }

        return { 
            widgetSettings 
        }
    },
    computed: {
        state: function() {
            return this.updateValue(this.settings.objId)
        },
        chartSeries() {
            if(this.state === undefined) {
                return []
            }
            return this.parseData(JSON.parse(this.state.val))
        },
        chartOptions: function() {
            return {                   
                subtitle: {
                    text: "",
                },
                chart: {
                    type: "column",
                    inverted: false,
                    polar: true,
                },
                tooltip: {
                    shared: true,
                    style: { color: this.activeTheme === "dark" ? "white" : "black" },
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span >{point.name}</span>: <b>{point.y:.1f} %</b>'
                },
                yAxis: {
                    title: {
                        text: ""
                    },
                    labels: {},
                    max: 100,
                },
                xAxis: {
                    title: {},
                    labels: {},
                    type: "category"
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f} %',
                            style: {
                                color: this.activeTheme === "dark" ? "#f8f9fa" : "#212529",
                            },
                            connectorColor: 'silver'
                        }
                    },
                    column: {

                    }
                },
                series: this.chartSeries,
            }
        }
    },
    methods: {
        parseData(data) {          
            return [{
                name: "Printer tones",
                turboThreshold: 0,
                data: [
                    {
                        name: "Magenta",
                        y: data.magenta,
                        color: "magenta"
                    },
                    {
                        name: "Cyan",
                        y: data.cyan,
                        color: "cyan"
                    },
                    {
                        name: "Black",
                        y: data.black,
                        color: "black"
                    },
                    {
                        name: "Yellow",
                        y: data.yellow,
                        color: "yellow"
                    }
                ]
            }]
        }
    },
    mounted() {
        let vm = this;
        vm.$nextTick(function() {
            vm.subscribe(vm.settings.objId.val)

            vm.$watch('settings.objId.val', function(newVal, oldVal) {
                vm.unsubscribe(oldVal)
                vm.subscribe(newVal)
            })
        })
    },
    destroyed() {
        this.unsubscribe(this.settings.objId.val)
    },
}
</script>

<style>

</style>