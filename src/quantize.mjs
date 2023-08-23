const QUANTIZING_OPTIONS = {
/* EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS. For more help, see https://github.com/leeoniya/RgbQuant.js/tree/master#caveats--tips */
// THOSE OPTIONS ARE FOR BASIC USAGE
    colors: 16,              // desired palette size
    dithKern: null,          // null or a dithering kernel name between quotes "", see available kernels below :
         //"FloydSteinberg", "FalseFloydSteinberg", "Stucki", "Atkinson", "Jarvis", "Burkes", "Sierra", "TwoSierra", "SierraLite"
    

// THOSE OPTIONS ARE FOR ADVANCED USAGE
    method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
    boxSize: [64,64],        // subregion dims (if method = 2)
    boxPxls: 2,              // min-population threshold (if method = 2)
    initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
    minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
    dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
    dithSerp: false,         // enable serpentine pattern dithering
    palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
    reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
    useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
    cacheFreq: 10,           // min color occurance count needed to qualify for caching
    colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
};













const image = require ('./lib/image.mjs');
const rgbquant = require ('./lib/rgbquant.mjs');    // see https://github.com/leeoniya/RgbQuant.js/tree/master

var canvas;
const color = app.pixelColor;
const activeImage = app.activeImage;
const width = app.activeImage.width;
const height = app.activeImage.height;

function pixelToRgb (p) {
    return [color.rgbaR (p), color.rgbaG (p), color.rgbaB (p)];
}

const pixelsToQuantize = [];
for (var y = 0; y < height; y ++) {
    for (var x = 0; x < width; x ++) {
        pixelsToQuantize.push (...pixelToRgb (image.getPixel (x, y)));
        pixelsToQuantize.push (255);
    }
}

const quantizer = new rgbquant.RgbQuant (QUANTIZING_OPTIONS);
quantizer.sample (pixelsToQuantize, width);
const quantizedPalette = quantizer.palette (true, true);
for (var i = 0; i < quantizedPalette.length; i ++) {
    app.activeSprite.palette.set (i, ...quantizedPalette [i], 255);
}
app.activeSprite.palette.length = i;
const outImage = quantizer.reduce (pixelsToQuantize, 2);

var arrayIndex = 0;
for (var y = 0; y < height; y ++) {
    for (var x = 0; x < width; x ++) {
        image.putPixel (x, y, color.rgba (...quantizedPalette [outImage.shift ()], 255));
    }
}
