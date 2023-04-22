<script setup lang="ts">
import { computed, ref } from 'vue';
import useFocusStore from '../../../../store/focus';
import FillPicker from '../input/fill.vue';
import Constants from '../../../../class/constants';

const fontFamily = ref(null);
const focusStore = useFocusStore();
const shape = computed(() => focusStore.action!.shape!);
const availableFonts = Constants.availableFonts;

class Text {
    static changeText(e: Event) {
        const target = e.target as HTMLInputElement;
        shape.value.setAttr('text', target.value);
    }

    static changeFontSize(e: Event) {
        const target = e.target as HTMLInputElement;
        shape.value.setAttr('fontSize', target.value);
    }

    static changeFontFamily(e: Event) {
        const target = e.target as HTMLSelectElement;
        const selected = target.children[target.selectedIndex];
        shape.value.setAttr('fontFamily', (selected as any).value);
    }
}
</script>

<template>
    <div class="textProperties">
        <div class="label">
            <h5>Alterar texto</h5>
            <input
                type="text"
                @click="(e: any) => e.target.select()"
                :value="shape.attrs.text"
                :onblur="Text.changeText"
                :onkeyup="(e: KeyboardEvent) => {if(e.key == 'Enter') Text.changeText(e)}"
            />
            <h5>Font</h5>
            <select ref="fontFamily" :onchange="Text.changeFontFamily">
                <option v-for="(item, index) in availableFonts" :key="index" :value="item" :selected="shape.getAttr('fontFamily') == item">
                    {{ item }}
                </option>
            </select>
            <h5>Tamanho do texto</h5>
            <input type="number" :value="shape.getAttr('fontSize')" :oninput="Text.changeFontSize" />
        </div>
        <FillPicker :shape="shape" />
    </div>
</template>
