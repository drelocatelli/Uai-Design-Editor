<script setup lang="ts">
import { computed } from 'vue';
import useFocusStore from '../../../../store/focus';

const focusStore = useFocusStore();
const shape = computed(() => focusStore.action!.shape!);

const setFill = (e: Event) => {
    const target = e.target as HTMLInputElement;
    shape.value.setAttr('fill', target.value);
};

</script>

<template>
    <div class="label">
        <h5>Preenchimento</h5>
        <input class="fill" type="color" :value="shape.getAttr('fill')" :oninput="setFill" />
    </div>
</template>