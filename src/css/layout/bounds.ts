// import {isHTMLElementNode} from '../../dom/node-parser';
export type TransformType = {translateY: number; translateX: number} | null;
export class Bounds {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
    }

    add(x: number, y: number, w: number, h: number): Bounds {
        return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);
    }

    static fromClientRect(clientRect: ClientRect, transformFromParent?: TransformType): Bounds {
        // if (node && isHTMLElementNode(node)) {
        if (transformFromParent) {
            const {translateY, translateX} = transformFromParent;
            return new Bounds(
                clientRect.left - translateX,
                clientRect.top - translateY,
                clientRect.width,
                clientRect.height
            );
        }
        // }
        return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
    }
}

export const parseBounds = (node: Element, transformFromFather: TransformType): Bounds => {
    return Bounds.fromClientRect(node.getBoundingClientRect(), transformFromFather);
};

export const parseDocumentSize = (document: Document): Bounds => {
    const body = document.body;
    const documentElement = document.documentElement;

    if (!body || !documentElement) {
        throw new Error(`Unable to get document size`);
    }
    const width = Math.max(
        Math.max(body.scrollWidth, documentElement.scrollWidth),
        Math.max(body.offsetWidth, documentElement.offsetWidth),
        Math.max(body.clientWidth, documentElement.clientWidth)
    );

    const height = Math.max(
        Math.max(body.scrollHeight, documentElement.scrollHeight),
        Math.max(body.offsetHeight, documentElement.offsetHeight),
        Math.max(body.clientHeight, documentElement.clientHeight)
    );

    return new Bounds(0, 0, width, height);
};
