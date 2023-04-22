import { defineStore } from "pinia";
import { CSSProperties, ref } from "vue";

interface ElementD {
    type: ElementType;
    action?: 'create' | 'update' | 'group' | 'import' | 'imported';
    attrs?: any;
    text?: string;
    name?: string;
}

type ElementType = 'rectangle' | 'circle' | 'triangle' | 'text';

const useElementsStore = defineStore('elements', () => {
    const elements = ref<ElementD[]>([]);
    const selectedElementIdx = ref<string | undefined>(undefined);
    
    function getElement(index: number) {
        const idx = elements.value.findIndex((el, i) => i == index);
        if(idx >= 0) {
            return {
                then: (callback: Function) => {
                    callback(elements.value[idx]);
                },
            }
        }
    }

    function setElementName(index: number, name: string) {
        getElement(index)?.then(() => {
            elements.value[index].name = name;
        });
    }
    
    function resetElements() {
        elements.value = [];
    }

    function setSelectedElement(index: string | undefined) {
        selectedElementIdx.value = index;
    }
    
    function insertElement(action: ElementD) {
        elements.value.push({...action, action: 'create'});
    }

    function setElements(payload: ElementD[]) {
        elements.value = payload;
    }

    function removeElement(index: number) {
        getElement(index)?.then((element: ElementD) => {
            elements.value.splice(index, 1)
        });
    }

    function setElementAttrs(index: number, style: CSSProperties) {
        getElement(index)?.then((element: ElementD) => {
            element.attrs = style;
        })
    }

    return {elements, selectedElementIdx, insertElement, removeElement, setSelectedElement, setElementAttrs, resetElements, setElementName, setElements}
});

export type {ElementD, ElementType};
export default useElementsStore;