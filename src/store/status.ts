import { defineStore } from "pinia";
import { ref } from "vue";

type IMessage = string | null;

interface IPaint {
    paintMode: boolean;
    isDrawing: boolean;
}

const useStatusStore = defineStore('status', () => {
    const message = ref<IMessage>(null);
    const paint = ref<IPaint>({isDrawing: false, paintMode: false});

    function setMessage(action: IMessage) {
        message.value = action;
    }

    function togglePaintMode() {
        paint.value.paintMode = !paint.value.paintMode;
    }

    function setPaintMode(action: boolean) {
        paint.value.paintMode = action;
    }

    function setIsDrawing(action: boolean) {
        paint.value.isDrawing = action;
    }

    return {message, paint, setMessage, togglePaintMode, setPaintMode, setIsDrawing};
});

export default useStatusStore;