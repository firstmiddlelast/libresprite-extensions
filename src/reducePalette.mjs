/* EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS */
const TARGET_PALETTE_LENGTH = 16; // The final size of the palette after color that are alike have been merged

/* ONE OUT OF THE FOLLOWING LINES MUST NOT BE COMMENTED OUT WITH // */
const COLOR_REMOVAL_SELECTION = "CLOSEST_TO_OTHERS";  // The color removed is the one that's closest to the other colors
//const COLOR_REMOVAL_SELECTION = "LAST";  // The color removed is the last in the palette
//const COLOR_REMOVAL_SELECTION = "FIRST";  // The color removed is the first in the palette

/* ONE OUT OF THE FOLLOWING LINES MUST NOT BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";










const lab = require ('./lib/lab.mjs');
const rgb = require ('./lib/rgb.mjs');

const color = app.pixelColor;
const image = app.activeImage;
const palette = app.activeSprite.palette; 

const distanceFunction = (COLOR_MODE === "RGB") ? rgb.rgbDistance : lab.labDistance;



while (palette.length > TARGET_PALETTE_LENGTH) {
    const PALETTE_RGBA = [];
    for (var cIndex = 0 ; cIndex < palette.length; cIndex ++) {
        const paletteColor = palette.get (cIndex);
        PALETTE_RGBA [cIndex] = [color.rgbaR (paletteColor), color.rgbaG (paletteColor), color.rgbaB (paletteColor), color.rgbaA (paletteColor)];
    }


    // Find the distance between each color and the others
    const paletteDistances = [];
    for (var paletteIndex = 0; paletteIndex < palette.length - 1; paletteIndex ++) {
        paletteDistances [paletteIndex] = [];
        for (var cIndex = paletteIndex + 1; cIndex < palette.length; cIndex ++) {
            paletteDistances [paletteIndex].push ([[paletteIndex, cIndex], distanceFunction (PALETTE_RGBA [cIndex] [0], PALETTE_RGBA [cIndex] [1],PALETTE_RGBA [cIndex] [2], PALETTE_RGBA [paletteIndex] [0], PALETTE_RGBA [paletteIndex] [1], PALETTE_RGBA [paletteIndex] [2])]);
        }
        paletteDistances [paletteIndex].sort (([cIndex1, distance1], [cIndex2, distance2]) => distance1 - distance2);
        //console.log ("color distance to palette #" + paletteIndex + " : " + paletteDistances [paletteIndex]);
    }

    // Find the color closest to another color distance overall
    const closestColor = paletteDistances.reduce ((closestColor, currentColor) => 
        {
            if (currentColor [0] [1] < closestColor [0] [1])
                return currentColor;
            else
                return closestColor; 
        }
        , [[-1, Infinity]]);
    const color1 = closestColor [0] [0] [0];
    const color2 = closestColor [0] [0] [1]; 
    var selectedColor = color1;
    switch (COLOR_REMOVAL_SELECTION) {
        case "CLOSEST_TO_OTHERS":
            var color1Distance = 0;
            var color2Distance = 0;
            for (cIndex = 0; cIndex < palette.length; cIndex ++) {
                if (cIndex !== color1 && cIndex !== color2) {
                    color1Distance += distanceFunction (PALETTE_RGBA [cIndex] [0], PALETTE_RGBA [cIndex] [1],PALETTE_RGBA [cIndex] [2], PALETTE_RGBA [color1] [0], PALETTE_RGBA [color1] [1], PALETTE_RGBA [color1] [2]);
                    color2Distance += distanceFunction (PALETTE_RGBA [cIndex] [0], PALETTE_RGBA [cIndex] [1],PALETTE_RGBA [cIndex] [2], PALETTE_RGBA [color2] [0], PALETTE_RGBA [color2] [1], PALETTE_RGBA [color2] [2]);
                }
            }
            if (color2Distance < color1Distance) selectedColor = color2;
            break;
        case "FIRST": 
            break;
        case "LAST":
            selectedColor = color2;
            break;
    }
    for (cIndex = selectedColor; cIndex < palette.length - 1; cIndex ++) {
        palette.set (cIndex, color.rgba (PALETTE_RGBA [cIndex + 1] [0], PALETTE_RGBA [cIndex + 1] [1], PALETTE_RGBA [cIndex + 1] [2], PALETTE_RGBA [cIndex + 1] [3]));
    }
    palette.length = palette.length - 1;
}
