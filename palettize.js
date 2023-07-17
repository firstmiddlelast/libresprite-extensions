/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
// const COLOR_MODE = "LAB";












const color = app.pixelColor;
const image = app.activeImage;

const epsilon = 0.008856;
const kappa = 903.3;

function pivotRgbToXyz(value) {
    return (value > 0.04045) ? Math.pow((value + 0.055) / 1.055, 2.4) : value / 12.92;
}

function pivotXyzToLab(value) {
    return (value > epsilon) ? Math.pow(value, 1 / 3) : (kappa * value + 16) / 116;
}

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

    const weightedDeltaL = deltaL / (1 + (0.015 * meanL));

    const weightedDeltaC = deltaC / (1 + (0.045 * meanC));

    const weightedDeltaH = deltaH / (1 + (0.015 * meanC * rC));

    const deltaE = Math.sqrt(weightedDeltaL * weightedDeltaL + weightedDeltaC * weightedDeltaC + weightedDeltaH * weightedDeltaH);

    return deltaE;
}

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

    const L = (116 * fy) - 16;
    const A = 500 * (fx - fy);
    const B = 200 * (fy - fz);

    return [L, A, B];
}


function rgbDistance (r, g, b, r2, g2, b2) {
    return Math.sqrt ((r2 - r) **2 + (g2-g) **2 + (b2-b) **2);
}

function labDistance (r, g, b, r2, g2, b2) {
    return calculateDeltaE (rgbToLab ([r, g, b]), rgbToLab ([r2, g2, b2]));
}

const PALETTE_RGB = [];
for (var cIndex = 0 ; cIndex < app.activeSprite.palette.length; cIndex ++) {
    const paletteColor = app.activeSprite.palette.get (cIndex);
    PALETTE_RGB [cIndex] = [color.rgbaR (paletteColor), color.rgbaG (paletteColor), color.rgbaB (paletteColor)];
}

function findClosestPaletteColorRgb (r, g, b, distanceFunction) {
    var colorDistance = Infinity;
    var colorRgb;
    for (var cIndex = 0 ; cIndex < PALETTE_RGB.length; cIndex ++) {
        var distance;
        if ((distance = distanceFunction (PALETTE_RGB [cIndex] [0], PALETTE_RGB [cIndex] [1], PALETTE_RGB [cIndex] [2], r, g, b)) < colorDistance) {
            colorDistance = distance;
            colorRgb = PALETTE_RGB [cIndex];
        }
    }
    return colorRgb;
}

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const c = image.getPixel (x, y);
    const [r, g, b] = findClosestPaletteColorRgb (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c), (COLOR_MODE === "RGB") ? rgbDistance : labDistance);
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
