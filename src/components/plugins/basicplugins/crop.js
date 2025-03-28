"use strict";

let x = 0;
let y = 0;
let width = 0;
let height = 0;
let color = "";
let lineWidth = 0;
/**
 * @type { HTMLCanvasElement }
 */
let canvas;
/**
 * @type { CanvasRenderingContext2D }
 */
let ctx;
let path = "";
let ltcircleX = 0;
let ltcircleY = 0;
let rtcircleX = 0;
let rtcircleY = 0;
let rbcircleX = 0;
let rbcircleY = 0;
let lbcircleX = 0;
let lbcircleY = 0;
let ltrtcircleX = 0;
let ltrtcircleY = 0;
let rtrbcircleX = 0;
let rtrbcircleY = 0;
let rblbcircleX = 0;
let rblbcircleY = 0;
let lbltcircleX = 0;
let lbltcircleY = 0;
let radius = 8;
let borders = false;
let pointX = 0;
let pointY = 0;
let isdrag = false;
let doc = false;
let cropped = false;

const setBackground = () => {
  canvas.style.backgroundImage = `url(${path})`;
  canvas.style.backgroundSize = "cover";
  canvas.style.backgroundPosition = "center";
  canvas.style.backgroundRepeat = "no-repeat";
};

const drawRectangle = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, width, height);
};

const calculatePoints = () => {
  ltcircleX = x;
  ltcircleY = y;
  rtcircleX = x + width;
  rtcircleY = y;
  rbcircleX = x + width;
  rbcircleY = y + height;
  lbcircleX = x;
  lbcircleY = y + height;
  if (borders) {
    ltrtcircleX = (ltcircleX + rtcircleX) / 2;
    ltrtcircleY = (ltcircleY + rtcircleY) / 2;
    rtrbcircleX = (rtcircleX + rbcircleX) / 2;
    rtrbcircleY = (rtcircleY + rbcircleY) / 2;
    rblbcircleX = (rbcircleX + lbcircleX) / 2;
    rblbcircleY = (rbcircleY + lbcircleY) / 2;
    lbltcircleX = (lbcircleX + ltcircleX) / 2;
    lbltcircleY = (lbcircleY + ltcircleY) / 2;
  }
};

/**
 * @param {number} circleX
 * @param {number} circleY
 */
const drawCircle = (circleX, circleY) => {
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
/**
 * @param {number} moveX
 * @param {number} moveY
 * @param {number} lineX
 * @param {number} lineY
 */
const drawLine = (moveX, moveY, lineX, lineY) => {
  ctx.beginPath();
  ctx.moveTo(Math.round(moveX), Math.round(moveY));
  ctx.lineTo(Math.round(lineX), Math.round(lineY));
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
};
/**
 * @param {TouchEvent | MouseEvent} event
 */
const updateCoordinates = (event) => {
  const rect = canvas.getBoundingClientRect();
  if (event.type.startsWith("touch")) {
    if (event.touches.length > 0) {
      pointX = event.touches[0].clientX - rect.left;
      pointY = event.touches[0].clientY - rect.top;
    } else if (event.changedTouches.length > 0) {
      pointX = event.changedTouches[0].clientX - rect.left;
      pointY = event.changedTouches[0].clientY - rect.top;
    }
  } else {
    pointX = event.clientX - rect.left;
    pointY = event.clientY - rect.top;
  }
};
/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns true or false
 */
const chechPointinCircle = (x1, y1, x2, y2) => {
  const d = x2 - x1 + (y2 - y1);
  return d * d < radius * radius;
};

const drawCrop = () => {
  drawRectangle();
  calculatePoints();
  drawCircle(ltcircleX, ltcircleY);
  drawCircle(rtcircleX, rtcircleY);
  drawCircle(rbcircleX, rbcircleY);
  drawCircle(lbcircleX, lbcircleY);
  if (borders) {
    drawLine(ltrtcircleX, ltrtcircleY, rblbcircleX, rblbcircleY);
    drawLine(lbltcircleX, lbltcircleY, rtrbcircleX, rtrbcircleY);
  }
};
/**
 * @param {TouchEvent | MouseEvent} event
 */
const updateCrop = (event) => {
  event.preventDefault();
  if (isdrag) {
    updateCoordinates(event);
    if (
      pointX >= 0 &&
      pointX <= canvas.width &&
      pointY >= 0 &&
      pointY <= canvas.height
    ) {
      if (chechPointinCircle(ltcircleX, ltcircleY, pointX, pointY)) {
        width += x - pointX;
        height += y - pointY;
        x = pointX;
        y = pointY;
        drawCrop();
      } else if (
        chechPointinCircle(rtcircleX, rtcircleY, pointX, pointY) &&
        pointX > pointY
      ) {
        width = pointX - x;
        height -= pointY - y;
        y = pointY;
        drawCrop();
      } else if (chechPointinCircle(rbcircleX, rbcircleY, pointX, pointY)) {
        width = pointX - x;
        height = pointY - y;
        drawCrop();
      } else if (
        chechPointinCircle(lbcircleX, lbcircleY, pointX, pointY) &&
        pointX < pointY
      ) {
        height = pointY - y;
        width += x - pointX;
        x = pointX;
        drawCrop();
      }
    }
  }
};
/**
 * @param {TouchEvent | MouseEvent} event
 */
const setDrag = (event) => {
  event.preventDefault();
  isdrag = true;
};
const cancelDrag = () => {
  isdrag = false;
};
const setMDrag = () => {
  isdrag = true;
};

const detectTouchCrop = () => {
  canvas.addEventListener("touchstart", setDrag, { passive: false });
  canvas.addEventListener("touchmove", updateCrop, { passive: false });
  canvas.addEventListener("touchend", cancelDrag);
  canvas.addEventListener("touchcancel", cancelDrag);
};

const detectMouseCrop = () => {
  canvas.addEventListener("mousedown", setMDrag);
  canvas.addEventListener("mousemove", updateCrop);
  canvas.addEventListener("mouseup", cancelDrag);
};

const drawDoc = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLine(ltcircleX, ltcircleY, rtcircleX, rtcircleY);
  drawLine(rtcircleX, rtcircleY, rbcircleX, rbcircleY);
  drawLine(rbcircleX, rbcircleY, lbcircleX, lbcircleY);
  drawLine(lbcircleX, lbcircleY, ltcircleX, ltcircleY);
  drawCircle(ltcircleX, ltcircleY);
  drawCircle(rtcircleX, rtcircleY);
  drawCircle(rbcircleX, rbcircleY);
  drawCircle(lbcircleX, lbcircleY);
};
/**
 * @param {TouchEvent | MouseEvent} event
 */
const updatedocCrop = (event) => {
  event.preventDefault();
  if (isdrag) {
    updateCoordinates(event);
    if (
      pointX >= 0 &&
      pointX <= canvas.width &&
      pointY >= 0 &&
      pointY <= canvas.height
    ) {
      if (chechPointinCircle(ltcircleX, ltcircleY, pointX, pointY)) {
        ltcircleX = pointX;
        ltcircleY = pointY;
        drawDoc();
      } else if (
        chechPointinCircle(rtcircleX, rtcircleY, pointX, pointY) &&
        pointX > pointY
      ) {
        rtcircleX = pointX;
        rtcircleY = pointY;
        drawDoc();
      } else if (chechPointinCircle(rbcircleX, rbcircleY, pointX, pointY)) {
        rbcircleX = pointX;
        rbcircleY = pointY;
        drawDoc();
      } else if (
        chechPointinCircle(lbcircleX, lbcircleY, pointX, pointY) &&
        pointX < pointY
      ) {
        lbcircleX = pointX;
        lbcircleY = pointY;
        drawDoc();
      }
    }
  }
};

const detectdocMouseCrop = () => {
  canvas.addEventListener("mousedown", setMDrag);
  canvas.addEventListener("mousemove", updatedocCrop);
  canvas.addEventListener("mouseup", cancelDrag);
};

const detectdocTouchCrop = () => {
  canvas.addEventListener("touchstart", setDrag, { passive: false });
  canvas.addEventListener("touchmove", updatedocCrop, { passive: false });
  canvas.addEventListener("touchend", cancelDrag);
  canvas.addEventListener("touchcancel", cancelDrag);
};
/**
 * Function to apply crop
 * @param { {canvasToApplyCrop: HTMLCanvasElement, imagePathToApplyCrop: string, cropBorderColors: string, cropBorderLinewidth: number
 * listenForMouseInteraction: boolean, listenForTouchInteraction: boolean, insideBordersinCrop: boolean, isCropStyleDocument: boolean, cropBorderStyle: "Rectangle | Square" } } CropParams - Parameter Object to apply crop.
 */
const crop = ({
  canvasToApplyCrop = null,
  imagePathToApplyCrop = "",
  cropBorderColors = "white",
  cropBorderLinewidth = 2,
  listenForTouchInteraction = true,
  listenForMouseInteraction = true,
  insideBordersinCrop = true,
  isCropStyleDocument = false,
  cropBorderStyle = "Rectangle",
} = {}) => {
  if (!canvasToApplyCrop || imagePathToApplyCrop.trim() == 0) {
    throw new Error("Canvas or Image Path cannot be empty or null");
  }
  canvas = canvasToApplyCrop;
  ctx = canvas.getContext("2d");
  color = cropBorderColors;
  lineWidth = isCropStyleDocument ? 5 : cropBorderLinewidth;
  path = imagePathToApplyCrop;
  borders = insideBordersinCrop;
  doc = isCropStyleDocument;
  cropped = true;
  setBackground();
  width = canvas.width - 100;
  height =
    cropBorderStyle.toLowerCase() === "rectangle"
      ? canvas.height - 150
      : canvas.height - 100;
  x = (canvas.width - width) / 2;
  y = (canvas.height - height) / 2;
  radius += lineWidth;
  if (!isCropStyleDocument) {
    drawCrop();
    if (listenForTouchInteraction) detectTouchCrop();
    if (listenForMouseInteraction) detectMouseCrop();
  } else {
    borders = false;
    calculatePoints();
    drawDoc();
    if (listenForTouchInteraction) detectdocTouchCrop();
    if (listenForMouseInteraction) detectdocMouseCrop();
  }
};
const clearCanvas = () => {
  canvas.style.removeProperty("background-image");
  canvas.style.removeProperty("background-size");
  canvas.style.removeProperty("background-position");
  canvas.style.removeProperty("background-repeat");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
/**
 * @param {CanvasImageSource} img
 * @param {boolean} resizeCanvastoFitImage
 */
const cutImage = (img, resizeCanvastoFitImage) => {
  if (!doc) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(x, y, width, height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (resizeCanvastoFitImage) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.putImageData(
      data,
      (canvas.width - width) / 2,
      (canvas.height - height) / 2
    );
  } else {
    const polygon = [
      { x: ltcircleX, y: ltcircleY },
      { x: rtcircleX, y: rtcircleY },
      { x: rbcircleX, y: rbcircleY },
      { x: lbcircleX, y: lbcircleY },
    ];
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    function isPointInPolygon(u, v, polygon) {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x,
          yi = polygon[i].y;
        const xj = polygon[j].x,
          yj = polygon[j].y;

        const intersect =
          yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }

    for (let k = 0; k < canvas.height; k++) {
      for (let w = 0; w < canvas.width; w++) {
        const index = (k * canvas.width + w) * 4;

        if (!isPointInPolygon(w, k, polygon)) {
          data[index + 3] = 0;
        }
      }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }
};
const resetCrop = () => {
  canvas.removeEventListener("touchstart", setDrag, { passive: false });
  if (!doc) {
    canvas.removeEventListener("touchmove", updateCrop, { passive: false });
    canvas.removeEventListener("mousemove", updateCrop);
  } else {
    canvas.removeEventListener("touchmove", updatedocCrop, { passive: false });
    canvas.removeEventListener("mousemove", updatedocCrop);
  }
  canvas.removeEventListener("touchend", cancelDrag);
  canvas.removeEventListener("touchcancel", cancelDrag);
  canvas.removeEventListener("mousedown", setMDrag);
  canvas.removeEventListener("mouseup", cancelDrag);
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  color = "";
  lineWidth = 0;
  path = "";
  ltcircleX = 0;
  ltcircleY = 0;
  rtcircleX = 0;
  rtcircleY = 0;
  rbcircleX = 0;
  rbcircleY = 0;
  lbcircleX = 0;
  lbcircleY = 0;
  ltrtcircleX = 0;
  ltrtcircleY = 0;
  rtrbcircleX = 0;
  rtrbcircleY = 0;
  rblbcircleX = 0;
  rblbcircleY = 0;
  lbltcircleX = 0;
  lbltcircleY = 0;
  radius = 8;
  borders = false;
  pointX = 0;
  pointY = 0;
  isdrag = false;
  doc = false;
  cropped = false;
};
/**
 * @param {{resizeCanvasToFitImage: boolean}} CropParams - Parameter Object to apply crop.
 */
const cut = ({ resizeCanvasToFitImage = true } = {}) => {
  if (cropped) {
    clearCanvas();
    const img = new Image();
    img.src = path;
    img.onload = () => {
      cutImage(img, resizeCanvasToFitImage);
      resetCrop();
    };
  }
};

export { crop, cut };
