<template>
    <b-modal
        id="modal-edit-dashboard"
        title="Edit Dashboard"
        ref="modal"
        content-class="modal-bg"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >
    <form>
        <b-form-group invalid-feedback="Name is required" :state="nameState">
            <label for="dashboard-name">Rename Dashboard:</label>
            <b-form-input id="dashboard-name" v-model="dashboard.name"></b-form-input>
            <label for="dashboard-icon">Change icon:</label>
            <b-row style="height: 60px">
                <b-col sm="4" style="height:100%; stroke: #FFFFFF; fill: #FFFFFF; text-align: center">
                    <squid-icon :icon="dashboard.icon" />
                </b-col>
                <b-col sm="8">
                    <b-form-select id="dashboard-icon" size="sm" v-model="dashboard.icon">
                        <option v-for="(option, i) in icons" v-bind:key="i" :value="option">{{ option }}</option>
                    </b-form-select>
                </b-col>
            </b-row>
        </b-form-group>
    </form>
    </b-modal>
</template>

<script>
import { getIcons } from '../utils/iconParser'

export default {
    name: "form-create-dashboard",
    data() {
        return {
            dashboard: {},
            icons: []
        }
    },
    async mounted() {
        this.icons = await getIcons("/icons/squidink.svg")
    },
    methods: {
        resetModal() {
            this.dashboard = {
                name: "",
                icon: "setting-roll",
            } 
            this.nameState = null
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            this.$emit("on-submit", this.dashboard)
            this.$nextTick(() => {
                this.$refs.modal.hide()
            })
        }
    }
}

</script>

<style lang="scss">


</style>