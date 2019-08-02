<template>
    <chart-pie
        :chartSeries="chartSeries"
        :activeTheme="activeTheme"
    />
</template>
<script>
import ChartPie from './ChartPie'
import SubscriptionMixin from '../mixins/subscription-mixin'

export default {
    name: "widget-pihole-ads-today",
    components: {
        ChartPie
    },
    mixins: [SubscriptionMixin],
    props: {
        activeTheme: String
    },
    data() {
        return {
            objId: "javascript.0.pi-hole.JSON"
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
            return [{
                name: "Queries",
                data: [
                    {
                        name: "Blocked",
                        y: data.ads_blocked_today
                    },
                    {
                        name: "Cached",
                        y: data.queries_cached
                    },
                    {
                        name: "Forwarded",
                        y: data.queries_forwarded
                    }
                ]
            }]
        }
    }
}

</script>