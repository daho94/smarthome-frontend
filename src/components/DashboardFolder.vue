<template>
<div :style="{
    'padding-left': `20px`,
}">
<b-row class="folder-wrapper">
    <div @click="select(folder.Folder)" class="cursor-pointer icon-wrapper">
        <squid-icon class="folder-icon" icon="folder" 
            :style="{
                'stroke': model.id == folder.Folder.id && model.parent_id == folder.Folder.parent_id ? '#17a2b8' : '#f8f9fa',
            }"
        />
    </div> 
    <div>
    {{ folder.Folder.name }}
    </div>
</b-row>
<dashboard-folder v-for="child in folder.Folder.children" @onselect="select" :model="model" v-bind:key="child.id" :folder="child" />
</div>
</template>

<script>

export default {
    name: "dashboard-folder",
    props: ["folder", "model"],
    data() {
        return {

        }
    },
    methods: {
        select(folder) {
            this.$emit('onselect', folder)
        }
    }
}

</script>

<style lang="scss" scoped>
.folder-icon {
    height: 24px !important;
}
.folder-wrapper {
    margin: 5px;
}
.icon-wrapper {
    margin-right: 5px;
}
.cursor-pointer {
    cursor: pointer;
}

</style>