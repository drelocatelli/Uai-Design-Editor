import { defineStore } from "pinia";
import { ref } from "vue";

type IMessage = string | null;

interface IPaint {
    paintMode: boolean;
    isDrawing: boolean;
    color: string;
}

const useStatusStore = defineStore('status', () => {
    const message = ref<IMessage>(null);
    const paint = ref<IPaint>({isDrawing: false, paintMode: false, color: '#000'});

    function setMessage(action: IMessage) {
        message.value = action;
    }

    function setBrushColor(payload: string) {
        paint.value.color = payload;
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

    return {message, paint, setMessage, togglePaintMode, setPaintMode, setIsDrawing, setBrushColor};
});

export default useStatusStore;