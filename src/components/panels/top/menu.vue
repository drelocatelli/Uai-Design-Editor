<script setup lang="ts">
import domtoimage from 'dom-to-image';
import { ElementType } from '../../../store/elements';
import useElementsStore from '../../../store/elements';
import { computed, onMounted, ref } from 'vue';
import useStatusStore from '../../../store/status';
import useFocusStore from '../../../store/focus';
import Konva from 'konva';
import Archive from '../../../utils/Archive';
import { Node } from 'konva/lib/Node';
import { NodeConfig } from 'konva/lib/Node';
import Constants from '../../../class/constants';

const ctxMenu = ref<number | undefined>(undefined);
const focusStore = useFocusStore();
const statusStore = useStatusStore();
const paintMode = computed(() => statusStore.paint.paintMode);

onMounted(() => {
    defineFocus();
    defineCtxMenuPosition();
    defineCtxMenuOnClick();
});

function defineFocus() {
    const top = document.querySelector('.top') as HTMLDivElement;
    top.addEventListener('click', () => {
        focusStore.setFocus(top);
    });
    top.addEventListener('blur', () => {
        ctxMenu.value = undefined;
    });
}

function defineCtxMenuPosition() {
    const topHeight = document.querySelector('.top.panel')?.clientHeight;
    const ctxMenus = document.querySelectorAll('.ctx-menu');
    ctxMenus.forEach((ctxMenu) => {
        (ctxMenu as HTMLDivElement).style.setProperty('top', `${topHeight ?? 40}px`);
    });
}

function defineCtxMenuOnClick() {
    const buttons = document.querySelectorAll('.top .button.icon');
    const ctxMenus = document.querySelectorAll('.ctx-menu');

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // if clicked on the same menu, then close
            if (ctxMenu.value != undefined && index == ctxMenu.value) {
                ctxMenu.value = undefined;
            } else {
                ctxMenu.value = index;
            }
        });
    });

    ctxMenus.forEach((ctxMenuEl) => {
        (ctxMenuEl as HTMLDivElement).addEventListener('click', () => {
            ctxMenu.value = undefined;
        });
    });
}

class CtxMenuOptions {
    static insertShape(type: ElementType) {
        switch (type) {
            // case 'paint':
            // to do
            // break;
            case 'text':
                useElementsStore().insertElement({ type: 'text', text: 'Insira seu texto...' });
                break;
            default:
                useElementsStore().insertElement({ type });
        }
    }

    static export(type: 'svg' | 'png' | 'jpeg') {
        const paper = document.querySelector('.paper') as Element;

        // remove active element style
        document.querySelectorAll('.element').forEach((element) => {
            element.classList.remove('active');
        });

        useStatusStore().setMessage(`Exportando ${type}...`);

        switch (type) {
            case 'jpeg':
                domtoimage
                    .toJpeg(paper)
                    .then((response) => {
                        createLink(response, 'jpg');
                        useStatusStore().setMessage(null);
                    })
                    .catch((err) => console.log(err));
                break;
            case 'svg':
                domtoimage
                    .toSvg(paper)
                    .then((response) => {
                        createLink(response, 'svg');
                        useStatusStore().setMessage(null);
                    })
                    .catch((err) => console.log(err));
                break;
            case 'png':
            default:
                domtoimage
                    .toPng(paper)
                    .then((response) => {
                        createLink(response, 'png');
                        useStatusStore().setMessage(null);
                    })
                    .catch((err) => console.log(err));
        }

        const createLink = (response: any, type: 'svg' | 'png' | 'jpg') => {
            const link = document.createElement('a');
            link.download = `UAIDesign_${Date.now()}.${type}`;
            link.href = response;
            link.click();
            console.log(response);
        };
    }

    static saveProject() {
        // save element properties on store
        const data = Konva.stages[0].toJSON();
        const dataJSON = JSON.parse(data)?.children[0]?.children;
        if(dataJSON) {
            const blobData = Archive.createBlob(JSON.stringify(dataJSON), 'application/json');
            Archive.download(`UAIDesign_${Date.now()}`, 'uai', blobData);
        }
    }

    static import() {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.addEventListener('change', () => {
            const file = input!.files![0];
            // Check if the file has a .json extension
            if (file.name.endsWith('.uai')) {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    const fileContent = reader.result;
                    let jsonData = JSON.parse(fileContent as any);
                    const shapes = jsonData as Node<NodeConfig>[];
                    const shapesElements = shapes.filter(shape => {
                        //@ts-ignore
                        const type = Constants.shapes[shape.className] == undefined ? shape.className : Constants.shapes[shape.className];
                        if(!Constants.ignoreShapes.includes(type)) {
                            (shape as any).type = type;
                            if(shape?.name) {
                                (shape as any).name = shape?.name;
                            }
                            (shape as any).action = 'import';
                            //@ts-ignore
                            delete shape.className;
                            return shape;
                        }
                    });
                    useElementsStore().setElements(shapesElements as any);
                };
            } else {
                useStatusStore().setMessage('Por favor selecione um arquivo com a extensão "uai".');
                setTimeout(() => {
                    useStatusStore().setMessage(null);
                }, 2000);
                // window.alert('Por favor selecione um arquivo com a extensão "uai".');
            }
        });
        input.remove();
    }

    static centerDocument() {
        const paper = document.querySelector('.paper') as HTMLDivElement;
        paper.style.setProperty('transform', 'scale(1) translate(0, 0)');
        console.log(paper);
    }

    static togglePaintMode() {
        if(!statusStore.paint.paintMode) {
            statusStore.setPaintMode(true);
            useElementsStore().insertElement({type: 'paint', action: 'create'});
        }
    }
}
</script>

<template>
    <div class="buttons">
        <div class="left">
            <div class="button icon" title="Inserir forma">
                <i class="fa-solid fa-shapes"></i>
            </div>
            <div class="button icon no-ctx" :class="paintMode ? 'active' : ''" title="Pintar" @click="CtxMenuOptions.togglePaintMode">
                <i class="fas fa-paint-brush"></i>
            </div>
            <div class="button icon" title="Inserir texto">
                <img src="assets/icons/Text.svg" draggable="false" />
            </div>

            <div class="ctx-menu" :style="{ display: ctxMenu == 0 ? 'block' : 'none' }">
                <li :onclick="() => CtxMenuOptions.insertShape('rectangle')">Retângulo</li>
                <li :onclick="() => CtxMenuOptions.insertShape('circle')">Círculo</li>
                <li :onclick="() => CtxMenuOptions.insertShape('triangle')">Triângulo</li>
            </div>

            <div class="ctx-menu" :style="{ display: ctxMenu == 2 ? 'block' : 'none' }">
                <li :onclick="() => CtxMenuOptions.insertShape('text')">Inserir texto</li>
            </div>
        </div>
        <div class="middle">
            {{ statusStore.message }}
        </div>
        <div class="right">
            <div class="button icon no-ctx" :onclick="CtxMenuOptions.saveProject" title="Salvar projeto">
                <i class="fas fa-save"></i>
            </div>

            <div class="button icon no-ctx" title="Importar projeto" :onclick="CtxMenuOptions.import">
                <i class="fas fa-upload"></i>
            </div>

            <div class="button icon" title="Exportar">
                <i class="fas fa-download"></i>
            </div>

            <div class="button icon no-ctx" title="Centralizar documento" :onclick="CtxMenuOptions.centerDocument">
                <i class="fas fa-square"></i>
            </div>

            <div class="ctx-menu" :style="{ display: ctxMenu == 5 ? 'block' : 'none' }">
                <li :onclick="() => CtxMenuOptions.export('png')">Exportar PNG</li>
                <li :onclick="() => CtxMenuOptions.export('svg')">Exportar SVG</li>
                <li :onclick="() => CtxMenuOptions.export('jpeg')">Exportar JPEG</li>
            </div>
        </div>
    </div>
</template>
