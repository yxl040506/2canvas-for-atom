import {ElementContainer} from '../element-container';
import {CacheStorage} from '../../core/cache-storage';
import {TransformType} from '../../css/layout/bounds';

export class ImageElementContainer extends ElementContainer {
    src: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(img: HTMLImageElement, transformFromFather: TransformType) {
        super(img, transformFromFather);
        this.src = img.currentSrc || img.src;
        this.intrinsicWidth = img.naturalWidth;
        this.intrinsicHeight = img.naturalHeight;
        CacheStorage.getInstance().addImage(this.src, img);
        // CacheStorage.getInstance().addImage(this.src);
    }
}
