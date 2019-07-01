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
                    backgroundColor: "#2d2d2f",
                },
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

<style>
.chart {
    height: 100%;
    width: 100%;
}
</style>