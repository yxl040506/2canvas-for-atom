import {ElementContainer} from '../element-container';
import {TransformType} from '../../css/layout/bounds';

export class CanvasElementContainer extends ElementContainer {
    canvas: HTMLCanvasElement;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(canvas: HTMLCanvasElement, transformFromFather: TransformType) {
        super(canvas, transformFromFather);
        this.canvas = canvas;
        this.intrinsicWidth = canvas.width;
        this.intrinsicHeight = canvas.height;
    }
}
