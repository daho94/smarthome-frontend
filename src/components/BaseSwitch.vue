<template>
    <section :switchState="switchState" class="base-switch">
        <div @click="toggleState" class="icon-wrapper">
            <squid-icon  :icon="icon" class="icon" />
        </div>
        <span class="current-val">
            {{ switchState }}
        </span>
    </section>
</template>

<script>

export default {
    name: "base-switch",
    props: {
        icon: String,
        state: Object,
    },
    data() {
        return {}
    },
    computed: {
        switchState() {
            if (this.state === undefined) {
                return "N/A"
            }

            return this.state.val ? "ON" : "OFF"
        }
    },
    methods: {
        toggleState() {
            // dont emit event if no state is set
            if (this.state === undefined) {
                return
            }

            this.$emit("onToggle", !this.state.val)
        }
    }
}

</script>

<style lang="scss" scoped>
.icon-wrapper {
    height: calc(100% - 60px);
    width: 100%;
    cursor: pointer;
}
.icon {
    margin: 5px;
}

.base-switch {
    display: flex;
    flex-flow: column;
    &[switchState="ON"] {
        stroke: $primary-color;
        fill: $primary-color;
        color: $primary-color;
    }

    &[switchState="OFF"] {
        stroke: $secondary-color;
        fill: $secondary-color;
        color: $secondary-color;
    }

    &[switchState="N/A"] {
        stroke: $secondary-color;
        fill: $secondary-color;
        color: $secondary-color;
    }
}
</style>