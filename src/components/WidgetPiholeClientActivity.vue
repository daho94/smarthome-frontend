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
    name: "widget-pihole-client-activity",
    components: {
        ChartMultipleSeries
    },
    mixins: [SubscriptionMixin],
    props: {
        activeTheme: String
    },
    data() {
        return {
            objId: "javascript.0.pi-hole.JSON_ClientsData"
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
            let series = data.clients.map(c => {
                return {
                    name: c.ip,
                    data: []
                }
            })

            forEach(data.over_time, function(value, ts) {
                for(let i in series) {
                    let unix = parseInt(ts) * 1000
                    series[i].data.push({x: unix, to: unix + 10 * 60 * 1000, y: value[i]})
                }
            })

            return series
        }
    }
}

</script>