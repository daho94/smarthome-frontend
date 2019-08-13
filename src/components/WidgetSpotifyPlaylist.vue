<template>
    <section class="wrapper">
        <div class="clipboard" 
            :style="{'background-image': `url(${albumUrl})`}"         
            @mouseover="hover = true"
            @mouseleave="hover = false"
        >
            <div class="overlay" :class="{'overlay-hidden': !hover}">
                <div class="playlist-name">{{ playlistName }}</div>
                <div class="play-icon" @click="startPlaylist">
                    <squid-icon icon="play" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import SubscriptionMixin from '../mixins/subscription-mixin'
import zipWith from 'lodash/zipWith'
import { setState } from '../calls/iobroker'

export default {
    name: "widget-spotify-playlist",
    props: ["settings"],
    mixins: [SettingsMergeMixin, SubscriptionMixin],
    data() {
        return {
            hover: false,
            widgetSettings: {
                playlist: {
                    val: undefined,
                    component: "form-select",
                    type: "select",
                    category: "settings",
                    options: []
                },
                adapterInstance: {
                    val: 0,
                    component: "form-select",
                    type: "select",
                    category: "settings",
                    options: [
                        { value: 0, text: "0" },
                        { value: 1, text: "1" },
                        { value: 2, text: "2" },
                        { value: 3, text: "3" },
                        { value: 4, text: "4" }
                    ]
                },
            }, 
        }
    },
    watch: {
        playlists() {
            const options = this.playlists.map(playlist => {
                return { value: playlist, text: playlist.name}
            })

            this.settings.playlist.options = options
        },
    },
    computed: {
        objId() {
            return `spotify-premium.${this.loadSetting('adapterInstance')}`
        },
        albumUrl() {
            let selectedPl = this.loadSetting('playlist')
            if(selectedPl === undefined) return ""
            let pl = this.updateValue({ val: `${this.objId}.playlists.${selectedPl.path}.imageUrl`})
            if(pl === undefined) return ""
            return pl.val
        },
        playlistName() {
            let selectedPl = this.loadSetting('playlist')
            if(selectedPl === undefined) return ""
            return selectedPl.name
        },
        playlistPath() {
            let selectedPl = this.loadSetting('playlist')
            if(selectedPl === undefined) return ""
            return selectedPl.path
        },
        playlists() {
            let plIds = this.updateValue({ val: `${this.objId}.playlists.playlistListIds`})
            let plString = this.updateValue({ val: `${this.objId}.playlists.playlistListString`})

            // abort if data is missing  
            if (plIds == undefined || plString === undefined) return []
            if (!plIds.val || !plString.val) return [] 

            plIds = plIds.val.split(";").map(pl => { 
                const splitted = pl.split("-")
                return {
                    owner: splitted[0],
                    id: splitted[1],
                    path: pl,
                } 
            })
            plString = plString.val.split(";")
            
            return zipWith(plIds, plString, function(meta, name) {
                return {
                    owner: meta.owner,
                    id: meta.id,
                    path: meta.path,
                    name
                }
            })
        },
        isPlaying() {
            let isPlaying = this.updateValue({ val: `${this.objId}.player.isPlaying` })

            if(isPlaying === undefined ||!isPlaying.val) return false

            return isPlaying.val
        }
    },
    methods: {
        startPlaylist() {
            let vm = this
            const playlist = vm.loadSetting("playlist")
            if(playlist === undefined) return
            if(!vm.isPlaying) {
                setState(vm.$socket, `${vm.objId}.player.play`, true).then(() => {
                    setState(vm.$socket, `${vm.objId}.playlists.${playlist.path}.playThisList`, true)
                })
            }
            setState(vm.$socket, `${vm.objId}.playlists.${playlist.path}.playThisList`, true)
        }
    },
    mounted() {
        let vm = this;
        vm.subscribe(`${vm.objId}.playlists.playlistListIds`)
        vm.subscribe(`${vm.objId}.playlists.playlistListString`)
        vm.subscribe(`${vm.objId}.player.isPlaying`)

        vm.$watch('objId', function(newVal, oldVal) {
            vm.unsubscribe(`${oldVal}.playlists.playlistListIds`)
            vm.unsubscribe(`${oldVal}.playlists.playlistListString`)
            vm.unsubscribe(`${oldVal}.player.isPlaying`)

            vm.subscribe(`${newVal}.playlists.playlistListIds`)
            vm.subscribe(`${newVal}.playlists.playlistListString`)
            vm.subscribe(`${newVal}.player.isPlaying`)
        })
        
        vm.$watch('settings.playlist.val', function(newVal, oldVal) {
            if(newVal === undefined) return
            if(oldVal) {
                vm.unsubscribe(`${vm.objId}.playlists.${oldVal.path}.imageUrl`)
            }
            vm.subscribe(`${vm.objId}.playlists.${newVal.path}.imageUrl`)
        })

    },
    destroyed() {
        let vm = this
        vm.unsubscribe(`${vm.objId}.playlists.playlistListIds`)
        vm.unsubscribe(`${vm.objId}.playlists.playlistListString`)
        vm.unsubscribe(`${vm.objId}.player.isPlaying`)
    }
}


</script>
<style lang="scss" scoped>
.clipboard {
    background-position: center center;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
}
.wrapper {
    padding: 10px;
}
.play-icon {
    height: 50%;
    stroke: $light-color;
    justify-content: center;
    cursor: pointer;
    >svg {
        max-width: 100%;
    }
}
.play-icon:hover {
    filter: drop-shadow(0px 0px 2px $spotify-color) drop-shadow(0px 0px 2px $spotify-color) drop-shadow(0px 0px 4px $spotify-color)
}
.overlay {
    width: 100%;
    height: 100%;
    background-color: #2b2929e3;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    transition: 0.7s ease;
}
.overlay-hidden {
    opacity: 0;
}
.playlist-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-height: 1;
    max-height: calc(100% - 0.8rem);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 1.9rem;
    padding-left: 10px;
    padding-right: 10px;
    text-align: left;
}
</style>