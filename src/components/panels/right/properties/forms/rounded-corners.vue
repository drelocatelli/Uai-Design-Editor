<script setup lang="ts">
import { Shape } from 'konva/lib/Shape';
import { computed } from 'vue';

const props = defineProps({ shape: { required: true, type: Shape } });
const cornerRadius = computed(() => props.shape.getAttr('cornerRadius') ?? 0);

const setRoundedCorners = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const radius = parseInt(target.value);
    const layer = props.shape.parent as any;
    props.shape.setAttrs({
        cornerRadius: radius,
        cornerRadiusTopLeft: radius,
        cornerRadiusTopRight: radius,
        cornerRadiusBottomLeft: radius,
        cornerRadiusBottomRight: radius,
    });

    layer.batchDraw();

    props.shape.on('transform', () => {
        const scaleX = props.shape.scaleX();
        const scaleY = props.shape.scaleY();

        // Calcule o raio do canto ajustado
        const cornerRadius = props.shape.getAttr('cornerRadius') / Math.max(scaleX, scaleY);

        // Ajuste as propriedades de raio de canto para corresponder à escala da forma
        props.shape.setAttrs({
            cornerRadius,
            cornerRadiusTopLeft: cornerRadius,
            cornerRadiusTopRight: cornerRadius,
            cornerRadiusBottomLeft: cornerRadius,
            cornerRadiusBottomRight: cornerRadius,
        });
        
    });
    
};
</script>

<template>
    <div class="item" title="Bordas arredondadas">
        <label for="border-radius" class="material-symbols-outlined"> rounded_corner </label>
        <input id="border-radius" :value="cornerRadius" type="number" min="0" max="100" :oninput="setRoundedCorners" />
    </div>
</template>
