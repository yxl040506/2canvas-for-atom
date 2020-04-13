import {CSSParsedDeclaration} from '../css/index';
import {ElementContainer, FLAGS} from './element-container';
import {TextContainer} from './text-container';
import {ImageElementContainer} from './replaced-elements/image-element-container';
import {CanvasElementContainer} from './replaced-elements/canvas-element-container';
import {SVGElementContainer} from './replaced-elements/svg-element-container';
import {LIElementContainer} from './elements/li-element-container';
import {OLElementContainer} from './elements/ol-element-container';
import {InputElementContainer} from './replaced-elements/input-element-container';
import {SelectElementContainer} from './elements/select-element-container';
import {TextareaElementContainer} from './elements/textarea-element-container';
import {IFrameElementContainer} from './replaced-elements/iframe-element-container';

const LIST_OWNERS = ['OL', 'UL', 'MENU'];
import {TransformType} from '../css/layout/bounds';
const parseNodeTree = (
    node: Node,
    parent: ElementContainer,
    root: ElementContainer,
    ignoreElements?: (element: Element) => boolean,
    transformFromFather?: TransformType
) => {
    if (!transformFromFather) {
        transformFromFather = {
            translateX: 0,
            translateY: 0
        };
    }
    const {translateX: fatherTranslateX, translateY: fatherTranslateY} = transformFromFather;
    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        const childStyleTransform = getTransformObj(childNode as Element);
        const {translateX: childTranslateX, translateY: childTranslateY} = childStyleTransform;
        const transform = {
            translateX: childTranslateX + fatherTranslateX,
            translateY: childTranslateY + fatherTranslateY
        };
        nextNode = childNode.nextSibling;

        if (isTextNode(childNode) && childNode.data.trim().length > 0) {
            parent.textNodes.push(new TextContainer(childNode, parent.styles, transform));
        } else if (isElementNode(childNode)) {
            if (ignoreElements && ignoreElements(childNode)) {
                continue;
            }
            const container = createContainer(childNode, transform);
            if (container.styles.isVisible()) {
                if (createsRealStackingContext(childNode, container, root)) {
                    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
                } else if (createsStackingContext(container.styles)) {
                    container.flags |= FLAGS.CREATES_STACKING_CONTEXT;
                }
                if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
                    container.flags |= FLAGS.IS_LIST_OWNER;
                }
                parent.elements.push(container);
                if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {
                    parseNodeTree(childNode, container, root, ignoreElements, transform);
                }
            }
            resetTransformAfterParse(container);
        }
    }
};
export const formatTransform = (matrix: string) => {
    const pattern = /\((.*)\)/;
    const result = pattern.exec(matrix);
    if (result && result[1]) {
        const transform = result[1].split(',');
        const translateX = Number(transform[4]);
        const translateY = Number(transform[5]);
        return {translateX, translateY};
    }
    return {translateX: 0, translateY: 0};
};

const resetTransformAfterParse = (container: ElementContainer) => {
    try {
        // if (container.cacheTransform !== null && isHTMLElementNode(container.element)) {
        //     // getBoundingClientRect takes transforms into account
        //     container.element.style.transform = container.cacheTransform;
        // }
        if (container.cacheTransition !== null && isHTMLElementNode(container.element)) {
            // getBoundingClientRect takes transforms into account
            container.element.style.transition = container.cacheTransition;
        }
    } catch (err) {
        console.log('err in resetTransformAfterParse', err);
    }
};

const createContainer = (element: Element, transform: TransformType): ElementContainer => {
    if (isImageElement(element)) {
        return new ImageElementContainer(element, transform);
    }

    if (isCanvasElement(element)) {
        return new CanvasElementContainer(element, transform);
    }

    if (isSVGElement(element)) {
        return new SVGElementContainer(element, transform);
    }

    if (isLIElement(element)) {
        return new LIElementContainer(element, transform);
    }

    if (isOLElement(element)) {
        return new OLElementContainer(element, transform);
    }

    if (isInputElement(element)) {
        return new InputElementContainer(element, transform);
    }

    if (isSelectElement(element)) {
        return new SelectElementContainer(element, transform);
    }

    if (isTextareaElement(element)) {
        return new TextareaElementContainer(element, transform);
    }

    if (isIFrameElement(element)) {
        return new IFrameElementContainer(element, transform);
    }

    return new ElementContainer(element, transform);
};

export const getTransformObj = (element: Element) => {
    let transformStr = '';
    if (element instanceof Element) {
        transformStr = window.getComputedStyle(element)['transform'] || '';
    }
    const transform = formatTransform(transformStr);
    return transform;
};

export const parseTree = (element: HTMLElement, ignoreElements?: (element: Element) => boolean): ElementContainer => {
    const transformObject = getTransformObj(element);
    const container = createContainer(element, transformObject);
    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
    parseNodeTree(element, container, container, ignoreElements, transformObject);
    resetTransformAfterParse(container);
    return container;
};

const createsRealStackingContext = (node: Element, container: ElementContainer, root: ElementContainer): boolean => {
    return (
        container.styles.isPositionedWithZIndex() ||
        container.styles.opacity < 1 ||
        container.styles.isTransformed() ||
        (isBodyElement(node) && root.styles.isTransparent())
    );
};

const createsStackingContext = (styles: CSSParsedDeclaration): boolean => styles.isPositioned() || styles.isFloating();

export const isTextNode = (node: Node): node is Text => node.nodeType === Node.TEXT_NODE;
export const isElementNode = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
export const isHTMLElementNode = (node: Node): node is HTMLElement =>
    typeof (node as HTMLElement).style !== 'undefined';
export const isSVGElementNode = (element: Element): element is SVGElement =>
    typeof (element as SVGElement).className === 'object';
export const isLIElement = (node: Element): node is HTMLLIElement => node.tagName === 'LI';
export const isOLElement = (node: Element): node is HTMLOListElement => node.tagName === 'OL';
export const isInputElement = (node: Element): node is HTMLInputElement => node.tagName === 'INPUT';
export const isHTMLElement = (node: Element): node is HTMLHtmlElement => node.tagName === 'HTML';
export const isSVGElement = (node: Element): node is SVGSVGElement => node.tagName === 'svg';
export const isBodyElement = (node: Element): node is HTMLBodyElement => node.tagName === 'BODY';
export const isCanvasElement = (node: Element): node is HTMLCanvasElement => node.tagName === 'CANVAS';
export const isImageElement = (node: Element): node is HTMLImageElement => node.tagName === 'IMG';
export const isIFrameElement = (node: Element): node is HTMLIFrameElement => node.tagName === 'IFRAME';
export const isStyleElement = (node: Element): node is HTMLStyleElement => node.tagName === 'STYLE';
export const isScriptElement = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT';
export const isTextareaElement = (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA';
export const isSelectElement = (node: Element): node is HTMLSelectElement => node.tagName === 'SELECT';
