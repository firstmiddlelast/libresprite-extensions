/* EDIT THE LINES BELOW TO FIT YOUR NEEDS */
// ONLY ONE OF THE LINES BELOW MUST NOT BE COMMENTED OUT WITH //
const GRADIENT_ORDER = "RGB";
//const GRADIENT_ORDER = "HSL";


















const rgb = require ('./lib/rgb.mjs');
const hsl = require ('./lib/hsl.mjs');

const color = app.pixelColor;
const image = app.activeImage;

const pixelSteps = [];
pixelSteps.push ([image.getPixel (0, 0), 0]);
for (var x = 0; x < image.width; x ++) {
    for (var y = 0; y < image.height; y ++) {
        const p = image.getPixel (x, y);
        if (p !== 0 && p !== pixelSteps [pixelSteps.length - 1] [0]) {
            pixelSteps.push ([p, x]);
            break;
        }
    }
}


while (pixelSteps.length > 1) {
    const [startPixel, xStart] = pixelSteps.shift ();
    const [finishPixel, xEnd] = pixelSteps [0];

    var r = color.rgbaR (startPixel);
    var g = color.rgbaG (startPixel);
    var b = color.rgbaB (startPixel);
    switch (GRADIENT_ORDER) {
        case "RGB":
            const deltaR = color.rgbaR (finishPixel) - r;
            const deltaG = color.rgbaG (finishPixel) - g;
            const deltaB = color.rgbaB (finishPixel) - b;

            const sigmaR = deltaR / (xEnd - xStart);
            const sigmaG = deltaG / (xEnd - xStart);
            const sigmaB = deltaB / (xEnd - xStart);

            for (var x = xStart; x < xEnd; x ++) {
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
            const sigmaH = (h2 - h) / (xEnd - xStart);
            const sigmaS = (s2 - s) / (xEnd - xStart);
            const sigmaL = (l2 - l) / (xEnd - xStart);

            for (var x = xStart; x < xEnd; x ++) {
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
