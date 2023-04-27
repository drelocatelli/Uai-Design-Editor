<script setup lang="ts">
import { onMounted, ref } from 'vue';

const paper = ref();
const paperColor = ref("#ffffff");
const transparency = ref(100);

onMounted(() => {
    paper.value = document.querySelector('.paper') as HTMLDivElement;
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
    console.log(transparency);
    paper.value.style.setProperty('background-color', target.value);
    paperColor.value = target.value;
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
        <h5>Transparência</h5>
        <input style="margin-top:15px;" type="range" :value="transparency" :oninput="setPaperOpacity" />
    </div>
</template>
