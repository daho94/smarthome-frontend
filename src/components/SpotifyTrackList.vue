<template>
    <section class="table-wrapper">
        <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }">
            <div>
                <b-table responsive small borderless :fields="fields" :items="trackList"
                    @row-dblclicked="onDoubleClickEvent"
                    tbody-class="custom-tr-hover"
                >
                </b-table>
            </div>
        </div>
    </section>
</template>
<script>
import SubscriptionMixin from '../mixins/subscription-mixin'

export default {
    name: "spotify-track-list",
    props: {
        currentPlaylist: String,
        objId: String,
    },
    mixins: [SubscriptionMixin],
    data() {
        return {
            fields: [
                // A regular column
                {
                    key: "title",
                    label: "Title",
                    class: "table-text-color",
                    sortable: true
                },
                // A regular column
                {
                    key: "artistName",
                    label: "Artist",
                    class: "table-text-color",
                    sortable: true
                },
                // A virtual column made up from two information
                { 
                    key: "album",
                    label: 'Album', 
                    class: "table-text-color",
                    sortable: true  
                },
                {
                    key: "duration",
                    label: 'Duration',
                    class: "table-text-color",
                    sortable: true  
                }        
            ],
        }
    },
    computed: {
        trackList() {
            let tl = this.updateValue({ val: this.trackListPath })

            if(tl === undefined ||!tl.val) return []
            
            return this.parseData(tl.val)
        },
        trackListPath() {
            return `${this.objId}.playlists.${this.currentPlaylist}.trackListArray`
        }
    },
    watch: {
        currentPlaylist(newVal, oldVal) {
            this.subscribe(`${this.objId}.playlists.${newVal}.trackListArray`)
            if(oldVal !== undefined && oldVal.length > 0) this.unsubscribe(`${this.objId}.playlists.${oldVal}.trackListArray`)     
        }
    },
    destroyed() {
        this.subscribe(`${this.objId}.playlists.${this.currentPlaylist}.trackListArray`)
    },
    methods: {
        parseData(data) {
            return data.map((track, i) => {
                return {
                    title: track.title,
                    artistName: track.artistName,
                    album: track.album.name,
                    duration: track.duration,
                    // Iobroker spotify-premium-adapter is buggy
                    trackNo: i + 1
                }
            })
        },
        onDoubleClickEvent(item) {
            this.$emit("trackDblClicked", item.trackNo)
        },
    }
}


</script>
<style lang="scss">
.table-text-color {
    @include themify($themes) {
        color: themed('textColor');  
    }
    text-align: left;
    white-space: nowrap;
    max-width: 250px;                   
    overflow: hidden;
    text-overflow: ellipsis;
}
.table-wrapper {
    padding: 10px;
    font-size: 1rem !important;
    align-items: unset !important;
    >div {
        width: 100%;
        height: 100%;
    }
    height: 100%;
}
.custom-tr-hover > tr:hover {
    @include themify($themes) {
      background-color: rgba(themed('scrollbarColor'), 0.1);  
    }
}
</style>