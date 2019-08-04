<template>
    <section class="wrapper">
        <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
            <div>
                <div class="content-wrapper">
                    <div class="item">
                        <div class="title">
                            <img style="margin-right: 5px; margin-left: 5px" height="40px" src="/icons/phv.svg" />
                            Domains being blocked
                        </div>
                        <div class="value">
                            {{ data.domains_being_blocked }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="progress-bar-1" style="stroke: #17a2b8"/>
                            DNS queries today
                        </div>
                        <div class="value">
                            {{ data.ads_blocked_today }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="currency-2" style="stroke: #28a745"/>
                            Ads blocked today
                        </div>
                        <div class="value">
                            {{ data.ads_blocked_today }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="currency-2" style="stroke: #28a745"/>
                            Ads percentage today
                        </div>
                        <div class="value">
                            {{ data.ads_percentage_today ? data.ads_percentage_today.toFixed(2) : '' }}%
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="network-tred" style="stroke: #17a2b8"/>
                            Unique domains
                        </div>
                        <div class="value">
                            {{ data.unique_domains }}
                    </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="progress-bar-1" style="stroke: #17a2b8"/>
                            Queries forwarded
                        </div>
                        <div class="value">
                            {{ data.queries_forwarded }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="storager" style="stroke: #6c757d"/>
                            Queries cached
                        </div>
                        <div class="value">
                            {{ data.queries_cached }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="wifi-mob" style="stroke: #a91669"/>
                            Clients ever seen
                        </div>
                        <div class="value">
                            {{ data.clients_ever_seen }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="wifi-mob" style="stroke: #a91669"/>
                            Unique clients
                        </div>
                        <div class="value">
                            {{ data.unique_clients }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <squid-icon icon="plug" style="stroke: #ea7807"/>
                            Status
                        </div>
                        <div class="value">
                            {{ data.status }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import SubscriptionMixin from '../mixins/subscription-mixin'

export default {
    name:"widget-pihole-summary",
    mixins: [SubscriptionMixin],
    data() {
        return {
            objId: "javascript.0.pi-hole.JSON"
        }
    },
    computed: {
        state() {
            return this.updateValue({
                val: this.objId
            })
        },
        data() {
            if (this.state === undefined) {
                return {}
            }

            return JSON.parse(this.state.val)
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
<style lang="scss" scoped>
.wrapper {
    padding: 10px;
    font-size: 1rem !important;
    align-items: unset !important;
    >div {
        width: 100%;
    }
}
.content-wrapper {
    flex-flow: row wrap;
    justify-content: center;
    display: flex;
}
.item {
    width: 50%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dacece47;
    height: 50px;
    margin: 10px;
    min-width: 330px;
    max-width: calc(50% - 20px);
}
.title {
    text-align: left;
    width: 70%;
    svg {
        width: 35px;
        margin-right: 5px;
        stroke-width: 2px;
    }
}
.value {
    text-align: right;
    width: 30%;
}
</style>