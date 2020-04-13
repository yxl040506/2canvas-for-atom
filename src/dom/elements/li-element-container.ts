import {ElementContainer} from '../element-container';
import {TransformType} from '../../css/layout/bounds';
export class LIElementContainer extends ElementContainer {
    readonly value: number;

    constructor(element: HTMLLIElement, transformFromFather: TransformType) {
        super(element, transformFromFather);
        this.value = element.value;
    }
}
