/* EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS */
const PALETTE_ORDER = "P-";   // A LIST OF COLOR COMPONENTS WHICH CAN BE : 
// "H","S","L" from the HSL color space 
// "R","G","B" from the RGB color space
// "W" for whiteness (the sum of R, G and B)
// "P" for the number of pixels in the current image. 
// EACH COLOR COMPONENT MUST BE FOLLOWED BY A "+" OR "-" TO DETERMINE THE SORT ORDER (INCREASING OR DECREASING) ; YOU CAN PUT THE COMPONENT LETTERS IN ANY ORDER OR OMIT ANY OF THEM










const rgb = require ('./lib/rgb.mjs');
const hsl = require ('./lib/hsl.mjs');

const color = app.pixelColor;
const image = app.activeImage;
const palette = app.activeSprite.palette; 

const distanceFunction = rgb.rgbDistance;

const DEBUG = false;

const PALETTE = [];
for (var cIndex = 0 ; cIndex < palette.length; cIndex ++) {
    PALETTE [cIndex] = palette.get (cIndex);
}

const countCache = [];

if (PALETTE_ORDER.match ("P") !== null) {
    for (var x = 0; x < image.width; x ++) {
        for (var y = 0; y < image.height; y ++) {
            const p = image.getPixel (x, y);
            if (countCache [p] === undefined) {
                countCache [p] = 0;
            }
            else {
                countCache [p] ++;
            }
        }
    }
}

function countPixels (color1) {
    if (countCache [color1] !== undefined) {
        return countCache [color1];
    }
    else {
        return 0;
    }
}

function compareComponent (color1, color2, component) {
    var distance;
    switch (component.substring (0,1)) {
        case "P":
            distance = countPixels (color1) - countPixels (color2);
            break;
        case "W": 
            distance = color.rgbaR (color1) + color.rgbaG (color1) + color.rgbaB (color1) - color.rgbaR (color2) - color.rgbaG (color2) - color.rgbaB (color2) ;
            break;
        case "R": 
            distance = color.rgbaR (color1) - color.rgbaR (color2);
            break;
        case "G": 
            distance = color.rgbaG (color1) - color.rgbaG (color2);
            break;
        case "B": 
            distance = color.rgbaB (color1) - color.rgbaB (color2);
            break;
        case "A": 
            distance = color.rgbaA (color1) - color.rgbaA (color2);
            break;
        case "H": 
            distance = hsl.rgbToHsl (color.rgbaR (color1), color.rgbaG (color1), color.rgbaB (color1)) [0] - hsl.rgbToHsl (color.rgbaR (color2), color.rgbaG (color2), color.rgbaB (color2)) [0];
            break;
        case "S": 
            distance = hsl.rgbToHsl (color.rgbaR (color1), color.rgbaG (color1), color.rgbaB (color1)) [1] - hsl.rgbToHsl (color.rgbaR (color2), color.rgbaG (color2), color.rgbaB (color2)) [1];
            break;
        case "L": 
            distance = hsl.rgbToHsl (color.rgbaR (color1), color.rgbaG (color1), color.rgbaB (color1)) [2] - hsl.rgbToHsl (color.rgbaR (color2), color.rgbaG (color2), color.rgbaB (color2)) [2];
            break;
        default: 
            throw "Unknown pixel sorting component : " + component;
    }
    if (component.substring (1,2) === "-") distance = - distance;
    return distance;
}

function sort (paletteSlice, components) {
    if (components.length < 2) return;
    const component = components.substring (components.length - 2, components.length);
    PALETTE.splice (paletteSlice.begin, paletteSlice.end - paletteSlice.begin, ...PALETTE.slice (paletteSlice.begin, paletteSlice.end).sort ((p1, p2) => compareComponent (p1, p2, component)));
    var sliceBegin = paletteSlice.begin; 
    while (sliceBegin < paletteSlice.end) {
        var paletteColor = PALETTE [sliceBegin];
        var sliceEnd = sliceBegin + 1;
        while (sliceEnd < paletteSlice.end && compareComponent (PALETTE [sliceEnd], paletteColor, component)) {
            sliceEnd ++;
        }
        sort ({begin: sliceBegin, end: sliceEnd}, components.substring (0, components.length - 2));
        sliceBegin = sliceEnd + 1;
    }
}

sort ({begin: 0, end: PALETTE.length}, PALETTE_ORDER);
if (DEBUG) {
    for (paletteColor of PALETTE) {
        console.log (color.rgbaR (paletteColor) + " " + color.rgbaG (paletteColor) + " " + color.rgbaB (paletteColor) + " " + color.rgbaA (paletteColor));
    }
}
for (paletteIndex in PALETTE) {
    palette.set (paletteIndex, PALETTE [paletteIndex]);
}
