<template>
<section class="drawing-main" :style="background" @mousewheel="mousewheel($event)">
    <svg height="100%" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <elec-part
                :ref="parts[i - 1].id"
                v-model="parts[i - 1]"
                v-for="i in parts.length"
                @setEvent="EventControler($event, parts[i - 1])">
                {{parts[i]}}
            </elec-part>
            <elec-line
                :ref="lines[i - 1].id"
                v-model="lines[i - 1]"
                v-for="i in lines.length"
                @setEvent="EventControler($event, lines[i - 1])">
            </elec-line>
        </g>
    </svg>
</section>
</template>

<script>
import Part from '@/components/ElectronicPart';
import Line from '@/components/ElectronicLine';

import { $P } from '@/libraries/point';

export default {
    name: 'DrawingMain',
    components: {
        'elec-part': Part,
        'elec-line': Line
    },
    data() {
        return {
            zoom: 1,
            position: $P(0, 0)
        };
    },
    computed: {
        background() {
            const size = this.zoom * 20,
                biasX = this.position[0] % size,
                biasY = this.position[1] % size;

            return {
                'background-size': `${size}px`,
                'background-position': `${biasX}px ${biasY}px`
            };
        },
        parts() {
            return this.$store.state.collection.Parts;
        },
        lines() {
            return this.$store.state.collection.Lines;
        }
    },
    methods: {
        mousewheel(e) {
            const mousePosition = $P(e.pageX, e.pageY);
            let size = this.zoom * 20;

            if (e.deltaY > 0) {
                size -= 5;
            } else if (e.deltaY < 0) {
                size += 5;
            }

            if (size < 20) {
                size = 20;
                return (true);
            }
            if (size > 80) {
                size = 80;
                return (true);
            }

            this.position = this.position
                .add(-1, mousePosition)
                .mul(size / this.zoom / 20)
                .add(mousePosition)
                .round(1);

            this.zoom = size / 20;
        },
        find(id) {
            return this.$refs[id];
        },
        EventControler(event) {
            debugger;
        }
    },
    mounted() {

    }
};
</script>
