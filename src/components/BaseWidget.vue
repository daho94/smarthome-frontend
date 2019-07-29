<template>
    <section class="base-widget" >
        <div v-if="settings.showTitle.val" class="base-title" :style="{color: settings.titleColor.val}">
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
        <div v-show="isEditLayout" class="edit-overlay" :class="{'is-selected': isSelected}" v-on:click="openSettings">
            <font-awesome-icon icon="cog"  size="6x" class="edit-overlay-icon"/>
        </div>
    </section>
</template>

<script>
import WidgetSettings from './WidgetSettings'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [ clickaway ],
  props: {
    isEditLayout: Boolean,
    widgetId: String,
    settings: Object,
  },
  data () {
    return {
      baseStyle: "base-widget",
      settingsOpen: false,
      isSelected: false,
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
        this.isSelected = true
      }
    },
    /** 
     * Do not close settings-bar when clicked on a modal or in the settingsbar itself
     */
    closeSettings: function(e) {
      if (e.path.every(el => {
          let clickOnSettings = el.className === "widget-settings"
          let clickOnModal = false
          
          if (typeof el.className === "string") {
            clickOnModal = el.className.includes("modal")
          }
        
          return !(clickOnSettings || clickOnModal)
        })) {
        this.settingsOpen = false
        this.isSelected = false
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.base-widget {  
  @include themify($themes) {
    background-color: themed('widgetBackgroundColor');  
    border-radius: themed('widgetBorderRadius');
    box-shadow: themed('widgetBoxShadow')
  }
  height: 100%;
}

.base-widget > section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  font-size: 2.5em;
}
.base-title {
  font-size: 20px;
  max-height: 34px;
  min-height: 34px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  padding-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
}

.showTitle {
  max-height: calc(100% - 34px) !important;
}
.edit-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0.8;
  transition: .8s ease;
  @include themify($themes) {
    background-color: themed('overlayColor');  
  }
  z-index: 2;
}
.edit-overlay-icon {
  @include themify($themes) {
    color: themed('textColor');  
  }
  max-height: 80%;
  max-width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.is-selected {
  opacity: 0;
  transition: .8s ease;
}
</style>