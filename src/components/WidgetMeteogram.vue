<template>
<chart-meteogram :data="data"></chart-meteogram>
</template>
<script>
import ChartMeteogram from './ChartMeteogram'
import { getStates } from '../calls/iobroker'

export default {
    name: "widget-meteogram",
    components: {
        ChartMeteogram
    },
    data() {
        return {
            data: []
        }
    },
    methods: {
        /**
         * Get data from websocket
         */
        async getData(pattern) {
            const states = await getStates(this.$socket, pattern)
            return states
        },
    },
    async mounted() {
        const states = await this.getData("daswetter.0.NextHours.Location_1.Day_1.Hour_*.(temp_value|symbol_desc|pressure_value|rain_value|iconURL|wind_value|wind_dir)")
        try {
            this.data = states
        } catch (_e) {
            // do nothing
        }
    }
}

</script>
<style>

</style>