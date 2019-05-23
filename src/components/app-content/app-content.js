import VueGridLayout from 'vue-grid-layout'
import SocketWidget from '../socket-widget'
import BaseWidget from '../base-widget'

export default {
  name: 'app-content',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    SocketWidget: SocketWidget,
    BaseWidget: BaseWidget,
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
      // this.layout = this.layout.filter(item => item.i != id)
      this.$emit('removeWidget', id)
    },
    updateSettings(id, settings) {
      this.$emit('updateSettings', id, settings)
    }
  }
}
