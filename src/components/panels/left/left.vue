<script setup lang="ts">
import useFocusStore from '../../../store/focus';
import LayersComponent from './layers.vue';

const focusStore = useFocusStore();

const setFocus = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    focusStore.setFocus(target);
}
</script>

<template>
    <div class="left panel" :onclick="setFocus">
        <a href="/">
            <div class="logo">Uai Design Editor</div>
        </a>
        <LayersComponent />
    </div>
</template>