import {ElementContainer} from '../element-container';
import {TransformType} from '../../css/layout/bounds';
export class OLElementContainer extends ElementContainer {
    readonly start: number;
    readonly reversed: boolean;

    constructor(element: HTMLOListElement, transformFromFather: TransformType) {
        super(element, transformFromFather);
        this.start = element.start;
        this.reversed = typeof element.reversed === 'boolean' && element.reversed === true;
    }
}
