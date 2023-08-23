const image = app.activeImage;
const color = app.pixelColor;

for (var x = 2; x < image.width; x ++) {
    for (var y = 0; y < image.height; y ++) {
        {
            image.putPixel (x, y - (x >>1), image.getPixel (x, y));
        }
    }
}
