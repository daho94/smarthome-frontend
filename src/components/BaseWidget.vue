<template>
    <section v-on:click="openSettings" class="base-widget">
        <div v-if="settings.showTitle.val" class="base-title">
            <span >{{ settings.title.val }}</span>
        </div>
        <slot></slot>
        <widget-settings 
            v-if="settingsOpen"
            :settings="settings"
            v-on-clickaway="closeSettings"
            :widgetId="widgetId"
        >
        </widget-settings>
    </section>
</template>

<script>
import WidgetSettings from './WidgetSettings'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [ clickaway ],
  props: {
    height: Number,
    width: Number,
    isEditLayout: Boolean,
    widgetId: String,
    settings: Object,
  },
  data () {
    return {
      baseStyle: "base-widget",
      settingsOpen: false,
    }
  },
  components: {
    WidgetSettings,
  },
  computed: {

  },
  mounted () {
  },

  watch: {
    isEditLayout() {      
      if(!this.isEditLayout) {
        this.settingsOpen = false
      }
    }
  },
  methods: {
    openSettings: function() {
      if(this.isEditLayout) {
        this.settingsOpen = true
      }
    },
    closeSettings: function(e) {
      if(e.path.every(el => el.className != "widget-settings")) {
        this.settingsOpen = false
      }
    }
  }
}

</script>

<style>
.base-widget {
    background-color: grey;
    height: 100%;
}

.base-title {
    font-size: 1.5em;
    max-height: 28px;
    min-height: 28px;
}

.showTitle {
    height: calc(100% - 28px);
}
</style>