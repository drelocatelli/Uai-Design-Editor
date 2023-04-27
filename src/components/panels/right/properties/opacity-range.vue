<script lang="ts" setup>
const props = defineProps({oninput: {required: true, type: Function}, value: {required: true, type: String}});
</script>

<template>
    <div class="range-opacity">
        <input style="margin-top: 15px" type="range" :value="props.value" :oninput="props.oninput" />
    </div>
</template>
