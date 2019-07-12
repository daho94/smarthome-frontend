<template>
<div :class="'theme-' + activeTheme">
  <router-view class="app-container" @themeChanged="themeChangedEvent" :activeTheme="activeTheme"></router-view>
</div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      activeTheme: 'dark'
    }
  },
  computed: {
  },
  methods: {
    themeChangedEvent() {
      this.activeTheme = this.activeTheme === "dark" ? "light" : "dark"
    }
  }
}
</script>

<style lang="scss">
.app-container {

  @include themify($themes) {
    color: themed('textColor');  
    background-color: themed('backgroundColor');  
  }

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;


}
button:hover {
  color: #6c757d!important;
}
body {
  width: 100%;
  margin: 0px;
}
html, body, #app, section.section {
  overflow: hidden;
}

@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(/fonts/MaterialIcons-Regular.eot); /* For IE6-8 */
  src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(/fonts/MaterialIcons-Regular.woff2) format('woff2'),
    url(/fonts/MaterialIcons-Regular.woff) format('woff'),
    url(/fonts/MaterialIcons-Regular.ttf) format('truetype');
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}

.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* Vue-bar styling */
.vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    background-color: rgba(255,255,255,.1);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(255, 255, 255, .3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(255, 255, 255,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(255, 255, 255,.5);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(255, 255, 255,.5);
}

</style>
