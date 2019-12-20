<template>
    <section class="base-widget" >
        <div v-if="settings.showTitle.val" class="base-title" :style="{color: settings.titleColor.val}">
            <span >{{ settings.title.val }}</span>
        </div>
        <component
          :activeTheme="activeTheme"
          v-bind:is="componentFile"
          :widgetId="widgetId"
          :settings="settings"
          v-bind:class="{ showTitle: settings.showTitle.val }"
          >
          </component>
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
        <button class="widget-actions" ref="button-3">●●●</button>
        <b-tooltip ref="tooltip" variant="dark" :target="() => $refs['button-3']" title="Devices" placement="bottomleft" triggers="click blur">
            <div class="widget-actions-menu">
              <div @click="toggleFullscreen">
                <squid-icon :icon="isFullscreen ? 'close-move' : 'expand-middle'"/>
              </div>
            </div>
        </b-tooltip> 
    </section>
</template>

<script>
import WidgetSettings from './WidgetSettings'
import { mixin as clickaway } from 'vue-clickaway'
import camelCase from 'lodash/camelCase'

export default {
  mixins: [ clickaway ],
  props: {
    isEditLayout: Boolean,
    widgetId: String,
    settings: Object,
    activeTheme: String,
    componentName: {
			type: String,
			required: true
		}
  },
  data () {
    return {
      baseStyle: "base-widget",
      settingsOpen: false,
      isSelected: false,
      isFullscreen: false,
      defaultGridLayoutHeight: undefined,
      defaultGridItem: {
        width: undefined,
        height: undefined,
        transform: undefined,
      }
    }
  },
  components: {
    WidgetSettings,
  },
  computed: {
    /**
     * Import widgets at runtime
     */
    componentFile() {
      let fileName = camelCase(this.componentName)
      fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
      return () => import(`./${fileName}.vue`)
    }
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
    openSettings() {
      if(this.isEditLayout) {
        this.settingsOpen = true
        this.isSelected = true
      }
    },
    /** 
     * Do not close settings-bar when clicked on a modal or in the settingsbar itself
     */
    closeSettings(e) {
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
    },
    toggleFullscreen() {
      let gridItem = this.$parent
      let gridLayout = gridItem.$parent
      if (this.isFullscreen) {
        //restore default style
        gridLayout.$el.style.height = this.defaultGridLayoutHeight
        gridItem.$el.style.width = this.defaultGridItem.width
        gridItem.$el.style.height = this.defaultGridItem.height
        gridItem.$el.style.transform = this.defaultGridItem.transform
        gridItem.$el.style.zIndex = 0
        gridItem.$el.style.position = "absolute"

        this.isFullscreen = false

        this.toggleOtherGridItemsVisibility(gridItem._uid)
      } else {
        // store default height and width
        this.defaultGridLayoutHeight = gridLayout.containerHeight()
        this.defaultGridItem.height = gridItem.style.height
        this.defaultGridItem.width = gridItem.style.width
        this.defaultGridItem.transform = gridItem.style.transform

        // set new width and height
        gridLayout.$el.style.height = "calc(100vh - 60px)"

        gridItem.$el.style.width = "calc(100% - 70px)"
        gridItem.$el.style.height = "calc(100% - 70px)"

        gridItem.$el.style.zIndex = 1;
        gridItem.$el.style.transform = "translate3d(60px, 10px, 0px)"
        gridItem.$el.style.position = "fixed"
        this.isFullscreen = true

        this.toggleOtherGridItemsVisibility(gridItem._uid)
      }
      this.$refs.tooltip.$emit('close')
    },
    /**
     * Hide/show all other grid-items except the fullscreen-one
     */
    toggleOtherGridItemsVisibility(id) {
      let gridItems = this.$parent.$parent.$children;
      for (let item of gridItems) {
        if (item.$el.classList.contains("vue-grid-placeholder") || item._uid === id) {
          continue
        }

        if (this.isFullscreen) {
          item.$el.style.visibility = "hidden";
        } else {
          item.$el.style.visibility = "visible";
        }
      }

    }
  }
}

</script>

<style lang="scss" scoped>
.widget-actions-menu {
  stroke: white;
  cursor: pointer;
  height: 40px;
  >div {
    height: inherit;
  }
}

@media only screen and (min-width: 650px) {
  .widget-actions {
    position: absolute;
    display: block !important;
    top: 8px;
    right: 5px;
    line-height: 0px;
    cursor: pointer;
    -webkit-font-smoothing: antialiased;
    font-family: monospace;
    font-size: 12px;
    opacity: 0.5;
    border-width: 0px;
    background-color: #ff000000;
     @include themify($themes) {
      color: themed('textColor') !important;  
    }
  }
  .widget-actions:focus {
    outline: none;
  }
  .widget-actions:hover {
    opacity: 0.8;
  }
}
.widget-actions {
  display: none;
}
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