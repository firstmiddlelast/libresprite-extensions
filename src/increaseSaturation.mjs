const hsl = require ('./lib/hsl.mjs');
const color = app.pixelColor;
const image = app.activeImage;

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const c = image.getPixel (x, y);
    var [h, s, l] = hsl.rgbToHsl (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c));
    s = s * 1.1;
    if (s > 100) s = 100;
    const [r, g, b] = hsl.hslToRgb (h, s, l);
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
