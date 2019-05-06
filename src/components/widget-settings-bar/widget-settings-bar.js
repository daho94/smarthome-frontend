export default {
  name: 'widget-settings-bar',
  components: {},
  props: ["settings"],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    var current = this.$el
    if(!current) {
      return
    }
    var content = this.$root.$el.getElementsByClassName('app-content')[0]
    current.parentNode.removeChild(current)
    content.appendChild(current)
  },
  methods: {

  }
}
