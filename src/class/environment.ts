import interact from 'interactjs';
import useElementsStore from '../store/elements';

abstract class Environment {
    canvas: HTMLDivElement;
    paper: HTMLDivElement;
    environment: HTMLDivElement;

    constructor() {
        this.environment = document.querySelector('#environment') as HTMLDivElement;
        this.paper = this.environment.querySelector('.paper') as HTMLDivElement;
        this.canvas = this.environment.querySelector('#canvas') as HTMLDivElement;
        this.paper.style.transform = 'scale(1) translate(0px, 0px)';
        this.disableDefaultBrowserZoom();
        this.scale();
        this.positionPaper();
    }

    disableDefaultBrowserZoom() {
        document.addEventListener('keydown', function (e) {
            if (
                true &&
                e.ctrlKey &&
                //@ts-ignore
                (e.keyCode == '61' || e.keyCode == '107' || e.keyCode == '173' || e.keyCode == '109' || e.keyCode == '187' || e.keyCode == '189')
            ) {
                e.preventDefault();
            }
        });
        document.addEventListener(
            'wheel',
            function (e) {
                if (true && e.ctrlKey) {
                    e.preventDefault();
                }
            },
            {
                passive: false,
            },
        );
    }

    positionPaper() {
        const draggable = this.environment;
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code == 'Space') {
                interact(draggable).draggable({
                    modifiers: [
                        interact.modifiers.restrictRect({
                            // restriction: 'parent',
                            endOnly: true,
                        }),
                    ],
                    // enable autoScroll
                    autoScroll: true,

                    listeners: {
                        // call this function on every dragmove event
                        move: (event) => {
                            event.stopPropagation();
                            var target = event.target;
                            // keep the dragged position in the data-x/data-y attributes
                            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            // translate the element
                            this.paper.style.transform = this.paper.style.transform.replace(/translate\((.*?)\)/, `translate(${x}px, ${y}px)`);

                            // update the posiion attributes
                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                            return;
                        },
                    },
                });
                useElementsStore().setSelectedElement(undefined);
            }
        });
        document.addEventListener('keyup', function (event) {
            if (event.code === 'Space') {
                interact(draggable).unset();
            }
        });
    }

    scale() {
        // define min max scale
        const defineScales = {
            min: 0.5,
            max: 2,
        };
        let scaleKey = 1;
        // Add keydown and keyup event listeners to the window object
        window.addEventListener('keydown', (event) => {
            // Check if the Control key is pressed
            if (event.ctrlKey) {
                // The Control key is pressed
                if (event.key === '+' || event.keyCode === 187 || event.keyCode === 107) {
                    // The + key is pressed
                    // Increase the scale factor by 0.1
                    scaleKey += 0.1;
                } else if (event.key === '-' || event.keyCode === 189 || event.keyCode === 109) {
                    // The - key is pressed
                    // Decrease the scale factor by 0.1
                    scaleKey -= 0.1;
                }
                // Apply the new scale factor to the element
                scaleKey = Math.max(defineScales.min, Math.min(defineScales.max, scaleKey));
                this.paper.style.transform = `scale(${scaleKey})`;
                useElementsStore().setSelectedElement(undefined);
            }
        });
        this.environment.addEventListener('mousewheel', (event) => {
            if ((event as WheelEvent).ctrlKey) {
                // Get the current zoom scale
                let currentScale = parseFloat(this.paper.style.transform.replace('scale(', '').replace(')', ''));
                if (isNaN(currentScale)) {
                    currentScale = 1;
                }
                // Calculate the new zoom scale based on the direction of the scroll
                let newScale = (event as WheelEvent).deltaY > 0 ? currentScale * 0.8 : currentScale * 1.2;

                newScale = Math.max(defineScales.min, Math.min(defineScales.max, newScale));

                // Apply the new zoom scale to the element
                this.paper.style.transform = this.paper.style.transform.replace(/scale\([0-9|\.]*\)/, `scale(${newScale})`);
                useElementsStore().setSelectedElement(undefined);
            }
        });
    }

}

export default Environment;
