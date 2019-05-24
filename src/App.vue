<template>
  <router-view id="app"></router-view>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  data() {
    return {
  
    }
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: whitesmoke;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #202121;
}
body {
  width: 100%;
  margin: 0px;
}
html, body, #app, section.section {
  height: 100%;
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

</style>
