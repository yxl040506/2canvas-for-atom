import {ElementContainer} from '../element-container';
import {TransformType} from '../../css/layout/bounds';
export class TextareaElementContainer extends ElementContainer {
    readonly value: string;
    constructor(element: HTMLTextAreaElement, transformFromFather: TransformType) {
        super(element, transformFromFather);
        this.value = element.value;
    }
}
