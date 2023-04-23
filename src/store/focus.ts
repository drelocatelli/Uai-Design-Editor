import { Node, NodeConfig } from "konva/lib/Node";
import { defineStore } from "pinia";
import { ref } from "vue";

interface IActionType {
    name: IActionName;
    shape?: IShape;
}

type IShape = Node<NodeConfig>;

type IActionName = 'Ações' | 'Propriedades';

const useFocusStore = defineStore('focus', () => {
    const lastFocusElement = ref<HTMLElement | undefined>(undefined);
    const action = ref<IActionType | undefined>({name: 'Ações'});

    function setFocus(element: HTMLElement) {
        lastFocusElement.value = element;
    }

    function setActionShape(payload: IActionType) {
        action.value = payload;
    }

    function resetAction() {
        action.value = {name: 'Ações'};
    }

    return {action, lastFocusElement, setFocus, setActionShape, resetAction};
});

export type {IShape};
export default useFocusStore;