/** EDIT THE FOLLOWIN LINES TO FIT YOUR NEEDS. EXACTLY ONE OF THE TWO LINES BELOW MUST BE COMMENTED OUT WITHAN "//" INSERTED AT THE START OF THE LINE.  */
const HUE = 270;     // This is an angular value on the HSL color wheel, in degrees °, of the hue you want your sprite to be. 0 = red, 90 = green, 180 = cyan, 270 = purple. 
//const HUE = [204, 66, 94];     // Replace the numbers between parenthesis with the Red, Green, Blue components of the color you want in your sprite 








const hsl = require ('./lib/hsl.mjs');

const color = app.pixelColor;
const image = app.activeImage;

const DEBUG = false;

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const c = image.getPixel (x, y);
    var [h, s, l] = hsl.rgbToHsl (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c));
    if (DEBUG) console.log ("hsl=" + [h,s,l]);
    s = 100;
    if (HUE instanceof Array) {
        h = hsl.rgbToHsl (HUE [0], HUE [1], HUE [2]) [0];
    }
    else {
        h = HUE;
    }
    const [r, g, b] = hsl.hslToRgb (h, s, l);
    if (DEBUG) console.log ("rgb=" + [r,g,b]);
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
