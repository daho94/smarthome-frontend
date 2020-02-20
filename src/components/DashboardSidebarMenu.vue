<template>
    <sidebar-menu class="sidebar-menu" :menu="menu"  disable-hover @item-click="onItemClick" :collapsed="collapsed" @collapse="onCollapse">
        <span slot="toggle-icon"><squid-icon class="icon-sidebar" icon="side-arrow"/></span>
        <span slot="dropdown-icon"><font-awesome-icon icon="chevron-down" size="xs" /></span>
    </sidebar-menu>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'


export default {
    props: {
        dashboards: Array
    },
    components: {
        SidebarMenu
    },
    data() {
        return {
            collapsed: true
        }
    },
    computed: {
        menu() {
            if(this.dashboards.length == 0) {
                return []
            }

            return this.buildMenu(this.dashboards)            
        }
    },
    methods: {
        onItemClick(event, item) {
            this.$emit("changeDashboard", item.dashboardId)
        },
        onCollapse (collapsed) {
            this.collapsed = collapsed
        },
        appendDashboards(folderId, child) {
            const dashboardUrl = "/"
            let self = this
            let dashboardsInFolder = self.dashboards.filter((d) => d.folder.id == folderId)
            for (let dashboard of dashboardsInFolder) {
                child.push({
                    href: dashboardUrl + dashboard.id,
                    title: dashboard.name,
                    dashboardId: dashboard.id,
                    icon: {
                        element: "squid-icon",
                        class: "icon-sidebar",
                        attributes: {
                            icon: dashboard.icon
                        }
                    }
                })
            }
        },
        buildTree(tree, root, folders) {
            let children = folders.filter((f) => f.parent_id == root.id)

            for (let child of children) {
                let subTree = {
                    title: child.name,
                    icon: {
                        element: "squid-icon",
                        class: "icon-sidebar",
                        attributes: {
                            icon: child.icon
                        }
                    },
                    child: []
                }
                this.appendDashboards(child.id, subTree.child)
                this.buildTree(subTree, child, folders)
                if (tree.child) tree.child.push(subTree)
            }

        },
        buildMenu(dashboards) {
            let root = dashboards.find((d) => d.folder.name === "root")
            if (!root) return

            let folders = dashboards.map((d) => d.folder).filter((f) => f.name != "root")
            let uniqueFolders = []
            for (let folder of folders) {
                if (uniqueFolders.findIndex((f) => f.id == folder.id) == -1) {
                    uniqueFolders.push(folder)
                }
            }

            let tree = {
                title: root.folder.name,
                icon: "settings",
                child: []
            }
            tree.child.push({
                header: true,
                title: "Dashboards",
                hiddenOnCollapse: true
            })
            this.appendDashboards(root.folder.id, tree.child)
            this.buildTree(tree, root.folder, uniqueFolders)
            return tree.child
        },
    }
}
</script>

<style lang="scss">
::-webkit-scrollbar { /* for Mac OS X support */
    width: 0;
}
.v-sidebar-menu {
    @include themify($themes) {
        background-color: themed('sidebar-background-color');
    }
    top: $navbar-height;
    height: calc(100vh - #{$navbar-height})
}
.vsm--title, .vsm--header {
    @include themify($themes) {
        color: themed('textColor');
    }
}
.v-sidebar-menu .vsm--dropdown>.vsm--list {
    @include themify($themes) {
        background-color: themed('sidebar-dropdown-background-color');
    }
}
.v-sidebar-menu .vsm--icon {
    @include themify($themes) {
        background-color: themed('sidebar-icon-background-color');
    }
}
.v-sidebar-menu .vsm--link.vsm--link_active .vsm--icon {
    @include themify($themes) {
        background-color: themed('sidebar-icon-background-color');
    }
}
.icon-sidebar {
    padding: 2px;
    @include themify($themes) {
        stroke: themed('textColor');
    }
    stroke-width: 3px;
    fill: none;
    height: 30px !important;
}
.v-sidebar-menu .vsm--toggle-btn {
    @include themify($themes) {
        background-color: themed('sidebar-icon-background-color');
    }
}

</style>