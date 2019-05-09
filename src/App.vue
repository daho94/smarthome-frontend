<template>
  <div id="app">   
    <section class="header-bar">
      <h1>header-bar Component</h1>
      <button v-on:click="toggleEditMode">Edit</button>
    </section>
    <AppContent :isEditMode="isEditMode"/>
  </div>
</template>

<script>
import AppContent from './components/app-content'

export default {
  name: 'app',
  components: {
    AppContent,
  },
  data() {
    return {
      isEditMode: false,
    }
  },
  methods: {
    toggleEditMode: function () {
      this.isEditMode = !this.isEditMode
  }
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
.header-bar {
  height: 60px;
  background-color: aquamarine;
}
</style>
