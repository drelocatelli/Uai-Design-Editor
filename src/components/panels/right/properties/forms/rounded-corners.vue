<script setup lang="ts">
import { Shape } from 'konva/lib/Shape';
import { computed } from 'vue';

const props = defineProps({ shape: { required: true, type: Shape } });
const cornerRadius = computed(() => props.shape.getAttr('cornerRadius') ?? 0);

const setRoundedCorners = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const radius = parseInt(target.value);
    const layer = props.shape.parent;
    props.shape.setAttrs({
        cornerRadius: radius,
        cornerRadiusTopLeft: radius,
        cornerRadiusTopRight: radius,
        cornerRadiusBottomLeft: radius,
        cornerRadiusBottomRight: radius,
    });
    (layer as any).batchDraw();
};
</script>

<template>
    <div class="item" title="Bordas arredondadas">
        <label for="border-radius" class="material-symbols-outlined"> rounded_corner </label>
        <input id="border-radius" :value="cornerRadius" type="number" min="0" max="100" :oninput="setRoundedCorners" />
    </div>
</template>
