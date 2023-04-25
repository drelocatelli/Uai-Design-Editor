<script setup lang="ts">
import { computed } from 'vue';
import useStatusStore from '../../../../store/status';

const statusStore = useStatusStore();
const color = computed(() => statusStore.paint.color); 

const setFill = (e: Event) => {
    const target = e.target as HTMLInputElement;
    statusStore.setBrushColor(target.value);
};

</script>

<template>
    <div class="brush">
        <div class="label">
            <h5>Preenchimento</h5>
            <input class="fill" type="color" :value="color" :oninput="setFill" />
        </div>
        <div class="label">
            <h5>Concluir pintura</h5>
            <div class="brush buttons">
                <button type="button" class="confirm" @click="statusStore.togglePaintMode">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        </div>
    </div>
</template>
