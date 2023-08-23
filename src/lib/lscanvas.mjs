const image = require ('./image.mjs');
const color = app.pixelColor;

export class HorizontalFlipSprite {
    constructor (image) {
        this.width = image.width;
        this.height = image.height;
        this.getPixel = function (x, y) {
            return image.getPixel (image.width - 1 - x, y);
        }
        this.putPixel = function (x, y, p) {
            return image.putPixel (image.width - 1 - x, y, p);
        }
    }
}

export class SpriteAsCanvas {
    constructor (image) {
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.data = [];
        var index = 0;
        for (var y = 0; y < this.height; y ++) {
            for (var x = 0; x < this.width; x ++) {
                const pixel = image.getPixel (x, y);
                this.data [index] = color.rgbaR (pixel);
                this.data [index + 1] = color.rgbaG (pixel);
                this.data [index + 2] = color.rgbaB (pixel);
                this.data [index + 3] = color.rgbaA (pixel);
                index += 4;
            }
        }
    }

    getContext () {
        return this;
    }

    getImageData (x, y, width, height) {
        return this;
    }

    createImageData (width, height) {
        return this;
    }

    putImageData (data, x, y, pixelColor) {
        var index = 0;
        for (var y = 0; y < this.height; y ++) {
            for (var x = 0; x < this.width; x ++) {
                if (pixelColor !== undefined && this.data [index] === 255) {
                    this.image.putPixel(x, y, pixelColor);
                }
                index += 4;
            }
        }
    }
}
