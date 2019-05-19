<template>
  <div id="app">   
  <router-view></router-view>
  </div>
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
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  width: 100%;
}
html, body, #app, section.section {
  height: 100%;
}
.header-button {
  position: absolute;
  top: calc(30px + 10px);
  left: 10%;
}
.header-bar {
  height: 60px;
  background-color: aquamarine;
}
</style>
