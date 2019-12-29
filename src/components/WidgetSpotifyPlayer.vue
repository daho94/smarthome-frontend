<template>
    <section class="wrapper">
        <div class="player-content">
            <!-- Playlists -->
            <hide-at :breakpoints="breakpoints" breakpoint="small"> 
                <div class="player-playlist">
                    <spotify-playlists :objId="objId" @onPlaylistChange="updatePlaylist" :activePlaylistId="activePlaylistId" />
                </div>
            </hide-at>
            <show-at :breakpoints="breakpoints" breakpoint="small">
                <div class="player-playlist">
                    <div class="playlist-compact" v-show="!isPlaylistHidden">
                        <spotify-playlists :objId="objId" @onPlaylistChange="updatePlaylist" :activePlaylistId="activePlaylistId" />
                    </div>
                    <div class="playlist-icon" :class="{ 'playlist-shown': !isPlaylistHidden }" @click="togglePlaylist">
                        <squid-icon :icon="isPlaylistHidden ? 'justify': 'left-arrow-2'" />
                    </div>
                </div>
            </show-at>

            <div class="player-context">
                <!-- Context info -->
                <div class="player-context-description">
                    <div class="context-img">
                        <img :src="contextImageUrl" />
                    </div>
                    <div>
                        <div class="context-type">
                            {{ contextDescription[0] }}
                        </div>
                        <div class="context-name">
                            <b>{{ contextDescription[1] }}</b>
                        </div>
                    </div>
                </div>
                <!-- Tracklist -->
                <div class="player-tracklist">
                    <spotify-track-list 
                        :currentPlaylist="activePlaylistPath"
                        :objId="objId"
                        @trackDblClicked="playTrack"
                    />
                </div>
            </div>
        </div>
        <!-- Control -->
        <div class="player-control">
            <spotify-controls 
                :objId="objId"
            />
        </div>
    </section>
</template>

<script>
/** 
 * Iobroker states used: 
 *    spotify-premium.{Instance}.player.playlist.id
 *    spotify-premium.{Instance}.player.contextDescription
 *    spotify-premium.{Instance}.player.contextImageUrl
 */
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import SpotifyTrackList from './SpotifyTrackList'
import SpotifyControls from './SpotifyControls'
import SpotifyPlaylists from './SpotifyPlaylists'
import { setState } from '../calls/iobroker'
import {showAt, hideAt} from 'vue-breakpoints'

export default {
    name: 'widget-spotify-player',
    components: {
        SpotifyTrackList,
        SpotifyControls,
        SpotifyPlaylists,
        showAt,
        hideAt,
    },
    props: ["settings", "activeTheme"],
    mixins: [SubscriptionMixin, SettingsMergeMixin],
    data () {
        return {
            widgetSettings: {
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
            activePlaylistPath: undefined,
            isPlaylistHidden: true,
            breakpoints: {small: 650, medium: 1280, large: 1600}
        }

    },
    methods: {
        async playTrack(trackNo) {
            setState(this.$socket, `${this.objId}.player.playlist.trackNo`, trackNo) 
        },
        updatePlaylist(newPath) {
            this.activePlaylistPath = newPath
        },
        togglePlaylist() {
            this.isPlaylistHidden = !this.isPlaylistHidden
        }
    },
    computed: {
        contextDescription() {
            let state = this.updateValue({ val: `${this.objId}.player.contextDescription` })

            if(state === undefined ||!state.val) return ""

            return state.val.split(":").map(chunk => chunk.trim())
        },
        contextImageUrl() {
            let state = this.updateValue({ val: `${this.objId}.player.contextImageUrl` })

            if(state === undefined ||!state.val) return "https://discordemoji.com/assets/emoji/residentsleeper.png"

            return state.val
        },
        activePlaylistId() {
            let pl = this.updateValue({ val: `${this.objId}.player.playlist.id`})
            if(!pl || !pl.val) return undefined

            return pl.val
        },
        objId() {
            return `spotify-premium.${this.loadSetting('adapterInstance')}`
        }
    },
    mounted() {
        let vm = this;
        vm.$nextTick(function() {
            vm.subscribe(`${vm.objId}.player.playlist.id`)
            vm.subscribe(`${vm.objId}.player.contextDescription`)
            vm.subscribe(`${vm.objId}.player.contextImageUrl`)

            vm.$watch('settings.adapterInstance.val', function(newVal, oldVal) {
                vm.unsubscribe(`spotify-premium.${oldVal}.player.playlist.id`)
                vm.unsubscribe(`spotify-premium.${oldVal}.player.contextDescription`)
                vm.unsubscribe(`spotify-premium.${oldVal}.player.contextDescription`)

                vm.subscribe(`spotify-premium.${newVal}.player.playlist.id`)
                vm.subscribe(`spotify-premium.${newVal}.player.contextDescription`)
                vm.subscribe(`spotify-premium.${newVal}.player.contextDescription`)
            })
        })
    },
    destroyed() {
        let vm = this

        vm.unsubscribe(`${vm.objId}.player.playlist.id`)
        vm.unsubscribe(`${vm.objId}.player.contextDescription`)
        vm.unsubscribe(`${vm.objId}.player.contextImageUrl`)
    },
}

</script>

<style lang="scss" scoped>
$controls-height: 80px;
.wrapper {
    display: flex;
    align-items: unset !important;
    flex-flow: column nowrap;
}
.player-content {
    max-height: calc(100% - #{$controls-height});
    min-height: calC(100% - #{$controls-height}); // smoother transition between playlists (no shrinking)
    width: 100%;
    display: flex;
    overflow: hidden; // temporary; ToDo: Make scrollable
}
.player-playlist {
    height: 100%;
    width: 40px;
    min-width: 40px;
    @include themify($themes) {
        border-top-left-radius: themed('widgetBorderRadius');
        background-color: themed('menuBackgroundColor');
    }
}
@media only screen and (min-width: 650px) {
    .player-playlist {
        width: 25%;
    }
    .player-context {
        width: 75% !important;
    }
}
.player-context {
    display: flex;
    flex-flow: column nowrap;
    width: calc(100% - 40px);
}
.player-context-description {
    height: 25%;
    text-align: left;
    display: flex;
    align-items: center;
    align-content: center;
    line-height: 1.2;
}
.player-tracklist {
    height: 75%;
}
.player-control {
    width: 100%;
    height: $controls-height;
}
.context-img {
    height: 100%;
    align-content: center;
    align-items: center;
    display: flex;
    padding: 10px;
    >img {
        max-height: 100%;
    }
}
.context-type {
    text-transform: uppercase;
    font-size: 0.8rem;
}
.context-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-height: 1;
    max-height: calc(100% - 0.8rem);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 1.9rem;
}
.playlist-icon {
    @include themify($themes) {
        stroke: themed('textColor');
    }
    width: 35px;
    top: calc(50% - 60px);
    position: absolute;
    z-index: 5;
    left: 2px;
    cursor: pointer;
    svg {
        @include themify($themes) {
            background-color: themed('menuBackgroundColor');
        }
    }
}
.playlist-shown {
    left: 200px;
    width: 30px;
}
.playlist-compact {
    position: absolute;
    z-index: 5;
    width: 200px;
    height: calc(100% - 80px);
    @include themify($themes) {
        border-top-left-radius: themed('widgetBorderRadius');
        background-color: themed('menuBackgroundColor');
    }
}
</style>