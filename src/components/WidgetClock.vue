<template>
    <section>
        <div id="clock">
            <template v-if="tick">
                <clock-analog v-if="loadSetting('isAnalog')" :minute="time.minutes" :tick="tick"></clock-analog>
                <clock-digital v-else :hours="time.hours" :minutes="time.minutes" :seconds="time.seconds"/>
            </template>
        </div>
    </section>
</template>
<script>
import ClockAnalog from './ClockAnalog'
import ClockDigital from './ClockDigital'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'

export default {
    name: "widget-clock",
    components: { ClockAnalog, ClockDigital },
    mixins: [SettingsMergeMixin],
    props: {
        settings: Object
    },
    data() {
        return {
            tick: 0,
            time: { hours: 0, minutes: 0, seconds: 0 },
            widgetSettings: {
                isAnalog: {
                    val: true,
                    component: "form-checkbox",
                    type: "checkbox",
                    category: "settings"
                },
            }
        }
    },
    methods: {
        updateTime(time) {
            this.tick++
            this.time = {
                hours: time.getHours(),
                minutes: time.getMinutes(),
                seconds: time.getSeconds()
            }

            setTimeout(() => this.updateTime(new Date()), 1000 - new Date().getMilliseconds())
        }
    },
    mounted() {
        this.updateTime(new Date())
    },
}
</script>
<style scoped>
#clock {
    width: 100%;
    height: 100%;
}
</style>