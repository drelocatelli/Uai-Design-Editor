<script setup lang="ts">
import FillPicker from '../input/fill.vue';
</script>

<template>
    <div class="brush">
        <FillPicker />
        <div class="label">
            <h5>Concluir pintura</h5>
            <div class="brush buttons">
                <button type="button" class="cancel">
                    <i class="fas fa-times"></i>
                </button>
                <button type="button" class="confirm">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        </div>
    </div>
</template>
