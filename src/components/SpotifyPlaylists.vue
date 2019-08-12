<template>
    <section class="playlists-wrapper">

        <div class="playlist-header">
            <app-icon icon="spotify" />
        </div>
        <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
            <div>
                <ul class="playlist-items">
                    <li v-for="(pl, i) in playlists"
                        v-bind:key="i"
                        @click="changePlaylist(pl.id)"
                        :selected="pl.id === selectedPlaylist"
                        >
                        {{ pl.name }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script>
/** 
 * Iobroker states used: 
 *    spotify-premium.{Instance}.playlists.playlistListIds
 *    spotify-premium.{Instance}.playlists.playlistListString
 *    spotify-premium.{Instance}.player.playlist.id
 */
import { setState } from '../calls/iobroker'
import SubscriptionMixin from '../mixins/subscription-mixin'
import zipWith from 'lodash/zipWith'
import AppIcon from './AppIcon'

export default {
    name: "spotify-playlists",
    mixins: [SubscriptionMixin],
    props: {
        objId: String,
        activePlaylistId: String,
    },
    components: {
        AppIcon
    },
    data() {
        return {
            selectedPlaylist: undefined,
        }
    },
    methods: {
        /**
         * Actively change playlist by setting playlist owner and playlist id. The playlist will start automatically.
         */
        async changePlaylist(id) {
            this.selectedPlaylist = id
            const currentPlaylist = this.playlists[this.activePlaylistIndex]
            // 1. Set owner
            let success = await setState(this.$socket, `${this.objId}.player.playlist.owner`, currentPlaylist.owner)
            if (!success) return

            // 2. Set playlistId
            setState(this.$socket, `${this.objId}.player.playlist.id`, currentPlaylist.id)
        },
    },
    watch: {
        /**
         * Watch selectedPlaylist and update playlist path
         */
        selectedPlaylist() {
            const currentPlaylist = this.playlists[this.activePlaylistIndex]
            this.$emit("onPlaylistChange", currentPlaylist.path)
        },
        activePlaylistId(newVal) {
            if(newVal === undefined) return
            if(newVal === this.selectedPlaylist) return

            this.selectedPlaylist = newVal
        }
    },
    computed: {
        activePlaylistIndex() {
            let vm = this
            return this.playlists.findIndex(function(pl) {
                return pl.id === vm.selectedPlaylist
            })
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
    },
    mounted() {
        let vm = this;
        vm.subscribe(`${vm.objId}.playlists.playlistListIds`)
        vm.subscribe(`${vm.objId}.playlists.playlistListString`)

        vm.$watch('settings.adapterInstance.val', function(newVal, oldVal) {
            vm.unsubscribe(`spotify-premium.${oldVal}.playlists.playlistListIds`)
            vm.unsubscribe(`spotify-premium.${oldVal}.playlists.playlistListString`)

            vm.subscribe(`spotify-premium.${newVal}.playlists.playlistListIds`)
            vm.subscribe(`spotify-premium.${newVal}.playlists.playlistListString`)
        })
    },
    destroyed() {
        let vm = this
        vm.unsubscribe(`${vm.objId}.playlists.playlistListIds`)
        vm.unsubscribe(`${vm.objId}.playlists.playlistListString`)
    },
}
</script>
<style lang="scss" scoped>
.playlists-wrapper {
    height: 100%;
    padding-top: 10px;
    display: flex;
    align-items: unset !important;
    flex-flow: column nowrap;
}
.playlist-items {
    list-style: none;
    padding-left: 0;
    padding-right: 10px;
    padding-top: 5px;
    font-size: 0.9rem;
    color: $secondary-color;
    >li {
        cursor: pointer;
        text-align: left;
        white-space: nowrap;
        width: 100%;                   
        overflow: hidden;
        text-overflow: ellipsis;
        border-left: 3px solid #ff000000;
        padding-left: 10px;
        &[selected] {
            border-left: 3px solid $success-color;
        }
    }
}
.playlist-items li:hover {
    @include themify($themes) {
        color: themed('textColor');
    }
}
.playlist-header {
    width: 70%;
    @include themify($themes) {
        fill: themed('textColor');
    }
}
</style>