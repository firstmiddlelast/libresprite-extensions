/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
const BLOCK_SIZE = 4;
/* ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH // */
const COLOR_MODE = "RGB";
//const COLOR_MODE = "LAB";




const lab = require ('./lib/lab.mjs');
const rgb = require ('./lib/rgb.mjs');
const cannyjs = require ('./lib/canny.mjs');
const lscanvas = require ('./lib/lscanvas.mjs');

var canvas;
const color = app.pixelColor;
const image = app.activeImage;
const width = app.activeImage.width;
const height = app.activeImage.height;

const imageData = cannyjs.CannyJS.canny(canvas = new lscanvas.SpriteAsCanvas (), 
    null, null, null, null, cannyjs.GrayImageData.prototype.grayFunction);

const DEBUG = false;

function getPixel (x, y) {
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
        return 0;
        if (DEBUG) console.log ("x,y out of bounds: " + x + "," + y);
    }
    return image.getPixel (x, y);
}

function putPixel (x, y, p) {
    if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
        image.putPixel (x, y, p);
    }
}

function putBlock (x, y, component1, component2, component3) {
    // Set all pixels within the block to the average color
    for (let blockY = 0; blockY < BLOCK_SIZE && y + blockY < height; blockY++) {
        for (let blockX = 0; blockX < BLOCK_SIZE && x + blockX < width; blockX++) {
            if (COLOR_MODE === "RGB") {
                putPixel (x + blockX, y + blockY, color.rgba (component1, component2, component3, 255));
            }
            else {
                const [pixelR, pixelG, pixelB] = lab.labToRgb ([component1, component2, component3]);
                putPixel (x + blockX, y + blockY, color.rgba (pixelR, pixelG, pixelB, 255));
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

edgeData = imageData.toImageDataArray ();
const edgeBlocks = [];
const solved = [];
for (let y = 0; y < height; y += BLOCK_SIZE) {
    for (let x = 0; x < width; x += BLOCK_SIZE) {
        // Get the average color within the block
        let totalR = 0, totalG = 0, totalB = 0;
        let totalL = 0, totala = 0, totalb = 0;
        let edgeTotalR = 0, edgeTotalG = 0, edgeTotalB = 0;
        let edgeTotalL = 0, edgeTotala = 0, edgeTotalb = 0;
        let count = 0;
        let topCount = 0, leftCount = 0;
        var deltaTopR = 0, deltaTopG = 0, deltaTopB = 0;
        var deltaLeftR = 0, deltaLeftG = 0, deltaLeftB = 0;
        var edgeCount = 0;
        const directions = [];
        for (let blockX = 0; blockX < BLOCK_SIZE && x + blockX < width && edgeCount === 0; blockX++) {
            for (let blockY = 0; blockY < BLOCK_SIZE && y + blockY < height && edgeCount === 0; blockY++) {
                const pixel = getPixel (x + blockX, y + blockY);
                const dataIndex = (x + blockX + (y + blockY) * canvas.width) * 4;
                if (edgeData [dataIndex] === 255) {
                    var directionCount = 0;
                    for (var dirIndex in DIRECTIONS) {
                        const direction = DIRECTIONS [dirIndex];
                    }
                    //TODO
                    //directions.push (delta);

                    edgeCount ++;
                }
                const [L, a, b] = lab.rgbToLab ([color.rgbaR (pixel), color.rgbaG (pixel), color.rgbaB (pixel)]);
                totalL += L;
                totala += a;
                totalb += b;
                totalR += color.rgbaR (pixel);
                totalG += color.rgbaG (pixel);
                totalB += color.rgbaB (pixel);
                count ++;
            }
        }

        var avgR = Math.floor (totalR / count);
        var avgG = Math.floor (totalG / count);
        var avgB = Math.floor (totalB / count);
        var avgL = Math.floor (totalL / count);
        var avga = Math.floor (totala / count);
        var avgb = Math.floor (totalb / count);

        putBlock (x, y, avgR, avgG, avgB);
        if (edgeCount === 0) {
            solved [[x, y]] = true;
        }
        else {
            edgeBlocks.push ({x: x, y: y, directions: directions});
            solved [[x, y]] = false;
        }
    }
}

do {
    var solvedEdgeBlocks = 0;
    for (var edgeBlock of edgeBlocks) {
        var unsolvedDirections = 0;
        for (var direction of edgeBlock.directions) {
            for (var dirIndex in direction) {
                if (solved [[edgeBlock.x + DIRECTIONS [dirIndex] [0] * BLOCK_SIZE, edgeBlock.y + DIRECTIONS [dirIndex] [1] * BLOCK_SIZE]] === true) {
                    //if (DEBUG) console.log (edgeBlock.x + "," + edgeBlock.y + " is solved in direction " + dirIndex);
                }
                else {
                    unsolvedDirections ++;
                    //if (DEBUG) console.log (edgeBlock.x + "," + edgeBlock.y + " is not yet solved in direction " + dirIndex);
                }
            }
        }
        if (unsolvedDirections === 0) {
            // TODO
            //putBlock (edgeBlock.x, edgeBlock.y, r, g, b);
            solved [[edgeBlock.x, edgeBlock.y]] = true;
            if (DEBUG) console.log ("Solved " + edgeBlock.x + "," + edgeBlock.y);
            solvedEdgeBlocks ++;
        }
        else {
            if (DEBUG) console.log ("Can't solve " + edgeBlock.x + "," + edgeBlock.y);
        }
    }

    if (solvedEdgeBlocks === 0 && edgeBlocks.length > 0) {
        // NOTE Should solve the block with the least unsolved edges
        var edgeBlock = edgeBlocks.shift ();
        solved [[edgeBlock.x, edgeBlock.y]] = true;
        if (DEBUG) console.log ("Approximated " + edgeBlock.x + "," + edgeBlock.y);
    }

    for (var edgeBlockIndex = 0; edgeBlockIndex < edgeBlocks.length; ) {
        if (solved [[edgeBlocks [edgeBlockIndex].x, edgeBlocks [edgeBlockIndex].y]] === true) {
            edgeBlocks.splice (edgeBlockIndex, 1);
        }
        else {
            edgeBlockIndex ++;
        }
    }
} while (edgeBlocks.length > 0)

if (!DEBUG) imageData.drawOn (canvas, color.rgba (0, 0, 0, 255));
