<template>
    <section>
        <div :id="uniqueId"></div>
        <resize-observer @notify="resizeDebounced" />
        <svg style="display:none;">
            <defs>
                <g id="handle" stroke-width="2" stroke="#000000">
                    <path 
                        fill="none"
                        stroke="#ffffff"
                        stroke-width="3"
                        d="M 14.268605,40.14057 C 24.081187,31.599 28.272551,23.456437 28.272551,14.760056 c 0,-7.7341663 -6.269776,-14.00394762 -14.003946,-14.00394762 -7.7341657,0 -14.00394709,6.26978132 -14.00394709,14.00394762 0,8.696381 4.19136879,16.838944 14.00394709,25.380514 z"
                    ></path>
                    <path 
                        :fill="color"
                        stroke="#000000"
                        stroke-width="1"
                        d="M 14.268605,40.14057 C 24.081187,31.599 28.272551,23.456437 28.272551,14.760056 c 0,-7.7341663 -6.269776,-14.00394762 -14.003946,-14.00394762 -7.7341657,0 -14.00394709,6.26978132 -14.00394709,14.00394762 0,8.696381 4.19136879,16.838944 14.00394709,25.380514 z"
                    ></path>
                </g>
            </defs>
        </svg>
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
            uniqueId: `color-picker-container-${uuidv4()}`,
            color: "red"
        }
    },
    mounted() {
        this.colorPicker = new iro.ColorPicker(`#${this.uniqueId}`, {
            // Set the initial color to pure red
            color: "#f00",
            borderWidth: 1,
            handleSvg: '#handle',
            handleOrigin: {x: -14.25, y: -40}
        });
        // only update every 500 ms to less spam the server
        this.colorPicker.on("color:change", throttle(this.colorChangeCallback, 500))

        this.colorPicker.on("input:start", this.handleInput)
        this.colorPicker.on("input:move", this.handleInput)
        this.colorPicker.on("input:end", this.handleInput)


        // inital resize when widget is inserted
        this.colorPicker.on("mount", debounce(this.resize), 100);
    },
    created() {
        let vm = this
        this.resizeDebounced = debounce(function() {
            vm.resize() 
        }, 300)
    },
    methods: {
        handleInput(color) {
            this.color = color.hexString
        },
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
<style   lang="scss">
</style>