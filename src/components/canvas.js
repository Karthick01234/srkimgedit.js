"use strict";
import { PluginManager } from "./pluginmanager.js";

class Canvas extends PluginManager {
  /** @type {HTMLCanvasElement} */
  canvas;
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /**
   * @public Create Canvas Object to apply all the plugins
   * @param {{canvas:HTMLCanvasElement, width:number, height:number}} CanvasParameter - - Optional Parmeters if canvas element not passed
   * creates a new canvas element with provided width and height or default width and height if width and height is not passed.
   */
  constructor({ canvas = undefined, width = 320, height = 240 } = {}) {
    super();
    this.canvas =
      canvas instanceof HTMLCanvasElement
        ? canvas
        : this.#createCanvas(width, height);
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error("Failed to get 2D context from the canvas.");
    }
  }
  /**
   *
   * @param {number} width
   * @param {number} height
   * @returns HTMLCanvasElemnt.
   */
  #createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  /**
   * @public Function to get associated canvas from the canvas object
   * @returns HTMLCanvasElement.
   */
  getCanvas() {
    return this.canvas;
  }
  /**
   * @public
   * Function to draw image on canvas
   * @param {string} ImagePath - Path to the image want to draw on canvas element.
   * @param { {
   * fitCanvastoImage: boolean,
   * fitImagetoCanvas: boolean,
   * width: number,
   * height: number
   * }} options - option to resize the canvas to fit a image or vice versa or manually provide the width and height for the image.
   * @returns void if success otherwise raise exception if drawing image in the canvas element is failed.
   */
  drawImage(
    path,
    {
      fitCanvastoImage = false,
      fitImagetoCanvas = false,
      width = 320,
      height = 240,
    } = {}
  ) {
    this.path = path;
    return new Promise((resolve, reject) => {
      if (!this.path || this.path.trim().length == 0) {
        resolve(new Error("ImagePath Cannot be null or empty values"));
      }
      const img = new Image();
      img.src = path;
      img.onload = () => {
        if (fitCanvastoImage) {
          const maxWidth = window.innerWidth;
          const maxHeight = window.innerHeight;

          const scale = Math.min(
            maxWidth / img.naturalWidth,
            maxHeight / img.naturalHeight
          );

          const width =
            img.naturalWidth >= maxWidth
              ? img.naturalWidth * scale
              : img.naturalWidth;
          const height =
            img.naturalHeight >= maxHeight
              ? img.naturalHeight * scale
              : img.naturalHeight;

          this.canvas.width = width;
          this.canvas.height = height;
          this.ctx.drawImage(img, 0, 0, width, height);
        } else if (fitImagetoCanvas) {
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        } else {
          this.ctx.drawImage(img, 0, 0, width, height);
        }
        resolve();
      };
      img.onerror = (err) => {
        reject(new Error(err));
      };
    });
  }
  /**
   * @public Function to download the image from canvas
   * @param {string} name  - name for the downloadable image
   */
  downloadImage(name) {
    const dataUrl = this.canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${name}.png`;
    link.click();
  }
}

export { Canvas };
