import VueGridLayout from 'vue-grid-layout'
import SocketWidget from '../socket-widget'
import BaseWidget from '../base-widget'
import cloneDeep from 'lodash/cloneDeep'

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
  {"x":0,"y":0,"w":2,"h":2,"i":"0","c": "SocketWidget", "settings": cloneDeep(baseSettings)},
  {"x":2,"y":0,"w":2,"h":4,"i":"1","c": "SocketWidget", "settings": cloneDeep(baseSettings)},
  {"x":4,"y":0,"w":2,"h":5,"i":"2","c": "SocketWidget", "settings": cloneDeep(baseSettings)},
  // {"x":6,"y":0,"w":2,"h":3,"i":"3","c": "SocketWidget", "settings": { ...baseSettings }},
  // {"x":8,"y":0,"w":2,"h":3,"i":"4","c": "SocketWidget", "settings": { ...baseSettings }},
]


export default {
  name: 'app-content',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    SocketWidget: SocketWidget,
    BaseWidget: BaseWidget,
  },
  props: {
    isEditMode: Boolean
  },
  data () {
    return {
      layout: testLayout,
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    removeWidget(id) {
      this.layout = this.layout.filter(item => item.i != id)
    }
  }
}
