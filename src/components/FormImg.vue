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
                size="xl"
                scrollable
                title="Uploads"
                ref="modal"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleOk"
                content-class="modal-bg"
            >
            <div class="img-view" >
                <div v-for="file in files" :key="file.name"  @click="select(file.path)" :class="{'img-selected': selected === file.path}">
                    <img :src="`/${file.path}`" :alt="file.name" />
                    <span>{{ file.name }}</span>
                </div>
            </div>    
            </b-modal>
        </b-form>
    </div>
</section>
</template>
<script>
import { getFiles } from '../calls/upload'

export default {
    name: "form-img",
    props: ["model", "type"],
    data () {
        return {
            selected: "",
            files: []
        }
    },
    async mounted() {
        this.files = await getFiles()
    },
    methods: {
        select(path) {
            this.selected = path
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
                this.model[1].val = `/${this.selected}`
            }

            this.$nextTick(() => {
                this.$refs.modal.hide()
            })
        }
    }
    
}
</script>
<style lang="scss" scoped>
.img-selected {
    filter: drop-shadow(0px 0px 2px #17a2b8) drop-shadow(0px 0px 2px #17a2b8) drop-shadow(0px 0px 4px #17a2b8);
}
.img-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > div {
        display: flex;
        justify-content: center;
        flex-flow: column;
        width: 130px;
        margin: 5px;
        cursor: pointer;
        > img {
            width: 100%;
        }
        > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            text-align: center;
        }
    }

}
</style>