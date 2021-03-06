import {parseBounds, parseDocumentSize} from './css/layout/bounds';
// import {color, Color, COLORS, isTransparent} from './css/types/color';
// import {color, Color} from './css/types/color';
// import {Parser} from './css/syntax/parser';
import {CloneOptions} from './dom/document-cloner';
import {isBodyElement, isHTMLElement, parseTree, getTransformObj} from './dom/node-parser';
import {Logger} from './core/logger';
import {CacheStorage, ResourceOptions} from './core/cache-storage';
import {CanvasRenderer, RenderOptions} from './render/canvas/canvas-renderer';
import {ForeignObjectRenderer} from './render/canvas/foreignobject-renderer';
// let cloneCached:any = {};
export type Options = CloneOptions &
    RenderOptions &
    ResourceOptions & {
        backgroundColor: string | null;
        foreignObjectRendering: boolean;
        logging: boolean;
        removeContainer?: boolean;
    } & {
        className?: string;
    };

// const parseColor = (value: string): Color => color.parse(Parser.create(value).parseComponentValue());

const html2canvas = (element: HTMLElement, options: Partial<Options> = {}): Promise<HTMLCanvasElement> => {
    return renderElement(element, options);
};

export default html2canvas;

if (typeof window !== "undefined") {
    CacheStorage.setContext(window);
}

const renderElement = async (element: HTMLElement, opts: Partial<Options>): Promise<HTMLCanvasElement> => {
    const ownerDocument = element.ownerDocument;

    if (!ownerDocument) {
        throw new Error(`Element is not attached to a Document`);
    }

    const defaultView = ownerDocument.defaultView;

    if (!defaultView) {
        throw new Error(`Document is not attached to a Window`);
    }

    const instanceName = (Math.round(Math.random() * 1000) + Date.now()).toString(16);

    const transform = getTransformObj(element);

    const {width, height, left, top} =
        isBodyElement(element) || isHTMLElement(element)
            ? parseDocumentSize(ownerDocument)
            : parseBounds(element, transform);

    const defaultResourceOptions = {
        allowTaint: false,
        imageTimeout: 15000,
        proxy: undefined,
        useCORS: false
    };

    const resourceOptions: ResourceOptions = {...defaultResourceOptions, ...opts};

    const defaultOptions = {
        backgroundColor: '#ffffff',
        cache: opts.cache ? opts.cache : CacheStorage.create(instanceName, resourceOptions),
        logging: true,
        removeContainer: true,
        foreignObjectRendering: false,
        scale: defaultView.devicePixelRatio || 1,
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight,
        scrollX: defaultView.pageXOffset,
        scrollY: defaultView.pageYOffset,
        x: left,
        y: top,
        width: Math.ceil(width),
        height: Math.ceil(height),
        id: instanceName
    };
    const options: Options = {...defaultOptions, ...resourceOptions, ...opts};
    // const className = options.className;

    // const windowBounds = new Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);

    Logger.create({id: instanceName, enabled: options.logging});
    Logger.getInstance(instanceName).debug(`Starting document clone`);
    // start---------280ms-----------
    // const classNameTemp = (className || '') as any;
    // if (!(document.getElementsByClassName(classNameTemp).length > 0) || !cloneCached[classNameTemp]) {
    //     const documentCloner = new DocumentCloner(element, {
    //         id: instanceName,
    //         onclone: options.onclone,
    //         ignoreElements: options.ignoreElements,
    //         inlineImages: options.foreignObjectRendering,
    //         copyStyles: options.foreignObjectRendering
    //     });
    //     cloneCached[classNameTemp] = documentCloner;
    // }
    // let documentCloner = cloneCached[classNameTemp] as DocumentCloner;
    // end ----------280ms-----------
    // const clonedElement = documentCloner.clonedReferenceElement;
    // if (!clonedElement) {
    //     return Promise.reject(`Unable to find element in cloned iframe`);
    // }
    // const container = await documentCloner.toIFrame(ownerDocument, windowBounds, className);
    // http://www.w3.org/TR/css3-background/#special-backgrounds
    // const documentBackgroundColor = ownerDocument.documentElement
    //     ? parseColor(getComputedStyle(ownerDocument.documentElement).backgroundColor as string)
    //     : COLORS.TRANSPARENT;
    // const bodyBackgroundColor = ownerDocument.body
    //     ? parseColor(getComputedStyle(ownerDocument.body).backgroundColor as string)
    //     : COLORS.TRANSPARENT;

    // const bgColor = opts.backgroundColor;
    // const defaultBackgroundColor =
    //     typeof bgColor === 'string' ? parseColor(bgColor) : bgColor === null ? COLORS.TRANSPARENT : 0xffffffff;

    const backgroundColor = null;
    //     element === ownerDocument.documentElement
    //         ? isTransparent(documentBackgroundColor)
    //             ? isTransparent(bodyBackgroundColor)
    //                 ? defaultBackgroundColor
    //                 : bodyBackgroundColor
    //             : documentBackgroundColor
    //         : defaultBackgroundColor;

    const renderOptions = {
        id: instanceName,
        cache: options.cache,
        canvas: options.canvas,
        backgroundColor,
        scale: options.scale,
        x: options.x,
        y: options.y,
        scrollX: options.scrollX,
        scrollY: options.scrollY,
        width: options.width,
        height: options.height,
        windowWidth: options.windowWidth,
        windowHeight: options.windowHeight
    };

    let canvas;
    if (options.foreignObjectRendering) {
        Logger.getInstance(instanceName).debug(`hahahahaDocument cloned, using foreign object rendering`);
        const renderer = new ForeignObjectRenderer(renderOptions);
        canvas = await renderer.render(element);
    } else {
        Logger.getInstance(instanceName).debug(`hahahDocument cloned, using computed rendering`);

        CacheStorage.attachInstance(options.cache);
        Logger.getInstance(instanceName).debug(`Starting DOM parsing`);
        const root = parseTree(element, options.ignoreElements);

        CacheStorage.detachInstance();

        // if (backgroundColor === root.styles.backgroundColor) {
        //     root.styles.backgroundColor = COLORS.TRANSPARENT;
        // }

        Logger.getInstance(instanceName).debug(`Starting renderer`);

        const renderer = new CanvasRenderer(renderOptions);
        canvas = await renderer.render(root);
    }

    if (options.removeContainer === true) {
        // if (!DocumentCloner.destroy(container)) {
        //     Logger.getInstance(instanceName).error(`Cannot detach cloned iframe as it is not in the DOM anymore`);
        // }
    }

    Logger.getInstance(instanceName).debug(`Finished rendering`);
    Logger.destroy(instanceName);
    CacheStorage.destroy(instanceName);
    return canvas;
};
