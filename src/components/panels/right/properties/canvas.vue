<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const paper = ref();
const paperColor = ref('#ffffff');
const transparencyIn = ref();
const transparency = ref(100);

onMounted(() => {
    paper.value = document.querySelector('.paper') as HTMLDivElement;
});

watch(() => paperColor.value, (value) => {
    const transparencyEl = (transparencyIn.value as HTMLDivElement);
    if(value == '#ffffff') {
        transparencyEl.style.setProperty('background-color', 'rgb(255 255 255 / 0%)');
    } else {
        transparencyEl.style.setProperty('background-color', paperColor.value);
    }
});

const generateBgColor = (element: HTMLElement, opacity: string) => {
    let currentBgColor = getComputedStyle(element).backgroundColor;
    let values = currentBgColor.replace(/[()]/g, '').replace(/rgba?/g, '').split(', ');
    if (values.length == 3) {
        values.push((parseFloat(opacity) / 100).toString());
    } else {
        values[3] = (parseFloat(opacity) / 100).toString();
    }
    return `rgba(${values.join()})`;
};

const setPaperColor = (e: Event) => {
    const target = e.target as HTMLInputElement;
    paper.value.style.setProperty('background-color', target.value);
    paperColor.value = target.value;
    transparency.value = 100;
};

const setPaperOpacity = (e: Event) => {
    const target = e.target as HTMLInputElement;
    transparency.value = parseFloat(target.value);
    const newBgColor = generateBgColor(paper.value, target.value);
    paper.value.style.setProperty('background-color', newBgColor);
};
</script>

<template>
    <div class="label">
        <h5>Cor da folha</h5>
        <input class="fill" type="color" :value="paperColor" :oninput="setPaperColor" />
        <div style="margin-top:1rem; display: flex; flex-direction: row; justify-content: space-between; align-items: center">
            <h5 class="no-margin">Nível de transparência</h5>
            <h5 class="no-margin">{{ transparency.toString().concat('%') }}</h5>
        </div>
        <div class="range-opacity">
            <input ref="transparencyIn" style="margin-top: 15px" type="range" :value="transparency" :oninput="setPaperOpacity" />
            
        </div>
    </div>
</template>
