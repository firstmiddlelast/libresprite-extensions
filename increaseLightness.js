const color = app.pixelColor;
const image = app.activeImage;

// Generated by ChatGPT
function rgbToHsl(r, g, b) {
  // Normalize the RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the maximum and minimum values among R, G, B
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate the hue
  var h;
  if (max === min) {
    h = 0; // achromatic (gray)
  } else {
    var diff = max - min;
    switch (max) {
      case r:
        h = ((g - b) / diff) % 6;
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h *= 60; // Convert to degrees
  }

  // Calculate the lightness
  var l = (max + min) / 2;

  // Calculate the saturation
  var s;
  if (max === min) {
    s = 0; // achromatic (gray)
  } else if (l <= 0.5) {
    s = diff / (2 * l);
  } else {
    s = diff / (2 - 2 * l);
  }

  // Round the values to two decimal places and return as an object
  return [ Math.round(h), Math.round(s * 100), Math.round(l * 100), ];
}

// Generated by ChatGPT
function hslToRgb(h, s, l) {
  // Convert degrees to 0-1 range
  h /= 360;
  s /= 100;
  l /= 100;
    if (DEBUG) log ("h="+h+"s="+s+"l="+l);

  var r, g, b;

  if (s === 0) {
    // Achromatic (gray)
    if (DEBUG) log ("achromatic");
    r = g = b = l;
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert to 0-255 range
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return [r, g, b];
}

logText = '';
function log (l) {logText += l + '\n';}
const DEBUG = false;

for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
    const c = image.getPixel (x, y);
    var [h, s, l] = rgbToHsl (color.rgbaR (c), color.rgbaG (c), color.rgbaB (c));
    if (DEBUG) log ("hsl=" + [h,s,l]);
    l = l * 1.1;
    if (l > 100) l = 100;
    const [r, g, b] = hslToRgb (h, s, l);
    if (DEBUG) log ("rgb=" + [r,g,b]);
    image.putPixel (x, y, color.rgba (r, g, b, color.rgbaA (c)));
  }
}
if (DEBUG) throw logText;
