<template>
    <section class="dashboard-content" v-bind:class="{ 'settings-right-open': isEditLayout}" id="kek">
    <portal-target v-show="isEditLayout" class="settings-bar" name="settings-bar"></portal-target>
    <grid-layout
    :layout.sync="layout"
    :col-num="8"
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
                :widgetId="item.i"
                :settings="item.settings"
                v-bind:class="{ showTitle: item.settings.showTitle.val }"
                @update="updateSettings"
                >
                </component>
            </base-widget>
        </grid-item>
    </grid-layout>
    </section>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import WidgetCurrentValue from './WidgetCurrentValue'
import BaseWidget from './BaseWidget'
import WidgetMeteogram from './WidgetMeteogram'
import IconSelector from './IconSelector'

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    WidgetCurrentValue,
    BaseWidget,
    WidgetMeteogram,
    IconSelector
  },
  props: {
    isEditLayout: Boolean,
    layout: Array,
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
    },
  }
}
</script>

<style>
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
    background-color: #2d2d2f;
}
.vue-grid-item>.vue-resizable-handle {
  z-index: 3;
}
</style>
