<script>
import { getWidgets } from '../calls/widget'

export default {
  components: {},
  props: ["layout"],
  data () {
    return {
    lib: [],
    }
  },
  computed: {

  },
  created: function() {
    getWidgets().then(res => {
      for (let cat of res) {
        cat[0].isVisible = true
      }
      this.lib = res
    })
  },
  mounted () {
    
  },
  methods: {
    addWidget: function(component) {
      this.$emit("addWidget", component)
    }
  },
  render: function(createElement) {
    let children = []
    for (let cat of this.lib) {

      let widgets = []

      if (cat[0].isVisible) {
        for (let widget of cat[1]) {
          widgets.push(createElement('b-list-group-item',  { class: ["no-bg"] }, [createElement(
            'b-button',
            {
              on: {
                click: e => {
                  this.addWidget(widget.component_key)
                }
              },
              attrs: {
                size: "sm",
                variant: "transparent",
              },
              class: ["edit-btn"]
            },
            [
              createElement(
                'i', 
                {
                  class: ["material-icons", "md-18", "text-info"]
                },
                'face'
              )
            ]
          ),
          createElement('span', widget.name)
          ]))
      }
    }


    children.push(createElement('b-list-group-item',
      {
        class: ["no-bg"],
        style: {
          'padding-top': '0px !important'
        },
      },
      [
        createElement('div', 
        {
          class: ["cursor-pointer", "category-btn"],
          on: {
            click: function() {
              cat[0].isVisible = !cat[0].isVisible
            }
          }
        }, 
        cat[0].name),
        [createElement('b-list-group', widgets)]
      ]))
    }
    return createElement('div', [createElement('h2', 'Library'), createElement('b-list-group', [children])])
  }
}

</script>

<style>
.widget-library {
}
.category-btn {
  padding-top: 12px;
  padding-right: 20px;
  padding-left: 20px;
}
</style>