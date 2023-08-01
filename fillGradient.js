(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* EDIT THE LINES BELOW TO FIT YOUR NEEDS */
// ONLY ONE OF THE LINES BELOW MUST NOT BE COMMENTED OUT WITH //
//const GRADIENT_ORDER = "RGB";
const GRADIENT_ORDER = "HSL";


















const rgb = require ('./lib/rgb.mjs');
const hsl = require ('./lib/hsl.mjs');

const color = app.pixelColor;
const image = app.activeImage;

const startPixel = image.getPixel (0,0);
const finishPixel = image.getPixel (image.width - 1, image.height - 1);

if (startPixel !== 0 && finishPixel !== 0) {
    var r = color.rgbaR (startPixel);
    var g = color.rgbaG (startPixel);
    var b = color.rgbaB (startPixel);
    switch (GRADIENT_ORDER) {
        case "RGB":
            const deltaR = color.rgbaR (finishPixel) - r;
            const deltaG = color.rgbaG (finishPixel) - g;
            const deltaB = color.rgbaB (finishPixel) - b;

            const sigmaR = deltaR / image.width;
            const sigmaG = deltaG / image.width;
            const sigmaB = deltaB / image.width;

            for (var x = 0; x < image.width; x ++) {
                const pixelColor = color.rgba (r, g, b, 255);
                for (var y = 0; y < image.height; y ++) {
                    image.putPixel (x, y, pixelColor);
                }
                r += sigmaR;
                g += sigmaG;
                b += sigmaB;
            }
            break;
        case "HSL": 
            var [h, s, l] = hsl.rgbToHsl (r, g, b);
            var [h2, s2, l2] = hsl.rgbToHsl (color.rgbaR (finishPixel), color.rgbaG (finishPixel), color.rgbaB (finishPixel));
            h = (h + 360) % 360;
            h2 = (h2 + 360) % 360;
            const sigmaH = (h2 - h) / image.width;
            const sigmaS = (s2 - s) / image.width;
            const sigmaL = (l2 - l) / image.width;

            for (var x = 0; x < image.width; x ++) {
                [r, g, b] = hsl.hslToRgb (h, s, l);
                const pixelColor = color.rgba (r, g, b, 255);
                for (var y = 0; y < image.height; y ++) {
                    image.putPixel (x, y, pixelColor);
                }
                h += sigmaH;
                s += sigmaS;
                l += sigmaL;
            }
            break;
        }
}

},{"./lib/hsl.mjs":2,"./lib/rgb.mjs":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslToRgb = hslToRgb;
exports.rgbToHsl = rgbToHsl;
// Generated by ChatGPT
function rgbToHsl(r, g, b) {
  // Normalize the RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the maximum and minimum values among R, G, B
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate the hue
  var h;
  if (max === min) {
    h = 0; // achromatic (gray)
  } else {
    var diff = max - min;
    switch (max) {
      case r:
        h = (g - b) / diff % 6;
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h *= 60; // Convert to degrees
  }

  // Calculate the lightness
  var l = (max + min) / 2;

  // Calculate the saturation
  var s;
  if (max === min) {
    s = 0; // achromatic (gray)
  } else if (l <= 0.5) {
    s = diff / (2 * l);
  } else {
    s = diff / (2 - 2 * l);
  }

  // Round the values to two decimal places and return as an object
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

// Generated by ChatGPT
function hslToRgb(h, s, l) {
  // Convert degrees to 0-1 range
  h /= 360;
  s /= 100;
  l /= 100;
  var r, g, b;
  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert to 0-255 range
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return [r, g, b];
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbDistance = rgbDistance;
function rgbDistance(r, g, b, r2, g2, b2) {
  return Math.sqrt((r2 - r) ** 2 + (g2 - g) ** 2 + (b2 - b) ** 2);
}

},{}]},{},[1]);
