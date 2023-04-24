import Konva from "konva";
import { Node, NodeConfig } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import useFocusStore from "../store/focus";
import Constants from "./constants";

class Handle {
    static find(target: HTMLLIElement) {
        const stage = Konva.stages[0];
        const attributes = JSON.parse(target.dataset.element as string);
        if(attributes.element.type == 'text') {
            attributes.element.type = 'textShape'
        }
        const shape = stage.find(`.${attributes.element.type}`).find((el) => el.attrs.id == attributes.element.index);
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
            // set transform
            const tr = stage.findOne('.transform');
            (tr as any).nodes([shape]);
            // set action
            useFocusStore().setActionShape({name: 'Propriedades', shape});
        });
    }

    static async getInstalledFonts() : Promise<string[]> {
        try {
            if(!('queryLocalFonts' in window)) throw new Error('Não foi possível detectar fonts');
            const response = await (window as any).queryLocalFonts();
            const data = response.map((r: any) => r.family).reduce((unique: any, name: any) => {
                if (!unique.includes(name)) {
                    unique.push(name);
                  }
                  return unique;
            }, []);
            return [...Constants.availableFonts, ...data];
        } catch(err) {
            //@ts-ignore
            console.error(err.name, err.message);
            return Constants.availableFonts;
        }
    }

}

export default Handle;
