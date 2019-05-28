<template>
  <v-date-picker
      mode="range"
      v-model="dates"
      color="teal"
      :attributes="attrs"
      is-dark
      :popover="{ placement: 'bottom-left', visibility: 'click', keepVisibleOnInput: true }"
    >
    <b-button size="sm" variant="transparent" class="my-2 my-sm-0 text-white edit-btn calendar-btn">
      <i class="material-icons calendar-icon">date_range</i>
    </b-button>
  </v-date-picker>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      dates: null,
      attrs: [
        {
          key: 'today',
          highlight: 'red',
          dates: new Date(),
          popover: {
            label: 'Today',
            labelStyle: {
              background: "red"
            },
          },
        },
      ],
    }
  }
}
</script>

<style>
.calendar-btn {
  height: 40px;
}
.calendar-icon {
  line-height: 1 !important;
}
</style>
