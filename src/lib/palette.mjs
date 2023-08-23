const color = app.pixelColor;

export const PALETTE_RGB = [];
for (var cIndex = 0 ; cIndex < app.activeSprite.palette.length; cIndex ++) {
    const paletteColor = app.activeSprite.palette.get (cIndex);
    PALETTE_RGB [cIndex] = [color.rgbaR (paletteColor), color.rgbaG (paletteColor), color.rgbaB (paletteColor)];
}

export function findClosestPaletteColor (r, g, b, distanceFunction) {
    var distance;
    var colorDistance = Infinity;
    var paletteColor;
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

