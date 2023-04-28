<script setup lang="ts">
import { computed } from 'vue';
import useFocusStore from '../../../../store/focus';
import FillPicker from '../input/fill.vue';
import RoundedCorners from './forms/rounded-corners.vue';
import GridPropertiesComponent from './forms/grid-properties.vue';
import { Shape } from 'konva/lib/Shape';

const focusStore = useFocusStore();
const shape = computed(() => focusStore.action!.shape!);
const isRect = computed(() => shape.value.className == 'Rect');
</script>

<template>
    <div class="defaultProperties">
        <FillPicker />
        <div class="label" v-if="isRect">
            <h5>Propriedades da forma</h5>
            <GridPropertiesComponent x="3" y="2">
                <RoundedCorners :shape="(shape as Shape)" />
            </GridPropertiesComponent>
        </div>
    </div>
</template>
