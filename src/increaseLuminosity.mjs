const col = app.pixelColor
const img = app.activeImage

for (var y=0; y<img.height; ++y) {
  for (var x=0; x<img.width; ++x) {
    const c = img.getPixel (x, y)
    const r = Math.min (col.rgbaR(c) * 1.1, 255);
    const g = Math.min (col.rgbaG(c) * 1.1, 255);
    const b = Math.min (col.rgbaB(c) * 1.1, 255);
    img.putPixel(x, y,
                 col.rgba(r, g, b, col.rgbaA(c))
    )
  }
}
