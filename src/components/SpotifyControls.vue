<template>
    <section class="controls-wrapper">
        <div class="trackInfo">
            <div class="trackImage">
                <img :src="albumImageUrl" height="80" width="80" alt=""/>
            </div>
            <div class="trackDescription">
                <div class="trackName">{{ trackName }}</div>
                <div class="artistName">{{ artistName }}</div>
            </div>
        </div>
        <div class="control-btn-grp">
            <div class="control-icon" @click="handlePrevious">
                <squid-icon icon="play-backward"/>
            </div>
            <div class="control-icon" @click="handlePlayPause">
                <squid-icon :icon="isPlaying ? 'pause' : 'play'"/>
            </div>
            <div class="control-icon" @click="handleSkip">
                <squid-icon icon="play-forward"/>
            </div>
        </div>
        <div class="device-control"  ref="button-3">
            <button ref="button-3">
                <squid-icon icon="speaker-2" />
            </button>
            <b-tooltip variant="dark" :target="() => $refs['button-3']" title="Devices" triggers="click">
                <div class="device-header">
                    <squid-icon icon="sound-system-2" />
                </div>
                <ul class="devices-list">
                    <li v-for="(device, i) in devices" v-bind:key="i" @click="changeDevice(device.id)" :active="device.id === activeDevice">
                        <div class="device-icon"><squid-icon icon="visual-graph"/></div>
                        <div>{{ device.name }}</div>
                    </li>
                </ul>
            </b-tooltip> 
        </div>
        <div class="progress-bar" >
            <div :style="{width: `${progressPercentage}%`}"></div>   
        </div>
    </section>
</template>
<script>
/** 
 * Iobroker states used: 
 *    spotify-premium.{Instance}.player.isPlaying
 *    spotify-premium.{Instance}.player.albumImageUrl
 *    spotify-premium.{Instance}.player.artistName
 *    spotify-premium.{Instance}.player.trackName
 *    spotify-premium.{Instance}.player.progressPercentage
 *    spotify-premium.{Instance}.devices.availableDeviceListIds
 *    spotify-premium.{Instance}.devices.availableDeviceListString
 *    spotify-premium.{Instance}.player.device.id
 */

import SubscriptionMixin from '../mixins/subscription-mixin'
import { setState } from '../calls/iobroker'
import zipWith from 'lodash/zipWith'


    export default {
        name: "spotify-controls",
        mixins: [SubscriptionMixin],
        props: {
            objId: String
        },
        data() {
            return {}
        },
        computed: {
            progressPercentage() {
                let state = this.updateValue({ val: `${this.objId}.player.progressPercentage` })

                if(state === undefined ||!state.val) return 0

                return state.val
            },
            isPlaying() {
                let isPlaying = this.updateValue({ val: `${this.objId}.player.isPlaying` })

                if(isPlaying === undefined ||!isPlaying.val) return false

                return isPlaying.val
            },
            albumImageUrl() {
                let state = this.updateValue({ val: `${this.objId}.player.albumImageUrl` })

                if(state === undefined ||!state.val) return "https://discordemoji.com/assets/emoji/residentsleeper.png"

                return state.val
            },
            artistName() {
                let state = this.updateValue({ val: `${this.objId}.player.artistName` })

                if(state === undefined ||!state.val) return "Resident"

                return state.val
            },
            trackName() {
                let state = this.updateValue({ val: `${this.objId}.player.trackName` })

                if(state === undefined ||!state.val) return "Sleeper"

                return state.val
            },
            devices() {
                let devIds = this.updateValue({ val: `${this.objId}.devices.availableDeviceListIds`})
                let devString = this.updateValue({ val: `${this.objId}.devices.availableDeviceListString`})

                // abort if data is missing  
                if (devIds == undefined || devString === undefined) return []
                if (!devIds.val || !devString.val) return [] 

                devIds = devIds.val.split(";")
                devString = devString.val.split(";")
                
                return zipWith(devIds, devString, function(id, name) {
                    return {
                        id,
                        name
                    }
                })
            },
            activeDevice() {
                let state = this.updateValue({ val: `${this.objId}.player.device.id` })

                if(state === undefined ||!state.val) return ""

                return state.val 
            }
        },
        methods: {
            handlePlayPause() {
                if(this.isPlaying === undefined) return

                if(this.isPlaying) {
                    this.$emit('onPause')
                    setState(this.$socket, `${this.objId}.player.pause`, true)
                } else {
                    this.$emit("onPlay")
                    setState(this.$socket, `${this.objId}.player.play`, true)
                }
            },
            handleSkip() {
                this.$emit("onSkip")
                setState(this.$socket, `${this.objId}.player.skipPlus`, true)
            },
            handlePrevious() {
                this.$emit("onPrev")
                setState(this.$socket, `${this.objId}.player.skipMinus`, true)
            },
            changeDevice(id) {
                setState(this.$socket, `${this.objId}.devices.deviceList`, id)
            }
        },
        mounted() {
            let vm = this;
            vm.$nextTick(function() {
                vm.subscribe(`${vm.objId}.player.isPlaying`)
                vm.subscribe(`${vm.objId}.player.albumImageUrl`)
                vm.subscribe(`${vm.objId}.player.artistName`)
                vm.subscribe(`${vm.objId}.player.trackName`)
                vm.subscribe(`${vm.objId}.player.progressPercentage`)

                vm.subscribe(`${vm.objId}.devices.availableDeviceListString`)
                vm.subscribe(`${vm.objId}.devices.availableDeviceListIds`)
                vm.subscribe(`${vm.objId}.player.device.id`)

                vm.$watch('objId', function(newVal, oldVal) {
                    vm.unsubscribe(`${oldVal}.player.isPlaying`)
                    vm.unsubscribe(`${oldVal}.player.albumImageUrl`)
                    vm.unsubscribe(`${oldVal}.player.artistName`)
                    vm.unsubscribe(`${oldVal}.player.trackName`)
                    vm.unsubscribe(`${oldVal}.player.progressPercentage`)

                    vm.unsubscribe(`${oldVal}.devices.availableDeviceListString`)
                    vm.unsubscribe(`${oldVal}.devices.availableDeviceListIds`)
                    vm.unsubscribe(`${oldVal}.player.device.id`)

                    vm.subscribe(`${newVal}.player.isPlaying`)
                    vm.subscribe(`${newVal}.player.albumImageUrl`)
                    vm.subscribe(`${newVal}.player.artistName`)
                    vm.subscribe(`${newVal}.player.trackName`)
                    vm.subscribe(`${newVal}.player.progressPercentage`)

                    vm.subscribe(`${newVal}.devices.availableDeviceListString`)
                    vm.subscribe(`${newVal}.devices.availableDeviceListIds`)
                    vm.subscribe(`${newVal}.player.device.id`)
                })
            })
        },
        destroyed() {
            let vm = this;
            vm.unsubscribe(`${vm.objId}.player.isPlaying`)
            vm.unsubscribe(`${vm.objId}.player.albumImageUrl`)
            vm.unsubscribe(`${vm.objId}.player.artistName`)
            vm.unsubscribe(`${vm.objId}.player.trackName`)
            vm.unsubscribe(`${vm.objId}.player.progressPercentage`)

            vm.unsubscribe(`${vm.objId}.devices.availableDeviceListString`)
            vm.unsubscribe(`${vm.objId}.devices.availableDeviceListIds`)
            vm.unsubscribe(`${vm.objId}.player.device.id`)
        }
    }
</script>
<style lang="scss">
.device-control {
    stroke: $light-color;
    position: absolute;
    display: flex;
    align-items: center;
    left: calc(100% - 50px);
    >button {
        height: 40px;
        display: flex;
        background: none;
        border: none;
        outline: none;
    }
}
.device-header {
    stroke: $light-color;
    display: flex;
    height: 80px;
    justify-content: center;
}
.device-icon {
    padding: 5px;
    height: 40px;
}
.devices-list {
    margin: 0px;
    padding: 2px;

    >li {
        list-style: none;
        cursor: pointer;
        margin: 10px;
        display: flex;
        align-items: center;
        stroke: $light-color;
        &[active] {
            color: $spotify-color;
            stroke: $spotify-color !important;
        }
    }
    >li:hover {
        background: #2b2828;
    }
}
.controls-wrapper {
    height: 100%;
    display: flex;
    flex-flow: row nowrap !important;
    align-items: center;
    font-size: 1em !important;
    padding: 0px !important;
    background: #0f0f0f;
    @include themify($themes) {
        border-bottom-right-radius: themed('widgetBorderRadius');
        border-bottom-left-radius: themed('widgetBorderRadius');
    }
}
.control-icon {
    stroke: $light-color;
    height: 40px;
    margin: 4px;
    display: flex;
    cursor: pointer;
}
.control-icon:hover {
    stroke:$spotify-color;
}
.control-btn-grp {
    display: flex;
    flex-flow: row nowrap;
    position: absolute;
    left: calc(50% - 75px);
}
.trackInfo {
    display: flex;
    flex-flow: row nowrap;
    align-content: center;
    align-items: center;
    // margin-left: 10px;
    max-width: calc(50% - 85px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.trackDescription {
    font-size: 1rem;
    text-align: left;
    margin: 10px;
    line-height: 1.3;
}
.artistName {
    color: $secondary-color;
}
.trackName {
    color: $light-color;
}
.trackImage {
    display: flex;
    align-items: center;
    >img {
        @include themify($themes) {
            border-bottom-left-radius: themed('widgetBorderRadius');
        }
    }
}
.progress-bar {
    position: absolute;
    height: 2px;
    width: calc(100% - 80px);
    left: 80px;
    top: calc(100% - 80px);

    >div {
        height: 2px;
        background-color: $spotify-color;
    }
}
</style>