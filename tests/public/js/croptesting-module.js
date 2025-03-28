import { Canvas } from "../../../dist/srkimgedit.esm.js";

let obj = new Canvas();
const path = "/img/croptesting.jpg";
document.getElementById("container").appendChild(obj.getCanvas());
obj.drawImage(path, { fitImagetoCanvas: true });
document.getElementById("crop").addEventListener("click", () => {
  obj.applyPlugin("crop", {
    canvasToApplyCrop: obj.getCanvas(),
    imagePathToApplyCrop: path,
    isCropStyleDocument: true,
  });
});
document.getElementById("cut").addEventListener("click", () => {
  obj.applyPlugin("cut");
});
document.getElementById("download").addEventListener("click", () => {
  const date = new Date();
  obj.downloadImage(date.toISOString());
});
document.getElementById("testplugins").addEventListener("click", () => {
  console.log(obj.getAvailablePlugins());
  console.log(obj.getPluginParameter("crop"));
  console.log(obj.getPluginParameter("cut"));
});
