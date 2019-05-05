<template>
  <div id="app">
    <HeaderBar/>
    <AppContent/>
  </div>
</template>

<script>
import HeaderBar from './components/header-bar'
import AppContent from './components/app-content'

export default {
  name: 'app',
  components: {
    HeaderBar,
    AppContent
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
html, body, #app, section.section {
  height: 100%;
}
</style>
