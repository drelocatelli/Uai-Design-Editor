<script setup lang="ts">
import { computed, onMounted } from 'vue';
import TriggerEvents from '../../class/triggers';
import useFocusStore from '../../store/focus';
import useStatusStore from '../../store/status';

const focusStore = useFocusStore();
const statusStore = useStatusStore();
const paintMode = computed(() => statusStore.paint.paintMode);

onMounted(() => {
    new TriggerEvents();
});

const setFocus = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    focusStore.setFocus(target);
};
</script>

<template>
    <div id="environment" ref="environment" :onclick="setFocus" tabindex="0" >
        <div class="paper">
            <div id="canvas" :style="paintMode ? { cursor: 'crosshair' } : {}"></div>
        </div>
    </div>
</template>
