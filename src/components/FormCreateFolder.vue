<template>
    <b-modal
        id="modal-create-folder"
        title="Create Folder"
        ref="modal"
        content-class="modal-bg"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >
    <form ref="form" @submit.stop.prevent="handleSubmit" class="no-outline">
        <b-form-group invalid-feedback="Name is required" :state="nameState">
            <label for="folder-name">Folder Name:</label>
            <b-form-input id="folder-name" v-model="newFolder.name" :state="nameState" required></b-form-input>
            <label for="folder-icon">Folder Icon:</label>
            <b-row style="height: 60px">
                <b-col sm="4" style="height:100%; stroke: #FFFFFF; fill: #FFFFFF; text-align: center">
                    <squid-icon :icon="newFolder.icon" />
                </b-col>
                <b-col sm="8">
                    <b-form-select id="folder-icon" size="sm" v-model="newFolder.icon">
                        <option v-for="(option, i) in icons" v-bind:key="i" :value="option">{{ option }}</option>
                    </b-form-select>
                </b-col>
            </b-row>
            <label>Folder:</label>
            <dashboard-folder :folder="folder" :model="selectedFolder" @onselect="updateFolderId"/>
        </b-form-group>
    </form>
    </b-modal>
</template>

<script>
import { getIcons } from '../utils/iconParser'
import { getFolders } from '../calls/folder'
import DashboardFolder from './DashboardFolder';

export default {
    name: "form-create-folder",
    components: {
        DashboardFolder
    },
    data() {
        return {
            newFolder: {},
            nameState: null,
            folder: {},
            icons: [],
            selectedFolder: {},
        }
    },
    async mounted() {
        this.icons = await getIcons("/icons/squidink.svg")
        this.folder = await getFolders()
    },
    methods: {
        updateFolderId(folder) {
            this.selectedFolder = folder
            this.newFolder.parentId = folder.id
        },
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.nameState = valid ? true : false
            return valid
        },
        async resetModal() {
            this.folder = await getFolders()
            this.selectedFolder = this.folder.Folder
            this.newFolder = {
                name: "",
                icon: "folder",
                parentId: this.folder.Folder.id,
            } 
            this.nameState = null
        },
        handleOk(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.handleSubmit()
        },
        handleSubmit() {
            if (!this.checkFormValidity()) {
                return
            }
            this.$emit("on-submit", this.newFolder)
            this.$nextTick(async () => {
                // Update folders
                this.folder = await getFolders()
                this.$refs.modal.hide()
            })
        }
    }
}

</script>

<style lang="scss">
.no-outline :focus {
    outline: none;
}

</style>