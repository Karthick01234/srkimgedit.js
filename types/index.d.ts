declare module "srkimgedit" {
  export type PluginNames = "crop" | "cut";

  export interface PluginOptions {
    crop: {
      canvasToApplyCrop: HTMLCanvasElement;
      imagePathToApplyCrop: CanvasRenderingContext2D;
      cropBorderColors: string;
      cropBorderLinewidth: number;
      listenForTouchInteraction: boolean;
      listenForMouseInteraction: boolean;
      insideBordersinCrop: boolean;
      isCropStyleDocument: boolean;
      cropBorderStyle: "Rectangle | Square";
    };
    cut: { resizeCanvasToFitImage: boolean };
  }

  export interface CanvasOptions {
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
  }

  export class Canvas {
    constructor(options?: CanvasOptions);

    getCanvas(): HTMLCanvasElement;

    drawImage(
      path: string,
      options?: {
        fitCanvastoImage?: boolean;
        fitImagetoCanvas?: boolean;
        width?: number;
        height?: number;
      }
    ): Promise<void>;

    applyPlugin<T extends PluginNames>(
      name: T,
      options: PluginOptions[T]
    ): void;

    downloadImage(name: string): void;
  }
}
