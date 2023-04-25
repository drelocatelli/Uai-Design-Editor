import Konva from 'konva';
import Environment from './environment';
import useElementsStore, { ElementD } from '../store/elements';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import useFocusStore from '../store/focus';
import useStatusStore from '../store/status';
import { Node, NodeConfig } from 'konva/lib/Node';

class Trigger extends Environment {
    layer: Layer;
    stage: Stage;

    constructor() {
        super();
        this.stage = this.initStage();
        this.layer = this.newLayer();
        console.log(this.stage, this.layer);
        this.painting();
        this.shapeSelection();
        this.listenEvents();
        this.activateShapeProperties();
        this.listenHover();
        this.detectDeletion();
    }
    
    preventSelectionOnPaint() {
        const shapes = this.stage.find('.shape');
        if(shapes.length > 0) {
            shapes.forEach(shape => {
                shape.draggable(false);
            })
        }
    }

    painting() {
        const ref = this;
        const statusStore = useStatusStore();
        const stageRef = this.stage;
        const layerRef = this.layer;

        var lastLine: any;
        const elementStore = useElementsStore();

        statusStore.$subscribe((_, state) => {
            const isDrawing = state.paint.isDrawing;

            if (state.paint.paintMode) {
                this.stage.on('mousedown touchstart', function (e) {
                    statusStore.setIsDrawing(true);
                    var pos = stageRef?.getPointerPosition() ?? { x: 0, y: 0 };
                    lastLine = new Konva.Line({
                        stroke: 'black',
                        strokeWidth: 5,
                        globalCompositeOperation: 'source-over',
                        lineCap: 'round',
                        lineJoin: 'round',
                        points: [pos.x, pos.y],
                    });
                    layerRef.add(lastLine);
                });
    
                this.stage.on('mousemove touchmove', function (e) {
                    if (!state.paint.isDrawing) {
                        return;
                    }
                    ref.preventSelectionOnPaint();
    
                    e.evt.preventDefault();
                    var pos = stageRef?.getPointerPosition() ?? { x: 0, y: 0 };
                    var newPoints = lastLine.points().concat([pos.x, pos.y]);
                    lastLine.points(newPoints);
                    layerRef.batchDraw();
                });
    
                this.stage.on('mouseup touchend', function (e) {
                    statusStore.setIsDrawing(false);
                });

            }

        });
    }

    activateShapeProperties() {
        const focusStore = useFocusStore();
        this.stage.on('mouseup', (e) => {
            focusStore.setActionShape({ name: 'Propriedades', shape: e.target });
        });
    }

    detectDeletion() {
        // detect deletion
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Delete' || e.keyCode == 46) {
                const shape = useFocusStore().$state.action?.shape;
                if (shape?.hasName('shape')) {
                    const id = useFocusStore().$state.action?.shape?.attrs.id;
                    useElementsStore().removeElement(id);
                    useFocusStore().resetAction();
                    shape.remove();
                    this.stage.fire('click');
                }
            }
        });
    }

    initStage() {
        const stage = new Konva.Stage({
            container: '#canvas',
            width: this.canvas.offsetWidth,
            height: this.canvas.offsetHeight,
        });

        return stage;
    }

    listenHover() {
        const hoverRectangle = new Konva.Rect({
            name: 'hoverRectangle',
            stroke: '#25a3fc',
            visible: false,
            strokeWidth: 1,
        });

        this.layer.add(hoverRectangle);

        // hover events
        this.stage.on('mouseover', (e) => {
            const target = e.target;
            if (target?.attrs?.name?.includes('shape')) {
                const selectionRectangle = this.stage.findOne('.selectionRectangle');

                if (!selectionRectangle.visible()) {
                    const targetRect = target.getClientRect();
                    const hoverPadding = 1; // define the amount of padding to add
                    const paddedRect = {
                        x: targetRect.x - hoverPadding,
                        y: targetRect.y - hoverPadding,
                        width: targetRect.width + hoverPadding * 2,
                        height: targetRect.height + hoverPadding * 2,
                    };

                    hoverRectangle.visible(true);
                    hoverRectangle.width(paddedRect.width);
                    hoverRectangle.height(paddedRect.height);
                    hoverRectangle.position({ x: paddedRect.x, y: paddedRect.y });
                }
            } else {
                hoverRectangle.visible(false);
            }
        });

        this.stage.on('click', (e) => {
            hoverRectangle.visible(false);
        });

        this.stage.on('dragmove', (e) => {
            hoverRectangle.visible(false);
        });

        this.stage.on('mouseout', (e) => {
            const target = e.target;
            if (target?.attrs?.name?.includes('shape')) {
                hoverRectangle.visible(false);
            }
        });
    }

    listenEvents() {
        const elementStore = useElementsStore();
        elementStore.$subscribe((mutation, value) => {
            const newElement: ElementD = value.elements[value.elements.length - 1];
            if (newElement && newElement?.action == 'create') {
                const index = value.elements.length - 1;
                this.insertShape({ index, element: newElement });
                newElement.action = 'created';
            }

            // listen imports
            if (value.elements.some((el) => el.action == 'import')) {
                value.elements.forEach((element, index) => {
                    this.insertShape({ index, element });
                    element.action = 'imported';
                });
            }
        });
    }

    newLayer() {
        const layer = new Konva.Layer({
            name: 'first-layer',
            id: '0',
        });

        return layer;
    }

    insertShape(props: { index: number; element: ElementD }) {
        let defaultProps = {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            fill: '#487392',
            draggable: true,
            name: 'shape',
            id: props.index.toString(),
        };
        let shape;

        switch (props.element.type) {
            case 'text':
                shape = new Konva.Text(
                    props.element?.attrs
                        ? props.element.attrs
                        : {
                              ...defaultProps,
                              fill: '#000',
                              fontSize: 30,
                              text: props.element.text,
                              name: 'shape textShape',
                          },
                );
                break;
            case 'triangle':
                shape = new Konva.Line(
                    props.element?.attrs
                        ? props.element.attrs
                        : {
                              ...defaultProps,
                              points: [100, 50, 200, 150, 0, 150],
                              closed: true,
                              name: 'shape triangle',
                          },
                );
                break;
            case 'circle':
                shape = new Konva.Circle(
                    props.element?.attrs
                        ? props.element.attrs
                        : {
                              ...defaultProps,
                              y: 100,
                              x: 100,
                              name: 'shape circle',
                          },
                );
                break;
            case 'rectangle':
            default:
                shape = new Konva.Rect(
                    props.element?.attrs
                        ? props.element.attrs
                        : {
                              ...defaultProps,
                              name: 'shape rectangle',
                          },
                );
        }

        this.layer.add(shape);

        this.stage.add(this.layer);

        return shape;
    }

    shapeSelection() {
        let isPainting = false;

        // insert transform rotate, resize
        const tr = new Konva.Transformer({
            name: 'transform',
        });

        const stageRef = this.stage;

        // detect focus
        useFocusStore().$subscribe((_, value) => {
            if (value.action?.shape) {
                const shape = value.action.shape;
                const isTextSelected = shape.attrs?.name?.includes('textShape');
                if (isTextSelected) {
                    tr.enabledAnchors(['middle-left', 'middle-right']);
                } else {
                    tr.enabledAnchors([
                        'top-left',
                        'top-center',
                        'top-right',
                        'middle-left',
                        'middle-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right',
                        'middle-top',
                    ]);
                }
            }
        });

        this.layer.add(tr);

        tr.nodes([]);

        let selectionRectangle = new Konva.Rect({
            name: 'selectionRectangle',
            fill: '#D9EAF6',
            stroke: '#0D99FF',
            visible: false,
            strokeWidth: 1,
        });
        this.layer.add(selectionRectangle);

        const stopSelect = () => {
            tr.nodes([]);
            selectionRectangle.visible(false);
        };

        // prevent selection on paint mode
        useStatusStore().$subscribe((mutation, value) => {
            isPainting = value.paint.paintMode;
        });

        var x1: number, y1: number, x2, y2;

        this.stage.on('mousedown touchstart', (e) => {
            // do nothing if we mousedown on any shape
            if (e.target !== this.stage) {
                return;
            }
            e.evt.preventDefault();
            x1 = this.stage.getPointerPosition()!.x;
            y1 = this.stage.getPointerPosition()!.y;
            x2 = this.stage.getPointerPosition()!.x;
            y2 = this.stage.getPointerPosition()!.y;

            selectionRectangle.visible(true);
            selectionRectangle.width(0);
            selectionRectangle.height(0);
        });

        this.stage.on('mousemove touchmove', (e) => {
            if (isPainting) {
                if (e.target.hasName('shape')) {
                    e.target.draggable(false);
                }
                return;
            } else {
                e.target.draggable(true);
            }
            // do nothing if we didn't start selection

            if (!selectionRectangle.visible()) {
                return;
            }

            e.evt.preventDefault();
            x2 = this.stage.getPointerPosition()!.x;
            y2 = this.stage.getPointerPosition()!.y;

            selectionRectangle.setAttrs({
                x: Math.min(x1, x2),
                y: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1),
            });
        });

        this.stage.on('mouseup touchend', (e) => {
            // selecting texts
            const textShapes = this.stage.find('.textShape');
            textShapes.forEach((text) => {
                let MIN_WIDTH = 20;
                text.on('transform', () => {
                    text.setAttrs({
                        width: Math.max(text.width() * text.scaleX(), MIN_WIDTH),
                        scaleX: 1,
                        scaleY: 1,
                    });
                });
            });
            // do nothing if we didn't start selection
            if (!selectionRectangle.visible()) {
                return;
            }
            e.evt.preventDefault();
            // update visibility in timeout, so we can check it in click event
            setTimeout(() => {
                selectionRectangle.visible(false);
            });

            const shapes = this.stage.find('.shape');
            const box = selectionRectangle.getClientRect();
            const selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
            tr.nodes(selected);
        });

        // clicks should select/deselect shapes
        this.stage.on('mousedown click tap', async function (e) {
            // if we are selecting with rect, do nothing
            if (selectionRectangle.visible()) {
                return;
            }

            if (e.target === stageRef) {
                tr.nodes([]);
                return;
            }

            // do nothing if clicked NOT on our rectangles
            if (!e.target.hasName('shape')) {
                return;
            }

            // do we pressed shift or ctrl?
            const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
            const isSelected = tr.nodes().indexOf(e.target) >= 0;

            if (!metaPressed && !isSelected) {
                // if no key pressed and the node is not selected
                // select just one
                tr.nodes([e.target]);
            } else if (metaPressed && isSelected) {
                // if we pressed keys and node was selected
                // we need to remove it from selection:
                const nodes = tr.nodes().slice(); // use slice to have new copy of array
                // remove node from array
                nodes.splice(nodes.indexOf(e.target), 1);
                tr.nodes(nodes);
            } else if (metaPressed && !isSelected) {
                // add the node into selection
                const nodes = tr.nodes().concat([e.target]);
                tr.nodes(nodes);
            }

            tr.moveToTop();
        });
    }
}

export default Trigger;
