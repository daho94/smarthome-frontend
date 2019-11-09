<template>
  <section>
    <app-icon style="width:100%" icon="youtube" class="centered"/>
  </section>
</template>

<script>
import AppIcon from './AppIcon'

export default {
  name: 'widget-app-launcher',
  components: {
    AppIcon
  },
  data() {
    return {
      lgtv: undefined
    }
  },
  mounted() {
  
  }
}
</script>

<style lang="scss">
.centered {
  // transform: translate(-15%, 0px);
  display:flex;
  justify-content: center;
  >use {
    justify-content: center;
  }
}
</style>