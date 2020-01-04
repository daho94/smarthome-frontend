<template>
    <section>
        <div :id="`color-picker-container-${uniqueId}`"></div>
        <resize-observer @notify="resizeDebounced" />
        <svg style="display:none;">
            <defs>
                <g :id="`handle-${uniqueId}`" stroke-width="2" stroke="#000000">
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
import {setState } from '../calls/iobroker'
import uuidv4 from 'uuid/v4'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import SubscriptionMixin from '../mixins/subscription-mixin'

export default {
    name: "widget-color-picker",
    props: {
        settings: Object
    },
    mixins: [SubscriptionMixin, SettingsMergeMixin],
    data() {
        return {
            colorPicker: undefined,
            uniqueId: `${uuidv4()}`,
            color: "red",
            widgetSettings: {
                objId: {
                    val: "",
                    component: "form-input",
                    type: "text",
                    category: "settings"
                }, 
                isSynced: {
                    val: false,
                    component: "form-checkbox",
                    type: "checkbox",
                    category: "settings"
                },
            }
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
        vm.colorPicker = new iro.ColorPicker(`#color-picker-container-${vm.uniqueId}`, {
            // Set the initial color to pure red
            color: "#f00",
            borderWidth: 1,
            handleSvg: `#handle-${vm.uniqueId}`,
            handleOrigin: {x: -14.25, y: -40}
        });
        // only update every 500 ms to less spam the server
        vm.colorPicker.on("color:change", throttle(vm.colorChangeCallback, 500))

        vm.colorPicker.on("input:start", vm.handleInput)
        vm.colorPicker.on("input:move", vm.handleInput)
        vm.colorPicker.on("input:end", vm.handleInput)


        // inital resize when widget is inserted
        vm.colorPicker.on("mount", debounce(vm.resize), 100);
    },
    created() {
        let vm = this
        this.resizeDebounced = debounce(function() {
            vm.resize() 
        }, 300)
    },
    destroyed() {
        this.unsubscribe(this.settings.objId.val)
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
            if (this.settings.isSynced.val) {
                setState(this.$socket, "0_userdata.0.lights.globalColor", JSON.stringify(rgb))
            } else {
                setState(this.$socket, this.settings.objId.val, JSON.stringify(rgb))
            }
        }
    }
}


</script>
<style   lang="scss">
</style>