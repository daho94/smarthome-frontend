<template>
  <section class="img-container" @click="launchApp">
    <div class="img-wrapper" :style="{'background-color': `${backgroundColor}`}">
      <img :src="imgSrc" alt="app-icon" />
    </div>
  </section>
</template>

<script>
/** 
 * Iobroker states used: 
 *    javascript.0.lgtv.appList  
 */
import SettingsMergeMixin from '../mixins/settings-merge-mixin'
import SubscriptionMixin from '../mixins/subscription-mixin'
import { setState } from '../calls/iobroker'

export default {
  name: 'widget-app-launcher',
  props: ["settings"],
  mixins: [SubscriptionMixin, SettingsMergeMixin],
  data() {
    return {
      lgtv: undefined,
      widgetSettings: {
        app: {
          val: undefined,
          component: "form-select",
          type: "select",
          category: "settings",
          options: []
        }
      }
    }
  },
  watch: {
    appList() {
      this.settings.app.options = this.appList
    }
  },
  computed: {
    appList() {
      let state = this.updateValue({ val: `javascript.0.lgtv.appList` })

      if(state === undefined ||!state.val) return []
      const appListOptions = JSON.parse(state.val).map(app => {
        return { value: { id: app.id, iconColor: app.iconColor }, text: app.title }
      })
      return appListOptions
    },
    backgroundColor() {
      let app = this.loadSetting('app')
      if (app) {
        return app.iconColor
      }
      return 'inherit'
    },
    imgSrc() {
      let app = this.loadSetting('app')
      if (app) {
        return `upload/${app.id}.png`
      }
      return 'img/defaultApp.png'
    }
  },
  methods: {
    launchApp() {
      setState(this.$socket, `lgtv.0.states.launch`, this.settings.app.val.id) 
    }
  },
  mounted() {
    let vm = this
    vm.$nextTick(function() {
        vm.subscribe(`javascript.0.lgtv.appList`)
    })
  },
  destroyed() { 
    let vm = this
    vm.unsubscribe(`javascript.0.lgtv.appList`)
  },
}
</script>

<style lang="scss" scoped>
.img-container {
    display: flex;
    flex-flow: row nowrap;
    cursor: pointer;
}
.img-wrapper {
  width: calc(100% - 20px);
  height: calc(100% - 30px);
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  >img { 
      max-width: 100%;
      max-height: 100%;
  }
}
.img-wrapper:hover {
    opacity: 0.8;
}
</style>