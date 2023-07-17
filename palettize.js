const color = app.pixelColor;
const image = app.activeImage;

function rgbDistance (r, g, b, r2, g2, b2) {
    return Math.sqrt ((r2 - r) **2 + (g2-g) **2 + (b2-b) **2);
}

const PALETTE_RGB = [];
for (var cIndex = 0 ; cIndex < app.activeSprite.palette.length; cIndex ++) {
    const paletteColor = app.activeSprite.palette.get (cIndex);
    PALETTE_RGB [cIndex] = [color.rgbaR (paletteColor), color.rgbaG (paletteColor), color.rgbaB (paletteColor)];
}

function findClosestPaletteColorRgb (r, g, b) {
    var colorDistance = Infinity;
    var colorRgb;
    for (var cIndex = 0 ; cIndex < PALETTE_RGB.length; cIndex ++) {
        var distance;
        if ((distance = rgbDistance (PALETTE_RGB [cIndex] [0], PALETTE_RGB [cIndex] [1], PALETTE_RGB [cIndex] [2], r, g, b)) < colorDistance) {
            colorDistance = distance;
            colorRgb = PALETTE_RGB [cIndex];
        }
    }
    return colorRgb;
}

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const c = image.getPixel (x, y);
    const [r, g, b] = findClosestPaletteColorRgb (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c));
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
