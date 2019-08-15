<template>
  <section class="wrapper">
      <figure class="analog-clock">
          <figcaption class="analog-clock__face">
          <span v-for="n in 60"
              :key="n"
              class="analog-clock__notch"
              :class="{ '-long': !(n % 5) }"
              :style="{ transform: `rotate(${n * 6}deg)` }">
          </span>
          </figcaption>

          <span class="analog-clock__hand -seconds" :style="seconds"></span>
          <span class="analog-clock__hand -minutes" :style="minutes"></span>
          <span class="analog-clock__hand -hours" :style="hours"></span>
      </figure>
      <resize-observer @notify="resizeDebounced" />
  </section>
</template>
<script>
import debounce from 'lodash/debounce'

export default {
    props: { minute: Number, tick: Number },
    data() {
        return {
          rotation: { hours: 0, minutes: 0, seconds: 0 }
        }
    },
    computed: {
        hours() {
          return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.hours}deg)` }
        },
        minutes() {
          return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.minutes}deg)` }
        },
        seconds() {
          return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.seconds}deg)` }
        }
    },
    watch: {
        tick() {
          this.rotation.seconds += 6
          this.rotation.minutes += 0.1
        },
        minute(to, from) {
          if (from === to) return;
          this.rotation.hours += 0.5
        }
    },
    methods: {
        /** 
         * Function to resize clock-size.
         */
        async resize() {
            await this.$nextTick()

            let height = this.$el.offsetHeight
            let width = this.$el.offsetWidth    

            const diameter = Math.min(height, width)

            // Set new height(diameter) with 20px padding
            this.$el.getElementsByClassName("analog-clock")[0].style.height = diameter - 20 + "px"

        }
    },
    mounted() {
        let date = new Date()
        let [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()]
        this.rotation = {
          hours: (h * 30) + (m * 0.5),
          minutes: (m * 6) + (s * 0.1),
          seconds: s * 6
        }
        this.resize()
    },
    created() {
        let vm = this
        this.resizeDebounced = debounce(function() {
            vm.resize() 
        }, 300)
    },
}
</script>
<style scoped lang="scss">
.wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.analog-clock {
    border-radius: 100%;
    -webkit-filter: drop-shadow(0 0.125rem 0.5rem rgba(0, 0, 0, 0.1));
    filter: drop-shadow(0 0.125rem 0.5rem rgba(0, 0, 0, 0.1));
    margin: 0;

  &::after {
    top: 50%;
    left: 50%;
    content: '';
    width: 2.5%;
    height: 2.5%;
    position: absolute;
    border-radius: 100%;
    background-color: #edbec5;
    transform: translate3d(-50%, -50%, 0);
  }

  &__face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__notch {
    transform-origin: 50% 100%;
    position: absolute;
    width: 1px;
    height: 49%;
    bottom: 50%;
    left: 50%;

    &::after {
      content: '';
      width: 100%;
      height: 2.5%;
      position: absolute;
      top: 0;
      left: 0;
      @include themify($themes) {
        background-color: themed('clockNotchColor');  
      }
    }

    &.-long::after {
      width: 2px;
      height: 7.5%;
    }
  }

  &__hand {
    transform-origin: 50% 100%;
    @include themify($themes) {
      background-color: themed('clockHandColor');  
    }
    position: absolute;
    width: 2px;
    height: 40%;
    bottom: 50%;
    left: 50%;
    border-radius: 2px;
    transition: transform 1s linear;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 10%;
      background-color: inherit;
      backface-visibility: hidden;
    }

    &.-hours {
      height: calc(100% / 3);
      width: 3px;
      border-radius: 3px;
      transition: transform 1s linear;
    }

    &.-seconds {
      width: 1px;
      height: 45%;
      border-radius: 0;
      @include themify($themes) {
        background-color: themed('clockSecondsColor');  
      }
      transition: transform 100ms cubic-bezier(.6, .05, 0, 1.6);

      &::after {
        height: 12.5%;
      }
    }
  }
}
</style>