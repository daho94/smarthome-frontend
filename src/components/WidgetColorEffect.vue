<template>
    <section class="effect-container" @click="setEffect">
        <div class="effect-image-wrapper">
            <div :style="{'background-image': `url(${loadSetting('image')})`}" class="clipboard"></div>
        </div>
        <div class="effect-text">
            {{ loadSetting('effect') }}
        </div>
    </section>
</template>
<script>
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import { setEffect, getEffects } from '../calls/hyperion'

const EFFECTS = {
    "effects": [
        "Cinema brighten lights",
        "Cinema dim lights",
        "Knight rider",
        "Blue mood blobs",
        "Cold mood blobs",
        "Full color mood blobs",
        "Green mood blobs",
        "Red mood blobs",
        "Warm mood blobs",
        "Police Lights Single",
        "Police Lights Solid",
        "Rainbow mood",
        "Rainbow swirl fast",
        "Rainbow swirl",
        "Random",
        "Running dots",
        "System Shutdown",
        "Snake",
        "Sparks Color",
        "Sparks",
        "Strobe blue",
        "Strobe Raspbmc",
        "Strobe white",
        "Color traces",
        "UDP multicast listener",
        "UDP listener",
        "X-Mas"
    ]
}


export default {
    name: "widget-color-effect",
    props: ["settings"],
    mixins: [SettingsMergeMixin],
    data() {
        return {
            widgetSettings: {
                effect: {
                    val: undefined,
                    component: "form-select",
                    type: "select",
                    category: "settings",
                    options: []
                },
                image: {
                    val: "/img/forest.jpg",
                    component: "form-img",
                    type: "text",
                    category: "settings"
                }
            }, 
        }
    },
    created() {
        this.getEffects()
    },
    methods: {
        async getEffects() {
            if (this.settings.effect && this.settings.effect.options.length > 0) {
                return
            }

            let effects = undefined

            let res = await getEffects()
            if (res.effects.length === 0) {
                // Fallback if hyperion server is unavailable
                effects = EFFECTS
            } else {
                effects = res.effects
            }

            const effectOptions = effects.map(e => {
                return { value: e, text: e }
            })

            this.settings.effect.options = effectOptions
        },
        setEffect() {
            const effect = this.settings.effect.val
            if(effect) {
                setEffect(effect)
            }
        }
    }
}


</script>
<style lang="scss" scoped>
.effect-container {
    display: flex;
    flex-flow: row nowrap;
    cursor: pointer;
}
.effect-container:hover {
    opacity: 0.9;
}
.effect-image-wrapper {
    width: 45%;
    height: 100%;
    padding: 20px;
    img { 
        width: 50%;
        height: 50%;
    }
}
.clipboard {
    clip-path: inset(0% 0% 0% 0% round 5%);
    background-size: cover;
    background-position: center center;
    height: 100%;
    position: relative;
}

.effect-text {
    width: 55%;
    color: $secondary-color !important;
    font-size: 1.5rem;
    text-align: left;
    line-height: 1.0;
    margin-right: 20px;
}
</style>