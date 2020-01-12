<template>
    <base-chart :options="chartOptions" @onChartLoad="onChartLoad"></base-chart>
</template>
<script>
import BaseChart from './BaseChart'
import Highcharts from 'highcharts';
import solidGaugeInit from 'highcharts/modules/solid-gauge'
import highchartsMoreInit from 'highcharts/highcharts-more'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import SubscriptionMixin from '../mixins/subscription-mixin'

highchartsMoreInit(Highcharts)
solidGaugeInit(Highcharts)

const gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },
    title: null,
    pane: {
        center: ['50%', '50%'],
        size: '80%',
        // startAngle: -110,
        endAngle: 90,
        background: {
            // backgroundColor:
            //     Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    tooltip: {
        enabled: false
    },
    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },
    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
}


export default {
    name: "widget-color-picker",
    props: {
        settings: Object
    },
    mixins: [SubscriptionMixin, SettingsMergeMixin],
    components: {
        BaseChart,
    },
    data () {
        return {
            widgetSettings: {
                objId: {
                    val: "",
                    component: "form-input",
                    type: "text",
                    category: "settings"
                },
                max: {
                    val: 100,
                    component: "form-input",
                    type: "number",
                    category: "settings"  
                },
                min: {
                    val: 0,
                    component: "form-input",
                    type: "number",
                    category: "settings"  
                },
                unit: {
                    val: "",
                    component: "form-input",
                    tye: "text",
                    category: "settings"
                },
                startAngle: {
                    val: -90,
                    component: "form-input",
                    tye: "number",
                    category: "history"
                },
                zoom: {
                    val: 80,
                    component: "form-input",
                    tye: "number",
                    category: "history"
                }  
            },
            chartData: [],
            chart: undefined,
        }
    },
    computed: {
        chartCenter() {
            const chart = this.chart
            if (!chart) {
                return ["50%", "50%"]
            }
            const r = Math.min(chart.plotSizeX, chart.plotSizeY) / 2
            const chartHeight = chart.chartHeight
            const padding = (chartHeight - chart.plotSizeY) / 2
            const startAngle = Math.abs(+this.loadSetting("startAngle")) - 90
            // const zoomOffset = (100 - +this.loadSetting("zoom")) / 2

            let dy = Math.sin(startAngle * (Math.PI / 180)) * r
            console.log(dy)
            return ["50%", chartHeight / 2 + (r - dy) - padding]
        },
        chartOptions() {
            let vm = this
            return  Highcharts.merge(gaugeOptions, {
                pane: {
                    center: vm.chartCenter,
                    size: `${+vm.loadSetting('zoom')}%`,
                    startAngle: +vm.loadSetting('startAngle'),
                    // endAngle: 110,
                    // background: {
                    //     // backgroundColor:
                    //     //     Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                    //     innerRadius: '60%',
                    //     outerRadius: '100%',
                    //     shape: 'circle'
                    // }
                },
                yAxis: {
                    min: +vm.loadSetting("min"),
                    max: +vm.loadSetting("max"),
                    title: {
                        text: null
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Speed',
                    data: vm.chartData,
                    dataLabels: {
                        format:
                            '<div style="text-align:center">' +
                            '<span style="font-size:25px">{y}</span><br/>' +
                            `<span class="text-secondary" style="font-size:12px">${this.loadSetting('unit')}</span>` +
                            '</div>',
                        className: "gauge-datalabels",
                    },
                    tooltip: {
                        valueSuffix: ' km/h'
                    }
                }]
            })
        },
        state() {
            let state = this.updateValue(this.settings.objId)
            return state ? +parseFloat(state.val).toFixed(0) : 0
        },
    },
    watch: {
        state(newVal) {
            let chart = this.chart
            if (this.chartData.length == 0) {
                this.chartData.push(newVal)
            } else if (chart) {
                let point = chart.series[0].points[0];
                point.update(newVal)
            }
        }
    },
    methods: {
        // Store reference to chart
        onChartLoad(chart) {
            this.chart = chart
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
    }
}
</script>
<style lang="scss">
.gauge-datalabels {
    /* font-size: 8px; */
    span {
        @include themify($themes) {
            color: themed('textColor');
        }
    }
}
</style>