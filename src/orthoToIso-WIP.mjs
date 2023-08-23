const image = app.activeImage;
const color = app.pixelColor;

for (var x = 2; x < image.width; x ++) {
    for (var y = image.height - 1; y >= 0; y --) {
        if (y + (x >> 1) < image.height) {
            image.putPixel (x, y + (x >> 1), image.getPixel (x, y));
        }
    }
}
