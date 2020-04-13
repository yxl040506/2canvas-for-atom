import {ElementContainer} from '../element-container';
import {TransformType} from '../../css/layout/bounds';
export class SelectElementContainer extends ElementContainer {
    readonly value: string;
    constructor(element: HTMLSelectElement, transformFromFather: TransformType) {
        super(element, transformFromFather);
        const option = element.options[element.selectedIndex || 0];
        this.value = option ? option.text || '' : '';
    }
}
