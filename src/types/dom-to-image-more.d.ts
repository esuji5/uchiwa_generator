declare module 'dom-to-image-more' {
  export interface DomToImageOptions {
    quality?: number;
    width?: number;
    height?: number;
    style?: any;
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    cacheBust?: boolean;
  }

  export function toSvg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  export function toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  export function toBlob(node: HTMLElement, options?: DomToImageOptions): Promise<Blob>;
  export function toPixelData(node: HTMLElement, options?: DomToImageOptions): Promise<Uint8ClampedArray>;
  export function toCanvas(node: HTMLElement, options?: DomToImageOptions): Promise<HTMLCanvasElement>;

  export default {
    toSvg,
    toPng,
    toJpeg,
    toBlob,
    toPixelData,
    toCanvas
  };
}
