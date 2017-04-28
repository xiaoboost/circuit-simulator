<template>
<text>
    <tspan>{{label[0]}}</tspan>
    <tspan dx="-3">{{label[1]}}</tspan>
</text>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: '',
            validator: (v) => (v.split('_').length === 2)
        }
    },
    computed: {
        label() {
            return this.id.split('_');
        }
    }
};
</script>
