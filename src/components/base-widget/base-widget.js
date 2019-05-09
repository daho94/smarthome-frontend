import WidgetSettingsBar from '../widget-settings-bar'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  mixins: [ clickaway ],
  name: 'base-widget',
  props: {
    height: Number,
    width: Number,
    isEditMode: Boolean,
    widgetId: String,
    settings: Object,
  },
  data () {
    return {
      baseStyle: "base-widget",
      settingsOpen: false,
    }
  },
  components: {
    WidgetSettingsBar: WidgetSettingsBar
  },
  computed: {

  },
  mounted () {
  },

  watch: {
    isEditMode() {      
      if(!this.isEditMode) {
        this.settingsOpen = false
      }
    }
  },
  methods: {
    openSettings: function() {
      if(this.isEditMode) {
        this.settingsOpen = true
      }
    },
    closeSettings: function(e) {
      if(e.path.every(el => el.className != "widget-settings-bar")) {
        this.settingsOpen = false
      }
    }
  }
}
