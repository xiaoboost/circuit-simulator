<template>
<g class="part">
    
</g>
</template>

<script>
import { $M } from '@/libraries/matrix';
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