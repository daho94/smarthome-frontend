<template>
    <section :switchState="switchState" class="base-switch">
        <div @click="toggleState" class="icon-wrapper">
            <squid-icon  :icon="icon" class="icon" />
        </div>
        <span class="current-val">
            {{ displayState }}
        </span>
    </section>
</template>

<script>

export default {
    name: "base-switch",
    props: {
        icon: String,
        state: Object,
        mapTrue: String,
        mapFalse: String,
    },
    data() {
        return {
        }
    },
    computed: {
        switchState() {
            if (this.state === undefined) {
                return "N/A"
            }

            return this.state.val ? "TRUE" : "FALSE"
        },
        displayState() {
             if (this.state === undefined) {
                return "N/A"
            }

            return this.state.val ? this.mapTrue : this.mapFalse
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
    &[switchState="TRUE"] {
        stroke: $primary-color;
        fill: $primary-color;
        color: $primary-color;
    }

    &[switchState="FALSE"] {
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