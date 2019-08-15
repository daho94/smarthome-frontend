<template>
    <section style="height: 100%">
        <highcharts class="chart" :options="mergedOptions" :updateArgs="updateArgs" :callback="emitLoaded"></highcharts>
        <resize-observer @notify="resizeDebounced" />
    </section>
</template>

<script>
import { Chart } from 'highcharts-vue'
import debounce from 'lodash/debounce'
import merge from 'lodash/merge'

export default {
    name: 'base-chart',
    components: {
        highcharts: Chart,
    },
    props: ["options"],
    data () {
        return {
            updateArgs: [true, true, {duration: 1000}],
            defaultOptions: {
                chart: {
                },
                colors: ["#19A2A5", "#154775", "#02BFFE", "#4E8BB8", "#00643F", "#9ECAE3"],
                credits: {
                    enabled: false
                },
                title: {
                    text: ""
                },
                xAxis: {
                    labels: {
                        style: {
                            color: "#f8f9fa"
                        }
                    }
                },
                yAxis: {
                    labels: {
                        style: {
                            color: "#f8f9fa"
                        }
                    }
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.1
                    }
                }
            }
        }
    },
    methods: {
        /** 
         * Function to resize chart content. Also emits resize event.
         */
        async resize() {
            await this.$nextTick()
            let chart = this.$children[0].chart
            if (chart.series === undefined || chart.series.length === 0) {
                return
            }

            chart.reflow()
            this.$emit("onResize", chart) // Sometimes you need to manually resize stuff

        },
        /**
         * Emits an event back to its parent component. Used to post-process data in 
         * parent component after the chart is loaded. 
         */
        emitLoaded(chart) {
            this.$emit("onChartLoad", chart)
        }
    },
    computed: {
        mergedOptions() {
            return merge(this.options, this.defaultOptions)
        }
    },
    mounted() {
        this.resize()
    },
    created() {
        let vm = this
        this.resizeDebounced = debounce(function() {
            vm.resize() 
        }, 300)
    },
}
</script>

<style lang="scss">
.chart {
    height: 100%;
    width: 100%;
    @include themify($themes) {
        border-bottom-left-radius: themed('widgetBorderRadius');  
        border-bottom-right-radius: themed('widgetBorderRadius')
    }
}
.highcharts-tooltip-box {
    @include themify($themes) {
        fill: themed('backgroundColor')
    }
	fill-opacity: 0.6;
	stroke-width: 0;
}
</style>