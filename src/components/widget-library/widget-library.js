import groupBy from 'lodash/groupBy'

const categories = {
  MONITORING: 'Monitoring',
  CONTROL: 'Control',
  STUFF: 'Stuff',
}


export default {
  name: 'widget-library',
  components: {},
  props: ["layout"],
  data () {
    return {
      library: [{
        category: categories.CONTROL,
        tags: ['control', 'socket'],
        component: 'socket-widget',
        name: 'Socket', //ToDo Make this multi lingual
      },
      {
        category: categories.CONTROL,
        tags: ['control', 'socket'],
        component: 'socket-widget',
        name: 'Socket', //ToDo Make this multi lingual
      },
      {
        category: categories.STUFF,
        tags: ['control', 'socket'],
        component: 'socket-widget',
        name: 'Socket', //ToDo Make this multi lingual
      }
    ]
    }
  },
  computed: {

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
    let grouped = groupBy(this.library, item => item.category)
  
    for (let cat of Object.keys(grouped)) {
      let catItems = []
      for (let item of grouped[cat]) {
        catItems.push(createElement('li', [item.name, createElement(
          'button',
          {
            on: {
              click: e => {
                this.addWidget(item.component)
              }
            }
          },
          'Add'
        )]))
      }
  
      children.push(createElement('li', [cat, [createElement('ul', catItems)]]))
    }
    return createElement('div', [createElement('h1', 'Library'), createElement('ul', [children])])
  }
}
