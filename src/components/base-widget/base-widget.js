import WidgetSettingsBar from '../widget-settings-bar'

export default {
  name: 'base-widget',
  props: {
    height: Number,
    width: Number,
    isEditMode: Boolean,
  },
  data () {
    return {
      "baseStyle": "base-widget",
      "settingsOpen": false,
      "settings": {
        "title": "Default",
      },
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
    openSettings() {
      if(this.isEditMode) {
        this.settingsOpen = true
      }
    }
  }
}
