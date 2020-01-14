<template>
    <sidebar-menu class="sidebar-menu" :menu="menu"  disable-hover @item-click="onItemClick" :collapsed="collapsed" @collapse="onCollapse">
        <span slot="toggle-icon"><squid-icon class="icon-sidebar-collapse" icon="side-arrow"/></span>
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
            const dashboardUrl = "/"
            let menu = [{
                header: true,
                title: "Dashboards",
                hiddenOnCollapse: true
            }]

            for (const dashboard of this.dashboards) {
                menu.push({
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

            return  menu
            
        }
    },
    methods: {
        onItemClick(event, item) {
            this.$emit("changeDashboard", item.dashboardId)
        },
        onCollapse (collapsed) {
            this.collapsed = collapsed
        },
    }
}
</script>

<style lang="scss">
::-webkit-scrollbar { /* for Mac OS X support */
    width: 0;
}
.v-sidebar-menu {
    background-color: $sidebar-background-color;
    top: $navbar-height;
    height: calc(100vh - #{$navbar-height})
}
.icon-sidebar {
    padding: 2px;
    stroke: $light-color;
    stroke-width: 3px;
    fill: none;
}
.icon-sidebar-collapse {
    width: 100%;
    stroke: $light-color;
}

</style>