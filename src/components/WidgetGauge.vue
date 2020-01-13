<template>
    <base-chart :options="chartOptions" @onChartLoad="onChartLoad" @onResize="resize"></base-chart>
</template>
<script>
import BaseChart from './BaseChart'
import Highcharts from 'highcharts';
import solidGaugeInit from 'highcharts/modules/solid-gauge'
import highchartsMoreInit from 'highcharts/highcharts-more'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import SubscriptionMixin from '../mixins/subscription-mixin'
import { abbreviateNumber } from '../utils/format'

highchartsMoreInit(Highcharts)
solidGaugeInit(Highcharts)

const gaugeOptions = {
    chart: {
        type: 'solidgauge'
    },
    title: null,
    pane: {
        background: {
            shape: 'arc',
            backgroundColor: "#2a2a2e"
        }
    },
    tooltip: {
        enabled: false
    },
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
        title: null,
        labels: {
            y: 30,
            distance: "75%",
            style: {
                fontSize: "16px"
            },
            formatter: function () {
                return `
                    <div style="text-align:center">
                        <span style="font-size:25px">${abbreviateNumber(this.value)}</span><br/>
                    </div>`
            }          
        }
    },
    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: -45,
                borderWidth: 0,
                useHTML: true,
            }
        }
    },
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
                    type: "text",
                    category: "settings"
                },
                startAngle: {
                    val: -110,
                    component: "form-input",
                    type: "range",
                    min: -180,
                    max: 0,
                    category: "history"
                },
                endAngle: {
                    val: 110,
                    component: "form-input",
                    type: "range",
                    min: 0,
                    max: 180,
                    category: "history"
                },
                zoom: {
                    val: 110,
                    component: "form-input",
                    type: "range",
                    min: 0,
                    max: 200,
                    category: "history"
                },
                yOffset: {
                    val: 65,
                    component: "form-input",
                    type: "range",
                    min: 0,
                    max: 100,
                    category: "history"
                },
                outerRadius: {
                    val: 100,
                    component: "form-input",
                    type: "range",
                    min: 0,
                    max: 100,
                    category: "history"
                },
                innerRadius: {
                    val: 75,
                    component: "form-input",
                    type: "range",
                    min: 0,
                    max: 100,
                    category: "history"
                }  
            },
            chartData: [],
            chart: undefined,
            canZoom: false
        }
    },
    computed: {
        // zoom: {
        //     get() {
        //         return +this.loadSetting('zoom')
        //     },
        //     set(newValue) {

        //     }
        // },
        chartOptions() {
            let vm = this
            return  Highcharts.merge(gaugeOptions, {
                pane: {
                    center: ["50%", `${vm.loadSetting('yOffset')}%`],
                    size: `${vm.canZoom? 100 : +vm.loadSetting('zoom')}%`,
                    startAngle: +vm.loadSetting('startAngle'),
                    endAngle: +vm.loadSetting('endAngle'),
                    background: {
                        innerRadius: `${+vm.loadSetting('innerRadius')}%`,
                        outerRadius: `${+vm.loadSetting('outerRadius')}%`,
                    }
                },
                yAxis: {
                    min: +vm.loadSetting("min"),
                    max: +vm.loadSetting("max"),
                },
                plotOptions: {
                    solidgauge: {
                        innerRadius: `${+vm.loadSetting('innerRadius')}%`,
                    }
                },
                series: [{
                    name: undefined,
                    data: vm.chartData,
                    dataLabels: {
                        formatter: function () {
                            return `
                                <div style="text-align:center">
                                    <span style="font-size:2.5rem">${abbreviateNumber(this.y)}</span><br/>
                                    <span class="text-secondary" style="font-size:12px">${vm.loadSetting('unit')}</span>
                                </div>`
                        },
                        className: "gauge-datalabels",
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
        },
    },
    methods: {
        // Store reference to chart
        onChartLoad(chart) {
            this.chart = chart
        },
        // Set zoom to 100% if chart width < chart height to prevent chart from overflowing
        resize(chart) {
            if (this.loadSetting('zoom') > 100 && chart.chartWidth - 5 < chart.chartHeight) {
                this.canZoom = true
            } else {
                this.canZoom = false
            }
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
    span {
        @include themify($themes) {
            color: themed('textColor');
        }
    }
}
</style>