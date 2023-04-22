<script setup lang="ts">
import { IShape } from '../../../../store/focus';

const props = defineProps({shape: {required: true}});
const shape = props.shape as IShape;

const setFill = (e: Event) => {
    const target = e.target as HTMLInputElement;
    shape.setAttr('fill', target.value);
};

</script>

<template>
    <div class="label">
        <h5>Preenchimento</h5>
        <input class="fill" type="color" :value="shape.getAttr('fill')" :oninput="setFill" />
    </div>
</template>