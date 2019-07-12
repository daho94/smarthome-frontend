<template>
<section class="form-checkbox">
    <div>
        <label for="input-small">{{ model[0] }}:</label>
    </div>
    <div>
        <b-form-checkbox style="text-align:right;" switch :type="type" v-model="model[1].val" placeholder="model[1].val"></b-form-checkbox>
    </div>
</section>
</template>
<script>

export default {
    name: "form-checkbox",
    props: ["model", "type"],
    data () {
        return {}
    }
}
</script>
<style>
.form-checkbox {
    display: flex;
    flex-flow: row;
}
.form-checkbox > div {
    margin-left: 5px;
    margin-right: 5px;
    align-self: flex-start;
    width: 100%;
    text-align: left;
}
</style>