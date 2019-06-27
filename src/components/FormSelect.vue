<template>
    <section class="form-select">
        <div>
            <label for="input-small">{{ model[0] }}:</label>
        </div>
        <div>
            <b-form-select size="sm" v-model="model[1].val">
                <option v-for="(option, i) in model[1].options" v-bind:key="i" :value="option.value">{{ option.text }}</option>
            </b-form-select>
        </div>
    </section>
</template>
<script>

export default {
    name: "form-select",
    props: ["model", "type"],
    data () {
        return {}
    }
}
</script>
<style>
.form-select {
    display: flex;
    flex-flow: col;
}
.form-select > div {
    margin-left: 5px;
    margin-right: 5px;
    align-self: flex-start;
    width: 100%;
    text-align: left;
}
</style>