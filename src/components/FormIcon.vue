<template>
<section class="form-input">
    <div>
        <label for="input-small">{{ model[0] }}:</label>
    </div>
    <div>
        <b-form inline>
            <b-form-input size="sm" v-model="model[1].val" :type="type" style="width: calc(100% - 50px) !important;"></b-form-input>
            <b-button variant="transparent" class="picture-btn edit-btn" size="sm" v-b-modal.modal-icon-selector><i class="material-icons">collections</i></b-button>
            <b-modal
                id="modal-icon-selector"
                size="lg"
                scrollable
                title="Icons"
                ref="modal"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOk"
                content-class="modal-bg"
            >
                <icon-selector  v-on:select="changeIcon" />
            </b-modal>
        </b-form>
    </div>
</section>
</template>
<script>
import IconSelector from './IconSelector'

export default {
    name: "form-icon",
    props: ["model", "type"],
    components: {IconSelector},
    data () {
        return {
            selected: ""
        }
    },
    methods: {
        changeIcon(icon) {
            this.selected = icon
        },
        resetModal() {
            this.selected = ""
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            if (this.selected.length !== 0) {
                this.model[1].val = this.selected
            }

            this.$nextTick(() => {
                this.$refs.modal.hide()
            })
        }
    }
    
}
</script>
<style lang="scss">
.picture-btn {
    color: $light-color !important;  
}
.picture-btn:focus {
  outline: none !important;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1) !important;
  -moz-box-shadow: 0px 0px 10px 0px rgba(235,228,235,1) !important;
  box-shadow: 0px 0px 4px 0px rgba(235, 228, 235, 0.6) !important;
}
.form-input {
    display: flex;
    flex-flow: column;
}
.form-input > div {
    margin-left: 5px;
    margin-right: 5px;
    align-self: flex-start;
    width: 100%;
    text-align: left;
}
.modal-bg {
    background-color: #393b3d !important;
    color: $font-color;
}
</style>