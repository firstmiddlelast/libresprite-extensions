const DEBUG = false;
const sprite = app.activeSprite; 
var originalImage = [];
var image1 = [];
var image2 = [];

const image = app.activeImage;

function putPixel (x, y, p) {
    if (x > image.width || y > image.height || x < 0 || y < 0) {
        throw x + "," + y + " out of bounds (" + image.width + "," + image.height + ")";
    }
    else image.putPixel (x, y, p);
}

function getPixel (x, y) {
    if (x > image.width || y > image.height || x < 0 || y < 0) {
        throw x + "," + y + " out of bounds (" + image.width + "," + image.height + ")";
    }
    else return image.getPixel (x, y);
}

function getPixels (pixelsArray, xOffset, yOffset) {
    if (xOffset === undefined) xOffset = 0;
    if (yOffset === undefined) yOffset = 0;
    var width;
    var height;
    for (var x = 0; x < image.width - xOffset; x ++) {
        if (width === undefined && getPixel (x + xOffset, yOffset) === 0) {
            width = x;
            break;
        }
        pixelsArray [x] = [];
        for (var y = 0; y < image.height - yOffset; y ++) {
            const p = getPixel (x + xOffset, y + yOffset);
            if (height === undefined && p === 0) {
                height = y;
                break;
            }
            pixelsArray [x] [y] = p;
        }
    }
    if (height === undefined) height = image.height - yOffset;
    if (width === undefined) width = image.width - xOffset;
    return [width, height];
}

// TODO check all the layers have the same image size
var originalImageDimensions = getPixels (originalImage);
if (DEBUG) console.log ('originalImageDimensions=', ...originalImageDimensions);
const image1Dimensions = getPixels (image1, 0, originalImageDimensions [1] + 1);
if (DEBUG) console.log ('image1Dimensions=', ...image1Dimensions);
const image2Dimensions = getPixels (image2, originalImageDimensions [0] + 1, originalImageDimensions [1] + 1);
if (DEBUG) console.log ('image2Dimensions=', ...image2Dimensions);

var mergedPixelsCount = 0;
var conflictingPixelsCount = 0;
var unchangedPixelsCount = 0;

var feedbackImage = [];
var outputImage = [];
for (var x = 0; x < originalImageDimensions [0]; x ++) {
    feedbackImage [x] = [];
    outputImage [x] = [];
    for (var y = 0; y < originalImageDimensions [1]; y ++) {
        const originalPixel = originalImage [x] [y];
        const pixel1 = image1 [x] [y];
        const pixel2 = image2 [x] [y];
        var outputPixel = originalPixel;
        var feedbackPixel = 0;
        if (pixel1 !== pixel2) {
            switch (originalPixel) {
                case pixel1:
                    outputPixel = pixel2;
                    feedbackPixel = 0;
                    mergedPixelsCount ++;
                    break;
                case pixel2: 
                    outputPixel = pixel1;
                    feedbackPixel = 0;
                    mergedPixelsCount ++;
                    break;
                default:
                    feedbackPixel = originalPixel;
                    outputPixel = 0;
                    conflictingPixelsCount ++;
                    break;
            }
        }
        else {
            feedbackPixel = 0;
            if (originalPixel !== pixel1) {
                outputPixel = pixel1;
                mergedPixelsCount ++;
            }
            else {
                unchangedPixelsCount ++;
            }
        }
        feedbackImage [x] [y] = feedbackPixel;
        outputImage [x] [y] = outputPixel;
    }
}
console.log ("merged " + mergedPixelsCount + " pixels, unchanged pixels : " + unchangedPixelsCount + ", conflicting pixels : " + conflictingPixelsCount);


function putPixels (pixelsArray, xOffset, yOffset) {
    for (var x = 0; x < originalImageDimensions [0]; x ++) {
        for (var y = 0; y < originalImageDimensions [1]; y ++) {
            putPixel (x + xOffset, y + yOffset, pixelsArray [x] [y]);
        }
    }
}

if (DEBUG) console.log ("output image dimensions=" + outputImage.length + "," + outputImage [0].length);
if (DEBUG) console.log ("feedback image dimensions=" + feedbackImage.length + "," + feedbackImage [0].length);
putPixels (outputImage, originalImageDimensions [0] + 1, 0);
putPixels (feedbackImage, 0, 0);
