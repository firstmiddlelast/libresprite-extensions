(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateDeltaE = calculateDeltaE;
exports.labDistance = labDistance;
exports.labToRgb = labToRgb;
exports.rgbToLab = rgbToLab;
function calculateDeltaE(labColor1, labColor2) {
  const [L1, a1, b1] = labColor1;
  const [L2, a2, b2] = labColor2;
  const deltaL = L2 - L1;
  const deltaA = a2 - a1;
  const deltaB = b2 - b1;
  const deltaC = Math.sqrt(deltaA * deltaA + deltaB * deltaB);
  const deltaH = Math.sqrt(deltaC * deltaC - deltaL * deltaL);
  const meanL = (L1 + L2) / 2;
  const meanC = (deltaC + deltaC) / 2;
  const pow7 = Math.pow(meanC, 7);
  const rC = Math.sqrt(pow7 / (pow7 + 6103515625)); // 6103515625 = 25^7

  const weightedDeltaL = deltaL / (1 + 0.015 * meanL);
  const weightedDeltaC = deltaC / (1 + 0.045 * meanC);
  const weightedDeltaH = deltaH / (1 + 0.015 * meanC * rC);
  const deltaE = Math.sqrt(weightedDeltaL * weightedDeltaL + weightedDeltaC * weightedDeltaC + weightedDeltaH * weightedDeltaH);
  return deltaE;
}
function labToRgb(lab) {
  const [L, A, B] = lab;
  // Convert Lab to XYZ
  const delta = 0.008856;
  const fy = (L + 16) / 116;
  const fx = fy + A / 500;
  const fz = fy - B / 200;
  const x3 = Math.pow(fx, 3);
  const y3 = Math.pow(fy, 3);
  const z3 = Math.pow(fz, 3);
  const x = x3 > delta ? x3 : (fx - 16 / 116) / 7.787;
  const y = y3 > delta ? y3 : (fy - 16 / 116) / 7.787;
  const z = z3 > delta ? z3 : (fz - 16 / 116) / 7.787;
  const xr = x * 0.95047;
  const yr = y * 1.00000;
  const zr = z * 1.08883;

  // Convert XYZ to RGB
  let r = xr * 3.2406 + yr * -1.5372 + zr * -0.4986;
  let g = xr * -0.9689 + yr * 1.8758 + zr * 0.0415;
  let b = xr * 0.0557 + yr * -0.2040 + zr * 1.0570;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Clamp the RGB values
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  // Convert to 8-bit integer values (0-255)
  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);
  return [rInt, gInt, bInt];
}
const epsilon = 0.008856;
const kappa = 903.3;
function rgbToLab(rgb) {
  // Convert RGB to XYZ
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  r = pivotRgbToXyz(r);
  g = pivotRgbToXyz(g);
  b = pivotRgbToXyz(b);
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  // Convert XYZ to Lab

  const xr = x / 0.95047;
  const yr = y / 1.00000;
  const zr = z / 1.08883;
  const fx = pivotXyzToLab(xr);
  const fy = pivotXyzToLab(yr);
  const fz = pivotXyzToLab(zr);
  const L = 116 * fy - 16;
  const A = 500 * (fx - fy);
  const B = 200 * (fy - fz);
  return [L, A, B];
}
function pivotRgbToXyz(value) {
  return value > 0.04045 ? Math.pow((value + 0.055) / 1.055, 2.4) : value / 12.92;
}
function pivotXyzToLab(value) {
  return value > epsilon ? Math.pow(value, 1 / 3) : (kappa * value + 16) / 116;
}
function labDistance(r, g, b, r2, g2, b2) {
  return calculateDeltaE(rgbToLab([r, g, b]), rgbToLab([r2, g2, b2]));
}

//console.log ("rgbtolabtorgb="+labToRgb (rgbToLab ([128, 128, 128])));

},{}],2:[function(require,module,exports){
/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
const blockSize = 4;
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";




lab = require ('./lib/lab.mjs');

const color = app.pixelColor;
const image = app.activeImage;
const width = app.activeImage.width;
const height = app.activeImage.height;

for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
        // Get the average color within the block
        let totalR = 0, totalG = 0, totalB = 0;
        let totalL = 0, totala = 0, totalb = 0;
        let count = 0;
        for (let blockY = 0; blockY < blockSize && y + blockY < height; blockY++) {
            for (let blockX = 0; blockX < blockSize && x + blockX < width; blockX++) {
                const pixel = image.getPixel (x + blockX, y + blockY);
                const [L, a, b] = lab.rgbToLab ([color.rgbaR (pixel), color.rgbaG (pixel), color.rgbaB (pixel)]);
                totalL += L;
                totala += a;
                totalb += b;
                totalR += color.rgbaR (pixel);
                totalG += color.rgbaG (pixel);
                totalB += color.rgbaB (pixel);
                count++;
            }
        }

        const avgR = Math.floor(totalR / count);
        const avgG = Math.floor(totalG / count);
        const avgB = Math.floor(totalB / count);
        const avgL = Math.floor(totalL / count);
        const avga = Math.floor(totala / count);
        const avgb = Math.floor(totalb / count);

        // Set all pixels within the block to the average color
        for (let blockY = 0; blockY < blockSize && y + blockY < height; blockY++) {
            for (let blockX = 0; blockX < blockSize && x + blockX < width; blockX++) {
                if (COLOR_MODE === "RGB") {
                    image.putPixel (x + blockX, y + blockY, color.rgba (avgR, avgG, avgB, 255));
                }
                else {
                    const [pixelR, pixelG, pixelB] = lab.labToRgb ([avgL, avga, avgb]);
                    image.putPixel (x + blockX, y + blockY, color.rgba (pixelR, pixelG, pixelB, 255));
                }
            }
        }
    }
}

},{"./lib/lab.mjs":1}]},{},[2]);
