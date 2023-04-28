<script lang="ts" setup>
import { computed } from 'vue';
import useFocusStore from '../../../../../store/focus';

const props = defineProps({ position: {required: true, type: String} });

const focusStore = useFocusStore();
const shapePosition = computed(() => {
    //@ts-ignore
    return focusStore.action!.shape!.getPosition()[props.position]
});

const setPosition = () => {
    
};

</script>

<template>
    <div class="item" :title="`Posição eixo ${props.position}`">
        <label :for="`position-${props.position}`" style="font-size: 13px; opacity: .6;"> {{ props.position.toUpperCase() }} </label>
        <input :id="`position-${props.position}`" :value="shapePosition" type="number">
    </div>
</template>
