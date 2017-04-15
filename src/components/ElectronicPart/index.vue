<template>
<section class="parts">
    
</section>
</template>

<script>
import { Electronics } from './shape';

export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        params: {
            type: Array,
            default: () => []
        },
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="stylus">
</style>