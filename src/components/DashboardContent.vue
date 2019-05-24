<template>
    <section class="dashboard-content" v-bind:class="{ 'settings-right-open': isEditLayout}" id="kek">
    <portal-target v-show="isEditLayout" class="settings-bar" name="settings-bar"></portal-target>
    <portal-target  v-show="isDashboardMenu" class="dashboard-menu" name="dashboard-menu"></portal-target>
    <grid-layout
    :layout.sync="layout"
    :col-num="12"
    :row-height="30"
    :is-draggable="isEditLayout"
    :is-resizable="isEditLayout"
    :is-mirrored="false"
    :vertical-compact="false"
    :margin="[10, 10]"
    :use-css-transforms="true"
    >
        <grid-item v-for="item in layout" v-bind:key="item.i"
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
                v-bind:class="{ showTitle: item.settings.showTitle.val }"
                >
                </component>
            </base-widget>
        </grid-item>
    </grid-layout>
    </section>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import WidgetSocket from './WidgetSocket'
import BaseWidget from './BaseWidget'

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    WidgetSocket,
    BaseWidget,
  },
  props: {
    isEditMode: Boolean,
    isEditLayout: Boolean,
    layout: Array,
    isDashboardMenu: Boolean,
  },
  data () {
    return {}
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    removeWidget(id) {
      this.$emit('removeWidget', id)
    },
    updateSettings(id, settings) {
      this.$emit('updateSettings', id, settings)
    }
  }
}
</script>

<style>
.dashboard-content {
    height: calc(100% - 60px);
}
.settings-right-open {
    width: calc(100% - 250px);
}
.settings-bar {
    position: absolute;
    right: 0;
    top: 60px;
    height: calc(100% - 60px);
    min-width: 250px;
    max-width: 250px;
    z-index: 10;
    background-color: antiquewhite;

}

.dashboard-menu {
    position: absolute;
    left: 0;
    top: 60px;
    height: calc(100% - 60px);
    min-width: 250px;
    max-width: 250px;
    z-index: 10;
    background-color: antiquewhite;
}
</style>
