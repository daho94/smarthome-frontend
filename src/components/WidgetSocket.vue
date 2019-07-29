<template>
    <base-switch 
        :icon="loadSetting('icon')" 
        :state="state" 
        @onToggle="toggleEvent"
        mapTrue="ON"
        mapFalse="OFF"
    />
</template>

<script>
import BaseSwitch from "./BaseSwitch"
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import { setState } from '../calls/iobroker'

export default {
    name: "widget-socket",
    props: {
        settings: Object
    },
    mixins: [SubscriptionMixin, SettingsMergeMixin],
    components: {
        BaseSwitch,
    },
    data() {
        return {
            widgetSettings: {
                objId: {
                    val: "",
                    component: "form-input",
                    type: "text",
                    category: "settings"
                },
                icon: {
                    val: "stop",
                    component: "form-icon",
                    type: "text",
                    category: "settings"
                }   
            }
        }
    },
    computed: {
        state: function() {
            return this.updateValue(this.settings.objId)
        },  
    },
    methods: {
        async toggleEvent(newState) {
            setState(this.$socket, this.settings.objId.val, newState)   
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