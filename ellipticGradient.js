(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const color = app.pixelColor;
const image = app.activeImage;

const DEBUG = false;

const DIRECTIONS = [
    [0, -1], 
    [1, -1], 
    [1, 0], 
    [1, 1], 
    [0, 1], 
    [-1, 1], 
    [-1, 0], 
    [-1, -1]
];

function getPixel (x, y) {
    if (x < 0 || x >= image.width || y < 0 || y >= image.height) {
        return 0;
        if (DEBUG) console.log ("x,y out of bounds: " + x + "," + y);
    }
    return image.getPixel (x, y);
}

function putPixel (x, y, p) {
    if (x > 0 && x < image.width && y > 0 && y < image.height) {
        image.putPixel (x, y, p);
    }
}

const ellipses = [];
const pixelsFound = [];

for (var x = 0; x < image.width; x ++) {
    for (var y = 0; y < image.height; y ++) {
        const p = getPixel (x, y);
        if (p !== 0 && pixelsFound.find ((xyp) => xyp [0] === x && xyp [1] === y) === undefined) {
            var direction = 7;
            var currentX = x; 
            var currentY = y;
            const minX = x;
            var maxX = x;
            var minY = y;
            var maxY = y;
            if (DEBUG) console.log ("New pixel found at " + currentX + "," + currentY + ", color " + p);
            pixelsFound.push ([x, y]);
            var counter = 500;  // DEBUG
            do {
                if (getPixel (currentX + DIRECTIONS [direction] [0], currentY + DIRECTIONS [direction] [1]) !== p) {
                    direction = (direction + 1) % DIRECTIONS.length;
                }
                if (getPixel (currentX + DIRECTIONS [direction] [0], currentY + DIRECTIONS [direction] [1]) !== p) {
                    direction = (direction + 1) % DIRECTIONS.length;
                }
                if (getPixel (currentX + DIRECTIONS [direction] [0], currentY + DIRECTIONS [direction] [1]) !== p) {
                    direction = (direction + 1) % DIRECTIONS.length;
                }
                if (getPixel (currentX + DIRECTIONS [direction] [0], currentY + DIRECTIONS [direction] [1]) !== p) {
                    if (DEBUG) console.log ("Ellipse lost at " + currentX + "," + currentY + " going direction " + direction);
                }
                currentX += DIRECTIONS [direction] [0];
                currentY += DIRECTIONS [direction] [1];
                pixelsFound.push ([currentX, currentY]);
                maxX = Math.max (maxX, currentX); 
                minY = Math.min (minY, currentY);
                maxY = Math.max (maxY, currentY);
                direction = (direction - 1 + DIRECTIONS.length) % DIRECTIONS.length;
            }
            while ((currentX !== x || currentY !== y) && (counter -- >0));
            if (counter <= 0) throw "counter";
            const ellipse = {x: Math.round ((maxX + minX) / 2), y: Math.round ((maxY + minY) / 2), width: Math.round ((maxX - minX) / 2), height: Math.round ((maxY - minY) / 2), color: p};
            ellipses.push (ellipse);
            if (DEBUG) console.log ("Ellipse found, center=" + ellipse.x + "," + ellipse.y + ", dimensions=" + ellipse.width + "," + ellipse.height + ", color=" + ellipse.color);
        }
    }
}

for (var ellipseIndex = 0; ellipseIndex < ellipses.length - 1; ellipseIndex ++) {
    const ellipse = ellipses [ellipseIndex];
    const x = ellipse.x; 
    const y = ellipse.y;
    const width = ellipse.width;
    const height = ellipse.height; 
    const maxDimension = Math.max (width, height);
    const deltaAngle = Math.atan2 (1, maxDimension) * 180 / Math.PI / 2;    // NOTE TODO Avoid moirés
    if (DEBUG) console.log ("deltaAngle="+deltaAngle);
    const r = color.rgbaR (ellipse.color);
    const g = color.rgbaG (ellipse.color);
    const b = color.rgbaB (ellipse.color);
    const ellipseInt = ellipses [ellipseIndex + 1];
    const rInt = color.rgbaR (ellipseInt.color);
    const gInt = color.rgbaG (ellipseInt.color);
    const bInt = color.rgbaB (ellipseInt.color);
    const deltaR = rInt - r;
    const deltaG = gInt - g;
    const deltaB = bInt - b;
    const deltaWidth = width - ellipseInt.width;
    const deltaHeight = height - ellipseInt.height;
    const steps = Math.max (deltaWidth, deltaHeight) * 2;   // NOTE TODO Avoid moirés
    const deltaX = x - ellipseInt.x;
    const deltaY = y - ellipseInt.y;
    for (var step = 0; step <= steps; step ++) {
        const ratio = step / steps;
        const mixedColor = color.rgba (rInt - deltaR * ratio, gInt - deltaG * ratio, bInt - deltaB * ratio, 255);
        for (var angle = 0; angle < 360; angle += deltaAngle) {
            putPixel (ellipseInt.x + deltaX * ratio + Math.cos (angle) * (ellipseInt.width + deltaWidth * ratio), ellipseInt.y + deltaY * ratio + Math.sin (angle) * (ellipseInt.height + deltaHeight * ratio), mixedColor);
            putPixel (ellipseInt.x + deltaX * ratio + Math.cos (angle) * (ellipseInt.width + deltaWidth * ratio), Math.round (ellipseInt.y + deltaY * ratio + Math.sin (angle) * (ellipseInt.height + deltaHeight * ratio)), mixedColor);
            putPixel (Math.round (ellipseInt.x + deltaX * ratio + Math.cos (angle) * (ellipseInt.width + deltaWidth * ratio)), ellipseInt.y + deltaY * ratio + Math.sin (angle) * (ellipseInt.height + deltaHeight * ratio), mixedColor);
            putPixel (Math.round (ellipseInt.x + deltaX * ratio + Math.cos (angle) * (ellipseInt.width + deltaWidth * ratio)), Math.round (ellipseInt.y + deltaY * ratio + Math.sin (angle) * (ellipseInt.height + deltaHeight * ratio)), mixedColor);
        }
    }
}

},{}]},{},[1]);
