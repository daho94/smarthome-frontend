<template>
<section class="form-input" :class="{'form-input-color': isColor}">
    <div>
        <label for="input-small">{{ model[0] }}:</label>
    </div>
    <div>
        <b-form-input size="sm" v-model="model[1].val" :type="type"></b-form-input> 
    </div>
</section>
</template>
<script>

export default {
    name: "form-input",
    props: ["model", "type"],
    data () {
        return {}
    },
    computed: {
        isColor: function() {
            return this.type === 'color'
        }
    }
}
</script>
<style>
.form-input {
    display: flex;
    flex-flow: column;
}
.form-input-color {
    flex-flow: row !important;
}
.form-input-color input {
    background: none;
    border: none;
}
.form-input-color input:focus {
    background: none;
    border: none;
    outline: none;
    box-shadow: none !important;
}
.form-input > div {
    margin-left: 5px;
    margin-right: 5px;
    align-self: flex-start;
    width: 100%;
    text-align: left;
}

</style>