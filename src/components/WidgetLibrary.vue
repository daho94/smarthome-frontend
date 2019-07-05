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
      this.lib = res
    })
  },
  mounted () {
    
  },
  methods: {

  },
  render: function(createElement) {
    let self = this;
    let children = []
    for (let cat of self.lib) {

      let widgets = []

        for (let widget of cat[1]) {
          widgets.push(createElement('li',  { class: ["no-bg", "category-item"] }, [createElement(
            'b-button',
            {
              on: {
                click: function() {
                  self.$emit('addWidget', widget.component_key)
                }
              },
              attrs: {
                size: "sm",
                variant: "transparent",
              },
              class: ["edit-btn"]
            },
            [
              // createElement(
              //   'i', 
              //   {
              //     class: ["material-icons", "md-36", "text-info"]
              //   },
              //   'insert_chart'
              // )
              createElement(
                'squid-icon',
                {
                  attrs: {
                    icon: widget.icon,
                    stroke: "#FFFFFF"
                  },
                  class: ["hovered"]
                }
              )
            ]
          ),
          widget.name
          ]))
      }


    children.push(createElement('li',
      {
        class: ["no-bg"],
        style: {
          'padding-top': '0px !important'
        },
      },
      [
        createElement('div', 
          {
            attrs: {
              class: ["category-btn-container"]
            }
          },
          [
            createElement('b-button', 
              {
                class: ["cursor-pointer", "category-btn", "arrow-toggle", "text-white", "edit-btn"],
                directives: [
                  {
                    name: 'b-toggle',
                    value: 'cat-' + cat[0].id
                  }
                ],
                attrs: {
                  block: true,
                  variant: 'transparent',
                }
              }, 
              [
                cat[0].name,
                createElement('i',
                  {
                    class: ["material-icons", "arrow-right"]
                  },
                  'keyboard_arrow_right', 
                ),
                createElement('i',
                  {
                    class: ["material-icons", "arrow-down"]
                  },
                  'keyboard_arrow_down', 
                )
              ]  
            ),
          ]
        ),
        [createElement('b-collapse', { 
          class: ["category-container"], 
          attrs: {
           id: 'cat-' + cat[0].id,
           visible: true,
          },
        }, widgets)]
      ]))
    }
    return createElement('div', [createElement('h3', 'Library'), createElement('ul', { class: ["category-list"] }, [children])])
  }
}

</script>

<style scoped>
.hovered:hover {
    filter: drop-shadow(0px 0px 2px #17a2b8) drop-shadow(0px 0px 2px #17a2b8) drop-shadow(0px 0px 4px #17a2b8);
}
.arrow-toggle.collapsed  .arrow-right{
 display: inline-block;
}
.arrow-toggle .arrow-right {
  display: none;
}
.arrow-toggle.collapsed  .arrow-down{
 display: none;
}
.arrow-toggle .arrow-down {
  display: inline-block;
}
.category-btn-container {
  background: #343a40;
}
.category-btn i {
  position: absolute;
  right: 10px;

}
.category-btn.collapsed {
  border-bottom: 1px solid rgba(0,0,0,.85) !important;

}
.category-btn {
  border-radius: 0px !important;
  border-bottom: 0 !important;
  text-align: left !important;
}
.category-container {
  padding: 10px;
  margin: 0;
  list-style: none;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-flow: row wrap;
  justify-content: space-between;
  flex-flow: row wrap;
  align-content: flex-start;
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-list>li {
  font-size: 12px;
}

.category-list>li:last-child .category-btn.collapsed {
  border-bottom: 0px !important;
}

.category-list>li>ul>li {
  line-height: 1;
}

.category-item {
  width: 64px;
  text-align: center;
  word-break: break-word;
  line-height: 1.0;
}
.category-item button {
  width: 80%;
}
</style>