import {CSSParsedDeclaration} from '../css/index';
import {TextContainer} from './text-container';
import {Bounds, parseBounds} from '../css/layout/bounds';
import {isHTMLElementNode} from './node-parser';
// type cacheTransformType = string | null;
export const enum FLAGS {
    CREATES_STACKING_CONTEXT = 1 << 1,
    CREATES_REAL_STACKING_CONTEXT = 1 << 2,
    IS_LIST_OWNER = 1 << 3
}

export class ElementContainer {
    readonly styles: CSSParsedDeclaration;
    readonly textNodes: TextContainer[];
    readonly elements: ElementContainer[];
    bounds: Bounds;
    flags: number;

    constructor(element: Element) {
        this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));
        this.textNodes = [];
        this.elements = [];
        // let cacheTransform: cacheTransformType = null;
        if (this.styles.transform !== null && isHTMLElementNode(element)) {
            // getBoundingClientRect takes transforms into account
            // cacheTransform = element.style.transform;
            element.style.transform = 'none';
        }
        this.bounds = parseBounds(element);
        // if (cacheTransform !== null && isHTMLElementNode(element)) {
        //     // getBoundingClientRect takes transforms into account
        //     element.style.transform = cacheTransform;
        // }
        this.flags = 0;
    }
}
