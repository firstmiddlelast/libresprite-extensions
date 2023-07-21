/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";










const lab = require ('./lib/lab.mjs');
const rgb = require ('./lib/rgb.mjs');

const color = app.pixelColor;
const image = app.activeImage;


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
    const [r, g, b] = findClosestPaletteColorRgb (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c), (COLOR_MODE === "RGB") ? rgb.rgbDistance : lab.labDistance);
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
