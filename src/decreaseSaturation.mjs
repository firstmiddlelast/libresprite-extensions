const hsl = require ('./lib/hsl.mjs');
const color = app.pixelColor;
const image = app.activeImage;

const DEBUG = false;

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const c = image.getPixel (x, y);
    var [h, s, l] = hsl.rgbToHsl (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c));
    if (DEBUG) console.log ("hsl=" + [h,s,l]);
    s = s * 0.9;
    const [r, g, b] = hsl.hslToRgb (h, s, l);
    if (DEBUG) console.log ("rgb=" + [r,g,b]);
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
