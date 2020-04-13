import {ElementContainer} from '../element-container';
import {CacheStorage} from '../../core/cache-storage';
import {TransformType} from '../../css/layout/bounds';

export class SVGElementContainer extends ElementContainer {
    svg: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(img: SVGSVGElement, transformFromFather: TransformType) {
        super(img, transformFromFather);
        const s = new XMLSerializer();
        this.svg = `data:image/svg+xml,${encodeURIComponent(s.serializeToString(img))}`;
        this.intrinsicWidth = img.width.baseVal.value;
        this.intrinsicHeight = img.height.baseVal.value;

        CacheStorage.getInstance().addImage(this.svg);
    }
}
