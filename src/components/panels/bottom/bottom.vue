<script lang="ts" setup>
import useFocusStore from '../../../store/focus';
import './bottom.scss';
import { ref } from 'vue';

const focusStore = useFocusStore();
const isOpen = ref<boolean>(false);

const setFocus = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    focusStore.setFocus(target);
}

const setIsOpen = () => {
    isOpen.value = !isOpen.value;
}

</script>

<template>
    <div class="bottom panel" :onclick="setFocus">
        <div class="title" :onclick="setIsOpen">
            <template :style="{display: isOpen ? 'inline-block': 'none'}">
                <i class="fas fa-caret-down"></i>
            </template>
            <template :style="{display: !isOpen ? 'inline-block': 'none'}">
                <i class="fas fa-caret-up"></i>
            </template>
            &nbsp;Linha do tempo
        </div>
        <div class="content" :style="{display: isOpen ? 'block' : 'none'}">
            content
        </div>
    </div>
</template>