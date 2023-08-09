const color = app.pixelColor;
const image = app.activeImage;

export class SpriteAsCanvas {
    constructor () {
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
                if (pixelColor !== undefined && this.data [index] === 255) 
                    image.putPixel(x, y, pixelColor);
                /*
                else 
                    image.putPixel (x, y, color.rgba (this.data [index], this.data [index + 1], this.data [index + 2], this.data [index + 3]));
                */
                index += 4;
            }
        }
    }
}
