<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './layers.scss';
import Sortable from 'sortablejs';
import useElementsStore from '../../../store/elements';
import HandleShapes from '../../../class/handleShapes';

const elementsStore = useElementsStore();
const elements = computed(() => [...elementsStore.elements]);
const listRef = ref(null);

onMounted(() => {
    if (listRef.value) {
        new Sortable(listRef.value, {
            animation: 150,
        });
    }
});

const selectElement = (e: MouseEvent) => {
    const target = (e.target as HTMLDivElement).closest('li') as HTMLLIElement;
    HandleShapes.select(target);
};

const setElementName = (e: MouseEvent) => {
    const target = (e.target as HTMLDivElement).closest('li');
    const titleIn = target?.querySelector('input.titleInput') as HTMLInputElement;
    titleIn.removeAttribute('disabled');
    titleIn.select();
    titleIn.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key == 'Enter') {
            saveTitle();
        }
    });
    titleIn.addEventListener('blur', () => saveTitle());

    const saveTitle = () => {
        const index = target!.dataset.elementidx;
        useElementsStore().setElementName(parseInt(index!), titleIn.value);
        titleIn.setAttribute('disabled', 'true');
    };
};
</script>

<template>
    <div class="layers">
        <h4 style="text-align: center; font-weight: 500">Camadas</h4>
        <div class="list" ref="listRef">
            <li v-for="(element, index) in elements" :data-element="JSON.stringify({ index, element })" :key="index" @click="selectElement">
                <div>
                    <input class="titleInput" type="text" :value="element?.name ?? element.type.concat(` #${index}`)" disabled />
                </div>
                <div @click="setElementName" class="edit-icon">
                    <i @click.stop title="Renomear" class="fas fa-marker"></i>
                </div>
            </li>
        </div>
    </div>
</template>
