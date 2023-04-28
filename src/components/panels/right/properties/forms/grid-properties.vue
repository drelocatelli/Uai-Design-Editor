<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const propsRef = ref();
const props = defineProps({x: {required: true, type: String}, y: {required: true, type: String}});

onMounted(() => {
    defineGrid();
    focusFx();
})

const defineGrid = () => {
    const [x, y] = [parseInt(props.x), parseInt(props.y)];
    (propsRef.value as HTMLDivElement).style.setProperty('grid-template-columns', `repeat(${x}, 1fr)`);
    (propsRef.value as HTMLDivElement).style.setProperty('grid-template-rows', `repeat(${y}, 1fr)`);
}

const focusFx = () => {
    
    Array.from((propsRef.value as HTMLDivElement).children).forEach(item => {
        const input = item.querySelector('input');
        const computedBorder = getComputedStyle(item).borderColor;

        input?.addEventListener('focus', (e) => {
            (item as HTMLDivElement).style.borderColor = '#71b0dd';
            console.log(input)
        });
        input?.addEventListener('blur', (e) => {
            (item as HTMLDivElement).style.setProperty('border-color', computedBorder);
            console.log('computedBorder', computedBorder)
        });
    });
}

</script>

<template>
    <div class="props" ref="propsRef">
        <slot />
    </div>
</template>