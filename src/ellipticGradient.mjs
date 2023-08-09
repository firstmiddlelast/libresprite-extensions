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
    const deltaAngle = Math.atan2 (1, maxDimension) * 180 / Math.PI / 2;
    if (DEBUG) console.log ("deltaAngle="+deltaAngle);
    const r = color.rgbaR (ellipse.color);
    const g = color.rgbaG (ellipse.color);
    const b = color.rgbaB (ellipse.color);
    const ellipseInt = ellipses [ellipseIndex + 1];
    const rInt = color.rgbaR (ellipseInt.color);
    const gInt = color.rgbaG (ellipseInt.color);
    const bInt = color.rgbaB (ellipseInt.color);
    const deltaR = rInt * rInt - r * r;
    const deltaG = gInt * gInt - g * g;
    const deltaB = bInt * bInt - b * b;
    const deltaWidth = width - ellipseInt.width;
    const deltaHeight = height - ellipseInt.height;
    const steps = Math.max (deltaWidth, deltaHeight) * 2;
    const deltaX = x - ellipseInt.x;
    const deltaY = y - ellipseInt.y;
    for (var step = 0; step <= steps; step ++) {
        const ratio = step / steps;
        const mixedR = Math.sqrt (rInt*rInt - deltaR * ratio);
        const mixedG = Math.sqrt (gInt*gInt - deltaG * ratio);
        const mixedB = Math.sqrt (bInt*bInt - deltaB * ratio);
        const mixedColor = color.rgba (mixedR, mixedG, mixedB, 255);
        for (var angle = 0; angle < 360; angle += deltaAngle) {
            const xPlot = ellipseInt.x + deltaX * ratio + Math.cos (angle) * (ellipseInt.width + deltaWidth * ratio);
            const yPlot = ellipseInt.y + deltaY * ratio + Math.sin (angle) * (ellipseInt.height + deltaHeight * ratio); 
            putPixel (xPlot, yPlot, mixedColor);
            // The following lines avoid moirés. 
            putPixel (xPlot, Math.round (yPlot), mixedColor);
            putPixel (Math.round (xPlot), Math.round (yPlot), mixedColor);
            putPixel (Math.round (xPlot), yPlot, mixedColor);
        }
    }
}
