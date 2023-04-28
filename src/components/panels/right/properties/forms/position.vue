<script lang="ts" setup>
import { Shape } from 'konva/lib/Shape';
import { computed } from 'vue';

const props = defineProps({ shape: { required: true, type: Shape }, position: {required: true, type: String} });
const position = computed(() => props.shape.getPosition());

const setPosition = () => {};
</script>

<template>
    <div class="item" :title="`Posição eixo ${props.position}`">
        <label :for="`position-${props.position}`" style="font-size: 13px; opacity: .6;"> {{ props.position.toUpperCase() }} </label>
        <input :id="`position-${props.position}`" :value="position[(props.position) as any]" type="number">
    </div>
</template>
