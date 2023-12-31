const E = [-1, 0];
const W = [1, 0];
const S = [0, -1];
const N = [0, 1];
const SW = [1, -1];
const NW = [1, 1];
const NE = [-1, 1];
const SE = [-1, -1];
const SIMPLE = [N, S, E, W];
const DIAG = [NE, NW, SE, SW];
const ALL = [...SIMPLE, ...DIAG];











/** EDIT THE FOLLOWIN LINES TO FIT YOUR NEEDS. */
const OUTLINE_COLOR = [0, 0, 0, 255];     // Replace the numbers between parenthesis with the Red, Green, Blue and Alpha components (between 0 and 255) of the outline color. Alpha MUST NOT be 0. 
const OUTLINE_DIRECTIONS = [SIMPLE];  // Insert the outline directions, BETWEEN BRACKETS, separated by commas. ex: S, E for South plus East (outlines on the bottom and on the right). INSTEAD OF THE DIRECTIONS, you can also specify SIMPLE for N, S, E, W, and ALL for all directions.










const directions = (OUTLINE_DIRECTIONS [0] [0] instanceof Array) ? OUTLINE_DIRECTIONS [0] : OUTLINE_DIRECTIONS;
/*
Fill code modified from https://codeheir.com/2022/08/21/comparing-flood-fill-algorithms-in-javascript/
*/
function fill_outline (x, y, width, height) {
    if (DEBUG) console.log ("Filling from " + x + "," + y);
    const queue = [{x: x, y: y}];
    let fillCounter = 100;   // DEBUG ensures the fill stops at some point
    while (queue.length > 0 && fillCounter > 0) {
        fillCounter --;
        const current = queue.shift(0);
        for (let direction of directions) {
            const child = {
                x: current.x + direction[0],
                y: current.y + direction[1],
            }
            if (DEBUG) console.log ("child="+child.x+","+child.y);
            if (child.x >= 0 && child.x < width && child.y >= 0 && child.y < height) {
                if (DEBUG) console.log ("testing current="+current.x+","+current.y+" child="+child.x+","+child.y);
                if (color.rgbaA (image.getPixel (current.x, current.y)) === TRANSPARENT_ALPHA && (color.rgbaA (image.getPixel (child.x, child.y)) !== TRANSPARENT_ALPHA) && OUTLINE [[child.x, child.y]] === undefined) {
                        if (DEBUG) console.log ("putting "+current.x+','+current.y);
                        image.putPixel (current.x, current.y, color.rgba (OUTLINE_COLOR [0], OUTLINE_COLOR [1], OUTLINE_COLOR [2], OUTLINE_COLOR [3]));
                        OUTLINE [[current.x, current.y]] = true;
                    }
                if (VISITED [[child.x, child.y]] === undefined) {
                    queue.push(child);
                }
            }
        }
        VISITED [[current.x, current.y]] = true;
    }
    if (DEBUG) console.log ("End of fill, queue length=" + queue.length);
}

const color = app.pixelColor;
const image = app.activeImage;

const DEBUG = false;

const TRANSPARENT_ALPHA = 0;

const VISITED = [];
const OUTLINE = [];

if (DEBUG) console.log ("height="+image.height+",width="+image.width);
for (var y = 0; y < image.height; y ++) {
  for (var x = 0; x < image.width; x ++) {
      if (DEBUG) console.log (x+","+y+"="+((color.rgbaA(image.getPixel(x, y))===TRANSPARENT_ALPHA)?"transparent":"opaque"));
    if ((VISITED [[x, y]] === undefined) && (color.rgbaA (image.getPixel (x, y)) === TRANSPARENT_ALPHA)) {
        fill_outline (x, y, image.width, image.height);
    }
  }
}
