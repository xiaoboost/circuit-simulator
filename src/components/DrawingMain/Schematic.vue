<template>
<section class="drawing-main" :style="background">
    <svg height="100%" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
        </g>
    </svg>
</section>
</template>

<script>
import part from '@/components/ElectronicPart';
import line from '@/components/ElectronicLine';

import { $P } from '@/libraries/point';

export default {
    name: 'DrawingMain',
    // components: { part, line },
    data() {
        return {
            zoom: 1,
            position: $P(0, 0)
        };
    },
    computed: {
        background() {
            const bias = [
                this.position[0] % (this.zoom * 20),
                this.position[1] % (this.zoom * 20)
            ];

            return {
                'background-size': `${this.zoom * 20}px`,
                'background-position': `${bias[0]}px ${bias[1]}px`
            };
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
        }
    },
    mounted() {
        this.$el.addEventListener('mousewheel', (e) => this.mousewheel(e));
    }
};
</script>
