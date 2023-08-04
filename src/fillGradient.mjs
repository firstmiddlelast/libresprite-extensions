/* EDIT THE LINES BELOW TO FIT YOUR NEEDS */
// ONLY ONE OF THE LINES BELOW MUST NOT BE COMMENTED OUT WITH //
const GRADIENT_ORDER = "RGB";
//const GRADIENT_ORDER = "HSL";


















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
