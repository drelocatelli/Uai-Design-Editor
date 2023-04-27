import { Node, NodeConfig } from "konva/lib/Node";
import { defineStore } from "pinia";
import { ref } from "vue";
import Constants from "../class/constants";

interface IActionType {
    name: IActionName;
    shape?: IShape;
}

type IShape = Node<NodeConfig>;

type IActionName = 'Ações' | 'Propriedades' | 'Opções de pintura';

const useFocusStore = defineStore('focus', () => {
    const lastFocusElement = ref<HTMLElement | undefined>(undefined);
    const action = ref<IActionType | undefined>({name: 'Ações'});

    function setFocus(element: HTMLElement) {
        
        lastFocusElement.value = element;
    }
    
    function setActionShape(payload: IActionType) {
        if(!Constants.ignoreShapes.includes(payload.shape?.getClassName() as string)) {
            action.value = payload;
        } else {
            resetAction();
        }
    }

    function setAction(payload: IActionName) {
        action.value = {name: payload, shape: undefined};
    }

    function resetAction() {
        action.value = {name: 'Ações'};
    }

    return {action, lastFocusElement, setFocus, setActionShape, resetAction, setAction};
});

export type {IShape};
export default useFocusStore;