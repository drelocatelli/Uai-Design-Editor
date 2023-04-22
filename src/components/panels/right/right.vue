<script setup lang="ts">
import './right.scss';
import { computed } from 'vue';
import useFocusStore from '../../../store/focus';
import TextShapeComponent from './properties/text.vue';
import DefaultShapeComponent from './properties/shape.vue';

const focusStore = useFocusStore();
const actions = computed(() => focusStore.action);

const setFocus = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    focusStore.setFocus(target);
}

</script>

<template>
    <div class="right panel" :onclick="setFocus">
        <template v-if="actions?.name != undefined">
            <h4 class="title">{{ actions.name }}</h4>
            <div class="box">
                <div class="shapes" v-if="actions.shape != undefined">
                    <template v-if="actions.shape.className == 'Text'">
                        <TextShapeComponent />
                    </template>
                    <template v-else-if="actions.shape.name() == 'shape'">
                        <DefaultShapeComponent />
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>