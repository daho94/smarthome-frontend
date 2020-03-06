<template>
  <section class="wrapper">
    <div
      v-bar="{
          preventParentScroll: true,
          overrideFloatingScrollbar: true
          }"
    >
      <div>
        <twitch-channel
          v-for="channel in streams"
          v-bind:key="channel._data._id"
          :metaData="channel['_data']"
        ></twitch-channel>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * Iobroker states used:
 * javascript.0.twitch.followedStreams
 */

import SubscriptionMixin from "../mixins/subscription-mixin";
import TwitchChannel from "./TwitchChannel";

export default {
  name: "widget-twitch",
  mixins: [SubscriptionMixin],
  data() {
    return {
      objId: "javascript.0.twitch.followedStreams"
    };
  },
  components: {
    TwitchChannel
  },
  computed: {
    streams() {
      let state = this.updateValue({ val: this.objId });
      if (state === undefined || !state.val) return [];

      return JSON.parse(state.val);
    }
  },
  methods: {},
  mounted() {
    let vm = this;
    vm.$nextTick(function() {
      vm.subscribe(vm.objId);

      vm.$watch(vm.objId, function(newVal, oldVal) {
        vm.unsubscribe(oldVal);
        vm.subscribe(newVal);
      });
    });
  },
  destroyed() {
    this.unsubscribe(this.objId);
  }
};
</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-flow: column;
}
</style>