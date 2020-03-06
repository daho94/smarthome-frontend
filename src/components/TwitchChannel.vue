<template>
  <div class="channel-wrapper">
    <div class="preview">
      <img :src="metaData.preview.medium" />
    </div>
    <div class="description">
      <div class="channel-name">{{ metaData.channel.display_name }}</div>
      {{ metaData.channel.game }} - {{ metaData.viewers.toLocaleString()}} Viewer
      <br />
      {{ metaData.channel.status }}
    </div>
    <div class="actions">
      <div>
        <b-button-group>
          <b-button
            v-b-tooltip.hover
            title="Open in new tab"
            @click="openStreamInBrowser(metaData.channel.url)"
          >
            <i class="material-icons">play_circle_outline</i>
          </b-button>
          <b-button
            v-b-tooltip.hover
            title="Open on TV"
            @click="openStreamOnTV(metaData.channel.name)"
          >
            <i class="material-icons">ondemand_video</i>
          </b-button>
        </b-button-group>
      </div>
    </div>
  </div>
</template>
<script>
import { setState } from "../calls/iobroker";
export default {
  props: ["metaData"],
  data() {
    return {};
  },
  methods: {
    openStreamInBrowser(url) {
      let win = window.open(url, "_blank");
      win.focus();
    },
    openStreamOnTV(channelName) {
      let mobileUrl = `https://m.twitch.tv/${channelName}`;
      setState(this.$socket, "lgtv.0.states.openURL", mobileUrl);
    }
  }
};
</script>
<style scoped lang="scss">
@media only screen and (min-width: 650px) {
  .preview {
    display: flex !important;
    width: 130px;
  }
  .description {
    width: calc(100% - 150px - 100px) !important;
  }
}

.channel-wrapper {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
}
.preview {
  display: none;
  margin: 10px;
  img {
    height: auto;
    width: 100%;
  }
}
.description {
  font-size: 12px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: calc(100% - 100px);

  .channel-name {
    font-size: 18px;
    font-weight: bold;
  }
}
.actions {
  font-size: 12px;
  display: flex;
  align-items: center;
  width: 100px;
  margin: 10px;
  i {
    position: relative;
    top: 3px;
  }
  button {
    background: #9147ff;
  }
}
</style>