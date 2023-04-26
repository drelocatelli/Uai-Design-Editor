<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import './layers.scss';
import Sortable from 'sortablejs';
import useElementsStore from '../../../store/elements';
import HandleShapes from '../../../class/handle';
import useFocusStore from '../../../store/focus';
import Konva from 'konva';
import Constants from '../../../class/constants';

const elementsStore = useElementsStore();
const focusStore = useFocusStore();
const elements = computed(() => [...elementsStore.elements]);
const activeShapeAttr = computed((a) => focusStore.action?.shape && focusStore.action.shape);
const listRef = ref(null);

onMounted(() => {
    if (listRef.value) {
        new Sortable(listRef.value, {
            animation: 150,
            onUpdate: (evt) => {
                const indexes = {
                    oldIndex: evt.oldIndex!,
                    newIndex: evt.newIndex!,
                };
                const shape = Konva.stages[0]!.children![0].getChildren().filter(shape => !Constants.ignoreShapes.includes(shape.getClassName()) && !Constants.ignoreShapeNames.includes(shape.attrs.name))[indexes.oldIndex];
                const diff = indexes.newIndex - indexes.oldIndex;

                if (diff < 0) {
                    console.log(`O item foi movido ${Math.abs(diff)} posições para cima na lista.`, shape);
                    shape.setZIndex(shape.getZIndex() - Math.abs(diff));
                } else if (diff > 0) {
                    console.log(`O item foi movido ${diff} posições para baixo na lista.`, shape);
                    shape.setZIndex(shape.getZIndex() + Math.abs(diff));
                } else {
                    console.log('O item não foi movido na lista.', shape);
                }
            },
        });
    }
});

const isActiveShape = (name: string, index: number) => {
    name = name == 'text' ? 'textShape' : name;
    name = name == 'paint' ? 'paintShape' : name;
    let isActive = activeShapeAttr?.value?.name()?.endsWith(name) && activeShapeAttr.value.attrs.id == index;
    return isActive;
};

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
            <li
                :class="isActiveShape(element?.name ?? element.type, index) ? 'active' : ''"
                v-for="(element, index) in elements"
                :data-element="JSON.stringify({ index, element })"
                :key="index"
                @click="selectElement"
            >
                <div>
                    <input class="titleInput" type="text" :value="element?.name ?? element.type.concat(` #${index}`)" disabled />
                    {{ element.name }}
                </div>
                <div @click="setElementName" class="edit-icon">
                    <i @click.stop title="Renomear" class="fas fa-marker"></i>
                </div>
            </li>
        </div>
    </div>
</template>
