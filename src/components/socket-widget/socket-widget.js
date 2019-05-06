import merge from 'lodash/merge'

export default {
  name: 'socket-widget',
  components: {},
  props: [],
  data () {
    return {
      settings: {
        stateId: -1,
        top: "kek",
        title: "yeet",
      },
    }
  },
  computed: {

  },
  mounted () {
    //Merge widget specifig settings with base settings
    this.$parent.settings = merge(this.$parent.settings, this.settings)
  },
  methods: {

  }
}
