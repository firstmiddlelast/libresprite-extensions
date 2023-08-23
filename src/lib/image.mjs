const image = app.activeImage;

export function getPixel (x, y) {
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
        throw "getPixel : " + x + "," + y + " out of bounds (" + image.width + "," + image.height + ")";
    }
    else {
        return image.getPixel (x, y);
    }
}

export function putPixel (x, y, p) {
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
        throw "putPixel : " + x + "," + y + " out of bounds (" + image.width + "," + image.height + ")";
    }
    else {
        return image.putPixel (x, y, p);
    }
}
