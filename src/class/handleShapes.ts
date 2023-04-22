import Konva from "konva";
import { Node, NodeConfig } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Transform } from "konva/lib/Util";

class HandleShapes {
    static find(target: HTMLLIElement) {
        const stage = Konva.stages[0];
        const attributes = JSON.parse(target.dataset.element as string);
        const shape = stage.find(`.${attributes.element.type}`).find((el) => el.attrs.id == attributes.index);
        if (shape) {
            return {
                then: (callback: Function) => {
                    callback(stage, shape);
                },
            };
        }
    }

    static select(target: HTMLLIElement) {
        this.find(target)?.then((stage: Stage, shape: Node<NodeConfig>) => {
            const tr = stage.findOne('.transform');
            (tr as any).nodes([shape]);
        });
    }

}

export default HandleShapes;
