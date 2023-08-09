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

    var startR = color.rgbaR (startPixel);
    var startG = color.rgbaG (startPixel);
    var startB = color.rgbaB (startPixel);
    switch (GRADIENT_ORDER) {
        case "RGB":
            // see https://kevinsimper.medium.com/how-to-average-rgb-colors-together-6cd3ef1ff1e5
            const deltaR = color.rgbaR (finishPixel) ** 2 - startR ** 2;
            const deltaG = color.rgbaG (finishPixel) ** 2 - startG ** 2;
            const deltaB = color.rgbaB (finishPixel) ** 2 - startB ** 2;

            const sigmaR = deltaR / (xEnd - xStart);
            const sigmaG = deltaG / (xEnd - xStart);
            const sigmaB = deltaB / (xEnd - xStart);

            var xCounter = 0;
            for (var x = xStart; x < xEnd; x ++) {
                const r = Math.sqrt (startR ** 2 + sigmaR * (xCounter));
                const g = Math.sqrt (startG ** 2 + sigmaG * (xCounter));
                const b = Math.sqrt (startB ** 2 + sigmaB * (xCounter));
                const pixelColor = color.rgba (r, g, b, 255);
                for (var y = 0; y < image.height; y ++) {
                    image.putPixel (x, y, pixelColor);
                }
                xCounter ++;
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
