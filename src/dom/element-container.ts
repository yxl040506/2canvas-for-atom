import {CSSParsedDeclaration} from '../css/index';
import {TextContainer} from './text-container';
import {Bounds, parseBounds} from '../css/layout/bounds';
import {isHTMLElementNode} from './node-parser';
type cacheTransformType = string | null;
type cacheTransitionType = string | null;
import {TransformType} from '../css/layout/bounds';
export const enum FLAGS {
    CREATES_STACKING_CONTEXT = 1 << 1,
    CREATES_REAL_STACKING_CONTEXT = 1 << 2,
    IS_LIST_OWNER = 1 << 3
}

export class ElementContainer {
    readonly styles: CSSParsedDeclaration;
    readonly textNodes: TextContainer[];
    readonly elements: ElementContainer[];
    element: Element;
    bounds: Bounds;
    flags: number;
    cacheTransform: cacheTransformType = null;
    cacheTransition: cacheTransitionType = null;
    constructor(element: Element, transform: TransformType) {
        this.element = element;
        this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));
        this.textNodes = [];
        this.elements = [];
        if (this.styles.transform !== null && isHTMLElementNode(element)) {
            // getBoundingClientRect takes transforms into account
            // this.cacheTransform = element.style.transform;
            this.cacheTransition = element.style.transition;
            // element.style.transform = 'none';
            element.style.transition = 'none';
        }
        this.bounds = parseBounds(element, transform);
        // 应该等到子dom都parse完，才能把transform置回原值
        // if (this.cacheTransform !== null && isHTMLElementNode(element)) {
        //     element.style.transform = this.cacheTransform;
        // }
        this.flags = 0;
    }
}
