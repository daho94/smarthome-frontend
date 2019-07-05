<template>
    <section>
        <div v-bar="{
          preventParentScroll: true
        }">
            <div>
                <div class="icon-box">
                    <div v-for="(icon, idx) in icons" :key="idx" @click="select(icon)" :class="{'icon-selected': selected === icon}">
                        <squid-icon  :icon="icon" :style="{stroke: stroke || '#FFFFFF', fill: stroke || '#FFFFFF' }"/>
                        {{ icon }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

export default {
    name: "icon-selector",
    props: ["stroke"],
    data() {
        return {
            icons: [],
            selected: ""
        }
    },
    methods: {
        getFile() {
            const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'image/svg+xml'},
                credentials: 'include',
            }
            return fetch("/icons/squidink.svg", requestOptions)
                .then(r => r.text())
                .then(text => {
                    return text
                })
        },
        select(icon) {
            this.selected = icon
            this.$emit('select', icon)
        }
    },
    async mounted() {
        const parser = new DOMParser()
        const svg = await this.getFile()
        const doc = parser.parseFromString(svg, "image/svg+xml")

        this.icons = Array.from(doc.children[0].children).map(node => node.getAttribute("id"))
    }
}


</script>
<style>
.icon-box {
    display: flex;
    flex-flow: row wrap;
    font-size: 12px;
    justify-content: flex-start;
}
.icon-box > div {
    width: 60px;
    height: 80px;
    margin: 10px;
    cursor: pointer;
    text-align: center;
}
.icon-box > div > svg {
    height: calc(100% - 20px);
}
.icon-selected {
    filter: drop-shadow(0px 0px 2px #17a2b8) drop-shadow(0px 0px 2px #17a2b8) drop-shadow(0px 0px 4px #17a2b8);
}

</style>