/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
const BLOCK_SIZE = 4;
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const KERNEL_SIZE = 5;  // MUST BE AN ODD NUMBER
const SIGMA = 1.4;
const HIGH_THRESHOLD = 100;
const LOW_THRESHOLD = 50;
const DRAW_EDGES = true;











const lab = require ('./lib/lab.mjs');
const rgb = require ('./lib/rgb.mjs');
const palette = require ('./lib/palette.mjs');
const cannyjs = require ('./lib/canny.mjs');    // see https://github.com/yuta1984/yuta1984.github.io/tree/master/canny
const lscanvas = require ('./lib/lscanvas.mjs');
const image = require ('./lib/image.mjs');

var canvas;
const color = app.pixelColor;
const activeImage = app.activeImage;
const width = app.activeImage.width;
const height = app.activeImage.height;

function pixelToRgb (p) {
    return [color.rgbaR (p), color.rgbaG (p), color.rgbaB (p)];
}


const imageData = cannyjs.CannyJS.canny(canvas = new lscanvas.SpriteAsCanvas (activeImage), 
    HIGH_THRESHOLD, LOW_THRESHOLD, SIGMA, KERNEL_SIZE, cannyjs.GrayImageData.prototype.grayFunction);
var horizontalFlipCanvas;
const horizontalFlipImageData = cannyjs.CannyJS.canny(horizontalFlipCanvas = new lscanvas.SpriteAsCanvas (new lscanvas.HorizontalFlipSprite (activeImage)), 
    HIGH_THRESHOLD, LOW_THRESHOLD, SIGMA, KERNEL_SIZE, cannyjs.GrayImageData.prototype.grayFunction);

const DEBUG = false;



function putBlock (x, y, component1, component2, component3, borderColor) {
    // Set all pixels within the block to the average color
    for (let blockY = 0; blockY < BLOCK_SIZE && y + blockY < height; blockY++) {
        for (let blockX = 0; blockX < BLOCK_SIZE && x + blockX < width; blockX++) {
                image.putPixel (x + blockX, y + blockY, color.rgba (component1, component2, component3, 255));
            if (borderColor !== undefined && (blockX === 0 || blockY === 0 || blockX === BLOCK_SIZE - 1 || blockY === BLOCK_SIZE - 1)) {
                image.putPixel (x + blockX, y + blockY, color.rgba (borderColor [0], borderColor [1], borderColor [2], 255));
            }
        }
    }
}

const DIRECTIONS_NESW = [
    [0, -1], 
    [1, 0],
    [0, 1], 
    [-1, 0]
];

const DIRECTIONS = DIRECTIONS_NESW;

var edgeData = imageData.toImageDataArray ();
const horizontalFlippedEdgeData = horizontalFlipImageData.toImageDataArray ();
var i = 0;
edgeData = edgeData.map ((x) => Math.max (x, horizontalFlippedEdgeData [i++]));

function coordinatesToIndex (x, y) {
    return (x + (y * width)) * 4;
}

function nextNonEdgePixel (x, y, dx, dy, distance) {
    if (x + dx < 0 || x + dx >= width || y + dy < 0 || y + dy >= height) {
        return null;
    }
    const p = image.getPixel (x + dx, y + dy);
    const dataIndex = coordinatesToIndex (x + dx, y + dy);
    if (edgeData [dataIndex] === 0) {
        return {p: p, x: x + dx, y: y + dy};
    }
    else if (distance > 0) return nextNonEdgePixel (x + dx, y + dy, dx, dy, --distance);
    else return null;
}

function evaluate (x, y, color) {
    var colorScore = 0;
    for (var dx = 0; dx < BLOCK_SIZE; dx ++) {
        for (var dy = 0; dy < BLOCK_SIZE; dy ++) {
            if (x + dx < width && y + dy < height && image.getPixel (x + dx, y + dy) === color) colorScore ++;
        }
    }
    var geometryScore = 0;
    if (x + BLOCK_SIZE - 1 < width && y + BLOCK_SIZE - 1 < height) {    // FIXME we should do the test at every getPixel below
        for (var dy = 0; dy < BLOCK_SIZE; dy ++) {
            if (image.getPixel (x, y + dy) === color && image.getPixel (x + 1, y + dy) === color) {
                geometryScore ++;
            }
            if (image.getPixel (x + BLOCK_SIZE - 1, y + dy) === color && image.getPixel (x + BLOCK_SIZE - 2, y + dy) === color) {
                geometryScore ++;
            }
        }
        for (var dx = 0; dx < BLOCK_SIZE; dx ++) {
            if (image.getPixel (x + dx, y) === color && image.getPixel (x + dx, y + 1) === color) {
                geometryScore ++;
            }
            if (image.getPixel (x + dx, y + BLOCK_SIZE - 1) === color && image.getPixel (x + dx, y + BLOCK_SIZE - 2) === color) {
                geometryScore ++;
            }
        }
        if (image.getPixel (x, y) === color) {
            geometryScore ++;
            if (image.getPixel (x + 1, y + 1) === color) {
                geometryScore ++;
            }
        }
        if (image.getPixel (x + BLOCK_SIZE - 1, y) === color) {
            geometryScore ++;
            if (image.getPixel (x + BLOCK_SIZE - 2, y + 1) === color) {
                geometryScore ++;
            }
        }
        if (image.getPixel (x + BLOCK_SIZE - 1, y + BLOCK_SIZE - 1) === color) {
            geometryScore ++;
            if (image.getPixel (x + BLOCK_SIZE - 2, y + BLOCK_SIZE - 2) === color) {
                geometryScore ++;
            }
        }
        if (image.getPixel (x, y + BLOCK_SIZE - 1) === color) {
            geometryScore ++;
            if (image.getPixel (x + 1, y + BLOCK_SIZE - 2) === color) {
                geometryScore ++;
            }
        }
    }
    return {color: colorScore, geo: geometryScore};
}


function replaceEdgesWithColor (x, y, color) {
    const replaced = [];
    for (let dx = 0; dx < BLOCK_SIZE; dx ++) {
        for (let dy = 0; dy < BLOCK_SIZE; dy ++) {
            if (x + dx < width && y + dy < height) {
                const dataIndex = coordinatesToIndex (x + dx, y + dy);
                if (edgeData [dataIndex] !== 0) {
                    replaced.push ([x + dx, y + dy, image.getPixel (x + dx, y + dy)]);
                    image.putPixel (x + dx, y + dy, color);
                }
            }
        }
    }
    return replaced;
}


const edgeBlocks = [];
const solved = [];
for (let y = 0; y < height; y += BLOCK_SIZE) {
    for (let x = 0; x < width; x += BLOCK_SIZE) {
        var blockColors = [];
        for (var dx = 0; dx < BLOCK_SIZE; dx ++) {
            for (var dy = 0; dy < BLOCK_SIZE; dy ++) {
                if (x + dx < width && y + dy < height) {
                    const blockColor = image.getPixel (x + dx, y + dy);
                    if (blockColors.find ((c)=>c === blockColor) === undefined) {
                        blockColors.push (blockColor);
                    }
                }
            }
        }
        var edgeColor = undefined;
        var score = {geo: -1, color: -1};
        for (var replacementColor of blockColors) {
            const currentScore = evaluate (x, y, replacementColor);
            const replaced = replaceEdgesWithColor (x, y, replacementColor);
            const replacementScore = evaluate (x, y, replacementColor);
            for (var replacement of replaced) {
                image.putPixel (replacement [0], replacement [1], replacement [2]);
            }
            if (replacementScore.color + replacementScore.geo > currentScore.color + currentScore.geo) {
                if (replacementScore.color + replacementScore.geo > score.color + score.geo) {
                    score = replacementScore;
                    edgeColor = replacementColor;
                }
            }
        }
        if (edgeColor !== undefined) {
            replaceEdgesWithColor (x, y, edgeColor);
        }
        colorsCount = {};
        for (var dx = 0; dx < BLOCK_SIZE; dx ++) {
            for (var dy = 0; dy < BLOCK_SIZE; dy ++) {
                if (x + dx < width && y + dy < height) {
                    const p = image.getPixel (x + dx, y + dy); 
                    if (colorsCount [p] === undefined) {
                        colorsCount [p] = 1;
                    }
                    else {
                        colorsCount [p] += 1;
                    }
                }
            }
        }
        var blockColor;
        var maxColorCount = 0;
        var mixedR = 0, mixedG = 0, mixedB = 0;
        var totalColors = 0;
        for (var countedColor in colorsCount) {
            if (colorsCount [countedColor] > maxColorCount) {
                maxColorCount = colorsCount [countedColor];
                blockColor = countedColor;
            }
        }
        putBlock (x, y, color.rgbaR (blockColor), color.rgbaG (blockColor), color.rgbaB (blockColor), (edgeColor !== undefined && DEBUG) ? [0, 0, 0] : undefined);
    }
}



if (DRAW_EDGES && DEBUG) imageData.drawOn (canvas, color.rgba (0, 0, 0, 255));
if (DRAW_EDGES && DEBUG) horizontalFlipImageData.drawOn (horizontalFlipCanvas, color.rgba (0, 0, 0, 255));
