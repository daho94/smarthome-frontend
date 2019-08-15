<template>
    <chart-multiple-series 
        :chartSeries="chartSeries"
        :activeTheme="activeTheme"
    />
</template>
<script>
import ChartMultipleSeries from './ChartMultipleSeries'
import forEach from 'lodash/forEach'
import SubscriptionMixin from '../mixins/subscription-mixin'

export default {
    name: "widget-pihole-query-history",
    components: {
        ChartMultipleSeries
    },
    mixins: [SubscriptionMixin],
    props: {
        activeTheme: String
    },
    data() {
        return {
            objId: "javascript.0.pi-hole.JSON_OverTimeData"
        }
    },
    mounted() {
        let vm = this;
        vm.$nextTick(function() {
            vm.subscribe(vm.objId)
        })
    },
    destroyed() {
        this.unsubscribe(this.objId)
    },
    computed: {
        state() {
            return this.updateValue({
                val: this.objId
            })
        },
        chartSeries() {
            if(this.state === undefined) {
                return []
            }
            return this.parseData(JSON.parse(this.state.val))
        }
    },
    methods: {
        parseData(data) {
            let series = [
                {
                    name: "Ads",
                    data: this.toTimeDataset(data.ads_over_time)
                },
                {
                    name: "Domains",
                    data: this.toTimeDataset(data.domains_over_time)
                }
            ];

            return series
        },
        toTimeDataset(data) {
            let dataset = []

            forEach(data, function(value, ts) {
                let unix = parseInt(ts) * 1000
                dataset.push({x: unix, to: unix + 10 * 60 * 1000, y: value})
            })

            return dataset
        }
    }
}

</script>