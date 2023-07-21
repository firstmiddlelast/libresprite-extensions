const col = app.pixelColor
const img = app.activeImage

for (var y=0; y<img.height; ++y) {
  for (var x=0; x<img.width; ++x) {
    const c = img.getPixel(x, y)
    img.putPixel(x, y,
                 col.rgba(col.rgbaR(c) * 0.9,
                          col.rgbaG(c) * 0.9,
                          col.rgbaB(c) * 0.9,
                          col.rgbaA(c))
    )
  }
}
