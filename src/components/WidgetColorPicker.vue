<template>
    <section>
        <div :id="uniqueId"></div>
        <resize-observer @notify="resizeDebounced" />
    </section>
</template>
<script>
import iro from '@jaames/iro';
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { setColor } from '../calls/hyperion'
import uuidv4 from 'uuid/v4'


export default {
    name: "widget-color-picker",
    data() {
        return {
            colorPicker: undefined,
            uniqueId: `color-picker-container-${uuidv4()}`
        }
    },
    mounted() {
        this.colorPicker = new iro.ColorPicker(`#${this.uniqueId}`, {
            // Set the initial color to pure red
            color: "#f00"
        });
        // only update every 500 ms to less spam the server
        this.colorPicker.on("color:change", throttle(this.colorChangeCallback, 500))

        // inital resize when widget is inserted
        this.colorPicker.on("mount", this.resize);
    },
    created() {
        let vm = this
        this.resizeDebounced = debounce(function() {
            vm.resize() 
        }, 300)
    },
    methods: {
        /** 
         * Function to resize color-picker
         */
        async resize() {
            await this.$nextTick()
            let colorPicker = this.colorPicker;

            if(colorPicker === undefined) {
                return
            }

            const sliderHeight = 40
            const height = this.$el.offsetHeight
            const width = this.$el.offsetWidth    

            const limitH = height - sliderHeight
            const limitW = width

            const diameter = Math.min(limitW, limitH)
            // Set new width with 10% padding
            this.colorPicker.resize(diameter - 0.1 * diameter)
        },
        /**
         * Function to change led-color
         */
        colorChangeCallback(color) {
            let rgb = color.rgb
            setColor(rgb.r, rgb.g, rgb.b)
        }
    }
}


</script>
<style scoped>
</style>