/* EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS */
// ONLY ONE OF THE FOLLOWING LINES MUST BE COMMENTED OUT WITH //
const GRID_TYPE = "HORIZONTAL";
//const GRID_TYPE = "VERTICAL";
















const image = app.activeImage;
if (image === undefined) throw "Draw the left-to-bottom edge line of the tile please.";
const pixel = image.getPixel (0, 0);
if (pixel === 0) throw "Plot the bottom right of the grid please.";

if (image.height === 0) throw "Draw the left-to-bottom edge line of the diamond please.";
var y = 0;
const steps = [];
if (GRID_TYPE === "VERTICAL") {
    while (image.getPixel (0, y) !== 0) {
        y ++;
        if (y === image.height) throw "Plot the bottom right of the grid please.";
    }
    if (y === 1) throw "Draw the vertical edge of the tile starting at the left and going towards the bottom please.";
}
const tileHeight = y;
y = 0;
var x = 0;
while (y < image.height) {
    x ++;
    if (x === image.width) throw "Plot the bottom right of the grid please.";
    if (image.getPixel (x, y) !== 0) {
        steps.push ([1, 0]);
    }
    else {
        if (y + 1 === image.height) throw "Plot the bottom right of the grid please.";
        if (image.getPixel (x, y + 1) !== 0) {
            steps.push ([1, 1]);
            y ++;
        }
        else break;
    }
}
const tileDepth = y;
function putPixel (x, y) {
    if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
        image.putPixel (x, y, pixel);
    }
}
x = 0; 
y = 0;
yTop = 0;
while (y < image.height) {
    if (GRID_TYPE === "VERTICAL") {
        for (var h = 0; h < tileHeight; h ++) {
            putPixel (x, y + h);
        }
    }
    for (var step of steps) {
        x += step [0];
        y += step [1];
        yTop -= step [1];
        putPixel (x, y);
        if (GRID_TYPE === "HORIZONTAL") {
            putPixel (x, yTop);
        }
    }
    if (GRID_TYPE === "VERTICAL") {
        for (var h = 0; h < tileHeight; h ++) {
            putPixel (x, y + h);
        }
    }
    for (var step of steps) {
        x += step [0];
        y -= step [1];
        yTop += step [1];
        putPixel (x, y);
        if (GRID_TYPE === "HORIZONTAL") {
            putPixel (x, yTop);
        }
    }
    if (GRID_TYPE === "VERTICAL") {
        for (var h = 0; h < tileHeight; h ++) {
            putPixel (x, y + h);
        }
    }
    if (x > image.width) {
        if (GRID_TYPE === "HORIZONTAL") {
            y += tileDepth * 2;
            yTop += tileDepth * 2;
        }
        else {
            y += tileHeight;
        }
        x = 0;
    }
}

