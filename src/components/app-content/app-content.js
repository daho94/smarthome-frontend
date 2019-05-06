import VueGridLayout from 'vue-grid-layout'
import SocketWidget from '../socket-widget'
import BaseWidget from '../base-widget'

var testLayout = [
  {"x":0,"y":0,"w":2,"h":2,"i":"0","c": "SocketWidget", "props": "..."},
  {"x":2,"y":0,"w":2,"h":4,"i":"1","c": "SocketWidget"},
  {"x":4,"y":0,"w":2,"h":5,"i":"2","c": "SocketWidget"},
  {"x":6,"y":0,"w":2,"h":3,"i":"3","c": "SocketWidget"},
  {"x":8,"y":0,"w":2,"h":3,"i":"4","c": "SocketWidget"},
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

  }
}
