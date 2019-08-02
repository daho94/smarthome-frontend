<template>
  <section class="table-wrapper">
        <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
            <div>
                <b-table responsive small borderless :fields="fields" :items="items">
                    <!-- A virtual composite column -->
                    <template slot="frequency" slot-scope="data">
                        <div class="frequency-wrapper">
                            <div :style="{width: `${(data.item.hits * 100) / blockedAds}%` }"></div>
                        </div>
                    </template>
                </b-table>
            </div>
        </div>
  </section>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'
import forEach from 'lodash/forEach'

export default {
    name:"widget-pihole-top-blocked",
    mixins: [SubscriptionMixin],
    data() {
        return {
            fields: {
                // A regular column
                domain: {
                    label: "Domain",
                    class: "table-text-color"
                },
                // A regular column
                hits: {
                    label: "Hits",
                    class: "table-text-color",
                    sortable: true
                },
                // A virtual column made up from two informations
                frequenzy: { 
                    key: 'frequency', 
                    label: 'Frequency',
                    class: "table-text-color"     
                }           
            },
            objId: "javascript.0.pi-hole.JSON"
        }
    },
    computed: {
        state() {
            return this.updateValue({
                val: this.objId
            })
        },
        items() {
            if(this.state === undefined) {
                return []
            }
            return this.parseData(JSON.parse(this.state.val))
        },
        blockedAds() {
            if(this.state === undefined) {
                return []
            }
            return JSON.parse(this.state.val).ads_blocked_today
        }
    },
    methods: {
        parseData(data) {
            const topAds = data.top_ads
            let rows = []
            forEach(topAds, function(value, key) {
                rows.push({ domain: key, hits: value })
            })
            return rows
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
}
</script>
<style lang="scss">
.table-wrapper {
    padding: 10px;
    font-size: 1rem !important;
    align-items: unset !important;
    >div {
        width: 100%;
    }
}
.frequency-wrapper {
    width: 100%;
    background: $gray-light-hard;
    height: 10px;
    position: relative;
    top: 7px;

    >div {
        background: $danger-color;
        height: 100%;
    }
}
.table-text-color {
    @include themify($themes) {
        color: themed('textColor');  
    }
    text-align: left;
}
</style>