/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";

// ONLY ONE OF THE FOLLOWING LINES MUST NOT BE COMMENTED OUT WITH // 
const DITHER_MODE = "NONE";
//const DITHER_MODE = "ATKINSON";
//const DITHER_MODE = "FLOYD-STEINBERG";
//const DITHER_MODE = "JARVIS-JUDICE-NINKE";
//const DITHER_MODE = "ORDERED2X2";
//const DITHER_MODE = "ORDERED4X4";
//const DITHER_MODE = "ORDERED8X8";
//const DITHER_MODE = "ORDERED16X16";







// Dither matrix for ordered dithering
const BAYER_PATTERN_2X2 = [
    [0, 2], 
    [3, 1]
]; 

const BAYER_PATTERN_4X4 = [
    [  0,  8,  2, 10 ],
    [ 12,  4, 14,  6 ],
    [  3, 11,  1,  9 ],
    [ 15,  7, 13,  5 ]
];

const BAYER_PATTERN_8X8 = [
    [0, 32, 8, 40, 2, 34, 10, 42], 
    [48, 16, 56, 24, 50, 18, 58, 26], 
    [12, 44, 4, 36, 14, 46, 6, 38], 
    [60, 28, 52, 20, 62, 30, 54, 22], 
    [3, 35, 11, 43, 1, 33, 9, 41], 
    [51, 19, 59, 27, 49, 17, 57, 25], 
    [15, 47, 7, 39, 13, 45, 5, 37], 
    [63, 31, 55, 23, 61, 29, 53, 21]
];

const BAYER_PATTERN_16X16 = [
    [     0, 191,  48, 239,  12, 203,  60, 251,   3, 194,  51, 242,  15, 206,  63, 254  ], 
    [   127,  64, 175, 112, 139,  76, 187, 124, 130,  67, 178, 115, 142,  79, 190, 127  ],
    [    32, 223,  16, 207,  44, 235,  28, 219,  35, 226,  19, 210,  47, 238,  31, 222  ],
    [   159,  96, 143,  80, 171, 108, 155,  92, 162,  99, 146,  83, 174, 111, 158,  95  ],
    [     8, 199,  56, 247,   4, 195,  52, 243,  11, 202,  59, 250,   7, 198,  55, 246  ],
    [   135,  72, 183, 120, 131,  68, 179, 116, 138,  75, 186, 123, 134,  71, 182, 119  ],
    [    40, 231,  24, 215,  36, 227,  20, 211,  43, 234,  27, 218,  39, 230,  23, 214  ],
    [   167, 104, 151,  88, 163, 100, 147,  84, 170, 107, 154,  91, 166, 103, 150,  87  ],
    [     2, 193,  50, 241,  14, 205,  62, 253,   1, 192,  49, 240,  13, 204,  61, 252  ],
    [   129,  66, 177, 114, 141,  78, 189, 126, 128,  65, 176, 113, 140,  77, 188, 125  ],
    [    34, 225,  18, 209,  46, 237,  30, 221,  33, 224,  17, 208,  45, 236,  29, 220  ],
    [   161,  98, 145,  82, 173, 110, 157,  94, 160,  97, 144,  81, 172, 109, 156,  93  ],
    [    10, 201,  58, 249,   6, 197,  54, 245,   9, 200,  57, 248,   5, 196,  53, 244  ],
    [   137,  74, 185, 122, 133,  70, 181, 118, 136,  73, 184, 121, 132,  69, 180, 117  ],
    [    42, 233,  26, 217,  38, 229,  22, 213,  41, 232,  25, 216,  37, 228,  21, 212  ],
    [   169, 106, 153,  90, 165, 102, 149,  86, 168, 105, 152,  89, 164, 101, 148,  85  ]
];

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
const hsl = require ('./lib/hsl.mjs');

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

function findClosestPaletteColor (r, g, b) {
    var distance;
    var colorDistance = Infinity;
    for (var cIndex = 0 ; cIndex < PALETTE_RGB.length; cIndex ++) {
        distance = distanceFunction (PALETTE_RGB [cIndex] [0], PALETTE_RGB [cIndex] [1], PALETTE_RGB [cIndex] [2], 
                                            r, g, b);
        if (distance < colorDistance) {
            colorDistance = distance;
            paletteColor = PALETTE_RGB [cIndex];
        }
    }
    return {color: paletteColor, distance: colorDistance};
}
function findClosestMixedColor (pixelR, pixelG, pixelB) {
    var minDistance = Infinity;
    var closestMixedColor;
    for (var mixedColor of MIXED_RESULT) {
        const d = distanceFunction (pixelR, pixelG, pixelB, mixedColor [3], mixedColor [4], mixedColor [5]) + distanceFunction (...PALETTE_RGB [mixedColor [0]],...PALETTE_RGB [mixedColor [1]]) * 0.1 * (Math.abs (mixedColor [2] / mixedColor [6] - 0.5) + 0.5); // NOTE see https://bisqwit.iki.fi/story/howto/dither/jy/
        if (d < minDistance) {
            minDistance = d;
            closestMixedColor = mixedColor;
        }
    }
    return closestMixedColor;
}

var MIXED_RESULT;
function setupMixedResults (threshold) {
    MIXED_RESULT = [];
    for (var color1Index in PALETTE_RGB) {
        for (var color2Index in PALETTE_RGB) {
            for (var ratio = 0; ratio < threshold; ratio ++) {
                // see https://kevinsimper.medium.com/how-to-average-rgb-colors-together-6cd3ef1ff1e5
                const multiplier = ratio / threshold;
                const combinedR = Math.sqrt ((PALETTE_RGB [color1Index] [0] ** 2) * multiplier + (PALETTE_RGB [color2Index] [0] ** 2) * (1 - multiplier));
                const combinedG = Math.sqrt ((PALETTE_RGB [color1Index] [1] ** 2) * multiplier + (PALETTE_RGB [color2Index] [1] ** 2) * (1 - multiplier));
                const combinedB = Math.sqrt ((PALETTE_RGB [color1Index] [2] ** 2) * multiplier + (PALETTE_RGB [color2Index] [2] ** 2) * (1 - multiplier));
                MIXED_RESULT.push ([color1Index, color2Index, ratio, combinedR, combinedG, combinedB, threshold]);
            }
        }
    }
}

const CLOSEST_CACHE = [];
function cachedClosestMixedColor (r, g, b) {
    const cached = CLOSEST_CACHE [[r, g, b]];
    if (cached !== undefined) return cached;
    return CLOSEST_CACHE [[r, g, b]] = findClosestMixedColor (r, g, b);
}

function setDitheredPixel (threshold, ditherValue, x, y, pixelR, pixelG, pixelB) {
    if (MIXED_RESULT === undefined) setupMixedResults (threshold);  // NOTE Ugly, should be initialized out of the xy pixel loop
    const closestMixedColor = cachedClosestMixedColor (pixelR, pixelG, pixelB);   // TODO inline this function
    if (ditherValue < closestMixedColor [2]) {
        PIXELS [x] [y] = [...PALETTE_RGB [closestMixedColor [0]], 255];
    }
    else {
        PIXELS [x] [y] = [...PALETTE_RGB [closestMixedColor [1]], 255]
    }
}

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const [pixelR, pixelG, pixelB] = PIXELS [x] [y];
    const [r, g, b] = findClosestPaletteColor (pixelR, pixelG, pixelB).color;
    // NOTE The three following lines are only useful with error diffusion dithering
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
        case "ORDERED16X16": {
                const threshold = (BAYER_PATTERN_16X16.length * BAYER_PATTERN_16X16.length);
                const ditherValue = BAYER_PATTERN_16X16 [y % BAYER_PATTERN_16X16.length][x % BAYER_PATTERN_16X16.length];
                setDitheredPixel (threshold, ditherValue, x, y, pixelR, pixelG, pixelB);
            }
            break;
        case "ORDERED8X8": {
                const threshold = (BAYER_PATTERN_8X8.length * BAYER_PATTERN_8X8.length);
                const ditherValue = BAYER_PATTERN_8X8 [y % BAYER_PATTERN_8X8.length][x % BAYER_PATTERN_8X8.length];
                setDitheredPixel (threshold, ditherValue, x, y, pixelR, pixelG, pixelB);
            }
            break;
        case "ORDERED4X4": {
                const threshold = (BAYER_PATTERN_4X4.length * BAYER_PATTERN_4X4.length);
                const ditherValue = BAYER_PATTERN_4X4 [y % BAYER_PATTERN_4X4.length][x % BAYER_PATTERN_4X4.length];
                setDitheredPixel (threshold, ditherValue, x, y, pixelR, pixelG, pixelB);
            }
            break;
        case "ORDERED2X2": {
                const threshold = (BAYER_PATTERN_2X2.length * BAYER_PATTERN_2X2.length);
                const ditherValue = BAYER_PATTERN_2X2 [y % BAYER_PATTERN_2X2.length][x % BAYER_PATTERN_2X2.length];
                setDitheredPixel (threshold, ditherValue, x, y, pixelR, pixelG, pixelB);
            }
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
