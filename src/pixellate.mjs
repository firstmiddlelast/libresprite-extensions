/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
const blockSize = 4;
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";




lab = require ('./lib/lab.mjs');

const color = app.pixelColor;
const image = app.activeImage;
const width = app.activeImage.width;
const height = app.activeImage.height;

for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
        // Get the average color within the block
        let totalR = 0, totalG = 0, totalB = 0;
        let totalL = 0, totala = 0, totalb = 0;
        let count = 0;
        for (let blockY = 0; blockY < blockSize && y + blockY < height; blockY++) {
            for (let blockX = 0; blockX < blockSize && x + blockX < width; blockX++) {
                const pixel = image.getPixel (x + blockX, y + blockY);
                const [L, a, b] = lab.rgbToLab ([color.rgbaR (pixel), color.rgbaG (pixel), color.rgbaB (pixel)]);
                totalL += L;
                totala += a;
                totalb += b;
                totalR += color.rgbaR (pixel);
                totalG += color.rgbaG (pixel);
                totalB += color.rgbaB (pixel);
                count++;
            }
        }

        const avgR = Math.floor(totalR / count);
        const avgG = Math.floor(totalG / count);
        const avgB = Math.floor(totalB / count);
        const avgL = Math.floor(totalL / count);
        const avga = Math.floor(totala / count);
        const avgb = Math.floor(totalb / count);

        // Set all pixels within the block to the average color
        for (let blockY = 0; blockY < blockSize && y + blockY < height; blockY++) {
            for (let blockX = 0; blockX < blockSize && x + blockX < width; blockX++) {
                if (COLOR_MODE === "RGB") {
                    image.putPixel (x + blockX, y + blockY, color.rgba (avgR, avgG, avgB, 255));
                }
                else {
                    const [pixelR, pixelG, pixelB] = lab.labToRgb ([avgL, avga, avgb]);
                    image.putPixel (x + blockX, y + blockY, color.rgba (pixelR, pixelG, pixelB, 255));
                }
            }
        }
    }
}
