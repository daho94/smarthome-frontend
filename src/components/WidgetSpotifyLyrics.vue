<template>
    <section class="wrapper">
        <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
            <div>
                <div class="song-info">
                    {{ currentArtist }} - {{ currentSong }}
                </div>
                <div v-if="isLoading" class="loading-spinner" style="width:100%">
                    <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
                </div>
                <div v-else class="lyrics">
                {{ lyrics }}
                </div>
            </div>
        </div>
    </section>
</template>

<script>
/** 
 * Iobroker states used: 
 *    spotify-premium.0.player.artistName
 *    spotify-premium.0.player.trackName
 *    javascript.0.spotify.lyrics
 */
import SubscriptionMixin from '../mixins/subscription-mixin'
import SettingsMergeMixin from '../mixins/settings-merge-mixin'

export default {
    name: 'widget-spotify-lyrics',
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
            breakpoints: {small: 650, medium: 1280, large: 1600},
            isLoading: false,
        }

    },
    watch: {
        currentSong() {
            this.isLoading = true
        },
        lyrics(oldVal, newVal) {
            if (newVal !== oldVal) {
                this.isLoading = false
            }
        }
    },
    computed: {
        objId() {
            return `spotify-premium.${this.loadSetting('adapterInstance')}`
        },
        currentSong() {
            let pl = this.updateValue({ val: `${this.objId}.player.trackName`})
            if(!pl || !pl.val) return undefined

            return pl.val
        },
        currentArtist() {
            let pl = this.updateValue({ val: `${this.objId}.player.artistName`})
            if(!pl || !pl.val) return undefined

            return pl.val       
        },
        lyrics() {
            let pl = this.updateValue({ val: `javascript.0.spotify.lyrics`})
            if(!pl || !pl.val) return undefined
            return pl.val    
        }
    },
    mounted() {
        let vm = this;
        vm.$nextTick(function() {
            vm.subscribe(`${vm.objId}.player.trackName`)
            vm.subscribe(`${vm.objId}.player.artistName`)
            vm.subscribe(`javascript.0.spotify.lyrics`)

            vm.$watch('settings.adapterInstance.val', function(newVal, oldVal) {
                vm.unsubscribe(`spotify-premium.${oldVal}.player.trackName`)
                vm.unsubscribe(`spotify-premium.${oldVal}.player.artistName`)


                vm.subscribe(`spotify-premium.${newVal}.player.trackName`)
                vm.subscribe(`spotify-premium.${newVal}.player.artistName`)

            })
        })
    },
    destroyed() {
        let vm = this

        vm.unsubscribe(`${vm.objId}.player.trackName`)
        vm.unsubscribe(`${vm.objId}.player.artistName`)
        vm.unsubscribe('javascript.0.spotify.lyrics')
    },
}

</script>

<style lang="scss" scoped>
.wrapper {
    align-items: unset !important;
    width: 100%;
}
.lyrics {
  margin: 15px;
  white-space: pre-line;
  font-size: 20px;
}
.song-info {
    font-size: 24px;
    font-weight: bold;
    margin: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
}
.loading-spinner {
    width: 100%;
    position: relative;
    top: calc(50% - 60px);
}
</style>