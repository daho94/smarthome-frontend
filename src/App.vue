<template>
  <div id="app"  >   
    <section class="header-bar">
      <h1>header-bar Component</h1>
      <button class="header-button" v-on:click="isEditLayout = !isEditLayout">Edit</button>
      <portal v-if="isEditLayout" to="settings-bar" >
        <widget-library 
          :layout="layout"
          @addWidget="addWidget"
        />
      </portal>
    </section>
    <AppContent 
      :layout="layout" 
      :isEditLayout="isEditLayout"
      @removeWidget="removeWidget"
      />
  </div>
</template>

<script>
import AppContent from './components/app-content'
import cloneDeep from 'lodash/cloneDeep'
import maxBy from 'lodash/maxBy'
import WidgetLibrary from './components/widget-library'
import uuidv4 from 'uuid/v4';


let baseSettings = {
  title: {
    val: "Default title",
    type: "input"
  },
  showTitle: {
    val: true,
    type: "checkbox"
  }
}

var testLayout = [
  {"x":0,"y":0,"w":2,"h":2,"i":uuidv4(),"c": "SocketWidget", "settings": cloneDeep(baseSettings)},
  {"x":2,"y":0,"w":2,"h":4,"i":uuidv4(),"c": "SocketWidget", "settings": cloneDeep(baseSettings)},
  {"x":4,"y":0,"w":2,"h":5,"i":uuidv4(),"c": "SocketWidget", "settings": cloneDeep(baseSettings)},
]

export default {
  name: 'app',
  components: {
    AppContent,
    WidgetLibrary,
  },
  data() {
    return {
      layout: testLayout,
      isEditLayout: false,
    }
  },
  computed: {
  },
  methods: {
    addWidget: function(component) {
      let wLowest = maxBy(this.layout, w => w.y+ w.h)
      this.layout.push(
        {"x":0,"y":wLowest.y+ wLowest.h,"w":2,"h":2,"i":uuidv4(),"c": component, "settings": cloneDeep(baseSettings)},
      )
    },
    removeWidget(id) {
      this.layout = this.layout.filter(item => item.i != id)
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
