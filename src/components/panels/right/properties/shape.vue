<script setup lang="ts">
import { computed} from 'vue';
import useFocusStore from '../../../../store/focus';
import FillPicker from '../input/fill.vue';

const focusStore = useFocusStore();
const shape = computed(() => focusStore.action!.shape!);

</script>

<template>
    <div class="defaultProperties">
        <FillPicker />
    </div>
</template>
