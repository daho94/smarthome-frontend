<template>
    <portal to="settings-bar">
        <section class="widget-settings">
            Settings
            <ul>
                <li v-for="(val, key) in settingsCopy" v-bind:key="key">
                {{ key }} 
                <input v-if="settingsCopy[key].type == 'input'" v-model="settingsCopy[key].val">
                <input v-if="settingsCopy[key].type == 'checkbox'" type="checkbox" v-model="settingsCopy[key].val" placeholder="settingsCopy[key].val">
                </li>
                <li><button v-on:click="remove">Remove Widget</button></li>
                <li v-if="settingsChanged"><button  v-on:click="confirm">Confirm</button></li>
                <li v-if="settingsChanged"><button  v-on:click="cancel">Cancel</button></li>
            </ul>
        </section>
    </portal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {},
  props: ["settings", "widgetId"],
  data () {
    return {
      settingsCopy: cloneDeep(this.settings),
      settingsChanged: false,
    }
  },
  computed: {

  },
  watch: {
    settingsCopy: {
      handler() {
        this.settingsChanged = true;
      },
      deep: true,
    },
  },
  mounted () {
  },
  methods: {
    remove() {
      this.$parent.$emit("remove", this.widgetId)
    },
    confirm() {
      this.$parent.$emit("update", this.widgetId, cloneDeep(this.settingsCopy))
      this.settingsChanged = false
    },
    cancel() {
      this.settingsCopy = cloneDeep(this.settings)

      this.$nextTick(function() {
        this.settingsChanged = false
      })
    }
  }
}

</script>

<style>
.widget-settings {
    height: 100%;
}
</style>