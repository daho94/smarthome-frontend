<template>
    <section v-bind:class="{ 'settings-right-open': isEditLayout}">
    <portal-target  v-show="isEditLayout" class="settings-bar" name="settings-bar"></portal-target>
    <portal v-if="isEditLayout" to="settings-bar" >
      <widget-library 
        @addWidget="addWidget"
      />
    </portal>
    <div v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
    }">
      <div>
        <grid-layout
        :key="lel"
        :layout.sync="layoutCopy"
        :col-num="12"
        :row-height="30"
        :is-draggable="isEditLayout"
        :is-resizable="isEditLayout"
        :is-mirrored="false"
        :vertical-compact="false"
        :margin="[10, 10]"    
        responsive   
        >
            <grid-item v-for="item in layoutCopy" v-bind:key="item.i"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
            >
                <base-widget
                :isEditLayout="isEditLayout"
                :widgetId="item.i"
                :settings="item.settings"
                @remove="removeWidget"
                @update="updateSettings"
                >
                    <component
                    v-bind:is="item.c"
                    :widgetId="item.i"
                    :settings="item.settings"
                    v-bind:class="{ showTitle: item.settings.showTitle.val }"
                    @update="updateSettings"
                    >
                    </component>
                </base-widget>
            </grid-item>
        </grid-layout>
      </div>
    </div>
    </section>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import WidgetCurrentValue from './WidgetCurrentValue'
import BaseWidget from './BaseWidget'
import WidgetMeteogram from './WidgetMeteogram'
import IconSelector from './IconSelector'
import WidgetLibrary from './WidgetLibrary'
import WidgetSwitch from './WidgetSwitch'
import maxBy from 'lodash/maxBy'
import uuidv4 from 'uuid/v4'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    WidgetCurrentValue,
    BaseWidget,
    WidgetMeteogram,
    IconSelector,
    WidgetLibrary,
    WidgetSwitch,
  },
  props: {
    isEditLayout: Boolean,
    layout: Array,
    activeTheme: String,
  },
  data () {
    return {
      layoutCopy: [],
      lel: 0,
      baseSettings: {
        title: {
          val: "Default title",
          component: "form-input",
          type: "text",
          category: "basic"
        },
        showTitle: {
          val: true,
          component: "form-checkbox",
          type: "checkbox",
          category: "basic"
        },
        titleColor: {
          val: "", //this.activeTheme === "dark" ? "#f8f9fa" : "#212529",
          component: "form-input",
          type: "color",
          category: "basic"
        }
      }
    }
  },
  computed: {
  },
  watch: {
    layout() {
      this.layoutCopy = this.layout
      this.lel += 1
    },
    layoutCopy() {
      this.$emit("layoutChanged", this.layoutCopy)
    }
  },
  methods: {
    addWidget: function(component) {
      let wLowest = maxBy(this.layoutCopy, w => w.y + w.h)
      // if dashboard is empty...
      if (!wLowest) {
        wLowest = {
          y: 0,
          h: 0,
        }  
      }
      this.layoutCopy.push(
        {"x":0,"y":wLowest.y+ wLowest.h,"w":2,"h":4,"i":uuidv4(),"c": component, "settings": cloneDeep(this.baseSettings)},
      )
    },
    removeWidget(id) {
      this.layoutCopy = this.layoutCopy.filter(item => item.i != id)
    },
    updateSettings(id, settings) {
      let widget = this.layoutCopy.filter(item => item.i === id)[0]
      widget.settings = settings
    },
  }
}
</script>

<style lang="scss">
.vue-grid-layout {
  max-height: calc(100vh - #{$navbar-height});
}
.settings-right-open {
    width: calc(100% - 250px);
}
.settings-bar {
    position: fixed;
    right: 0;
    height: 100%;
    min-width: 250px;
    max-width: 250px;
    z-index: 9;
    color: $light-color;
    background-color: $sidebar-background-color;  
}
.vue-grid-item>.vue-resizable-handle {
  z-index: 3;
}
/* Trigger parent scroll on mobile devices */
.vue-grid-item.no-touch {
    -ms-touch-action: pan-y !important;
    touch-action: pan-y !important;
}
</style>
