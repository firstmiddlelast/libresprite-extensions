/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";

// ONLY ONE OF THE FOLLOWING LINES MUST NOT BE COMMENTED OUT WITH // 
const DITHER_MODE = "NONE";
//const DITHER_MODE = "ATKINSON";
//const DITHER_MODE = "FLOYD-STEINBERG";
//const DITHER_MODE = "JARVIS-JUDICE-NINKE";








const FS_MATRIX = [[null, null, 7], [3, 5, 1]];
FS_MATRIX.dx = -1;
FS_MATRIX.weights = 16;
FS_MATRIX.width = 3;
FS_MATRIX.height = 2;

const JJN_MATRIX = [[null, null, null, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]];
JJN_MATRIX.dx = -2;
JJN_MATRIX.weights = 48;
JJN_MATRIX.width = 5;
JJN_MATRIX.height = 3;

const A_MATRIX = [[null, null, 1, 1], [1, 1, 1, null], [null, 1, null, null]];
A_MATRIX.dx = -1;
A_MATRIX.weights = 8;
A_MATRIX.width = 4;
A_MATRIX.height = 3;

const lab = require ('./lib/lab.mjs');
const rgb = require ('./lib/rgb.mjs');

const color = app.pixelColor;
const image = app.activeImage;


const PALETTE_RGB = [];
for (var cIndex = 0 ; cIndex < app.activeSprite.palette.length; cIndex ++) {
    const paletteColor = app.activeSprite.palette.get (cIndex);
    PALETTE_RGB [cIndex] = [color.rgbaR (paletteColor), color.rgbaG (paletteColor), color.rgbaB (paletteColor)];
}

const PIXELS = [];
for (var x = 0; x < image.width; x ++) {
    PIXELS [x] = [];
  for (var y = 0; y < image.height; y ++) {
    const p = image.getPixel (x, y);
    PIXELS [x] [y] = [color.rgbaR (p), color.rgbaG (p), color.rgbaB (p), color.rgbaA (p)];
  }
}
const distanceFunction = (COLOR_MODE === "RGB") ? rgb.rgbDistance : lab.labDistance;

function addPixelError (x, y, eR, eG, eB, factor) {
    PIXELS [x] [y] [0] += eR * factor;
    PIXELS [x] [y] [1] += eG * factor;
    PIXELS [x] [y] [2] += eB * factor;
}

function clip (c) {
    return Math.max (0, Math.min (255, Math.floor (c)));
}

function diffuseError (x, y, diffusionMatrix, errorR, errorG, errorB) {
    for (var i = 0; i < diffusionMatrix.width; i ++) {
        for (var j = 0; j < diffusionMatrix.height; j ++) {
            const ex = i + diffusionMatrix.dx + x;
            const ey = j + y;
            if (diffusionMatrix [j] [i] !== null && ex > 0 && ex < image.width && ey > 0 && ey < image.height) {
                PIXELS [ex] [ey] [0] += errorR * diffusionMatrix [j] [i] / diffusionMatrix.weights;
                PIXELS [ex] [ey] [1] += errorG * diffusionMatrix [j] [i] / diffusionMatrix.weights;
                PIXELS [ex] [ey] [2] += errorB * diffusionMatrix [j] [i] / diffusionMatrix.weights;
            }
        }
    }
}

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const [pixelR, pixelG, pixelB] = PIXELS [x] [y];
    var colorDistance = Infinity;
    var colorRgb;
    for (var cIndex = 0 ; cIndex < PALETTE_RGB.length; cIndex ++) {
        var distance;
        distance = distanceFunction (PALETTE_RGB [cIndex] [0], PALETTE_RGB [cIndex] [1], PALETTE_RGB [cIndex] [2], 
                                            pixelR, pixelG, pixelB);
        if (distance < colorDistance) {
            colorDistance = distance;
            colorRgb = PALETTE_RGB [cIndex];
        }
    }
    const [r, g, b] = colorRgb;
    PIXELS [x] [y] = [r, g, b, PIXELS [x] [y] [3]];
    const errorR = pixelR - r;
    const errorG = pixelG - g;
    const errorB = pixelB - b;
    switch (DITHER_MODE) {
        case "FLOYD-STEINBERG":
            diffuseError (x, y, FS_MATRIX, errorR, errorG, errorB);
            break;
        case "JARVIS-JUDICE-NINKE":
            diffuseError (x, y, JJN_MATRIX, errorR, errorG, errorB);
            break;
        case "ATKINSON": 
            diffuseError (x, y, A_MATRIX, errorR, errorG, errorB);
            break;
        case "NONE":
            break;
    }
    
  }
}


for (var x = 0; x < image.width; x ++) {
  for (var y = 0; y < image.height; y ++) {
    const p = PIXELS [x] [y];
    image.putPixel (x, y, color.rgba (clip (p [0]), clip (p [1]), clip (p [2]), p [3]));
  }
}
