const objFile = require ('./lib/OBJFile.mjs'); // See https://github.com/WesUnwin/obj-file-parser

/* Draws a line. 
 * plot (x, y, z) draws the point @x, y, z. 
 * x and y values are not bounded in the line function, so it's up to the plot() call to check those. 
 */
function line (x0, y0, z0, x1, y1, z1, plot, nodiagonals = false, RGBColor = [255,255,255]) {
    const dx = Math.abs (x1 - x0);
    const dy = Math.abs (y1 - y0);
    const dz = Math.abs (z1 - z0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    const sz = dz / (dx + dy) * ((z0 < z1) ? 1 : -1); // NOTE approximation
    let err = dx - dy;
    let x3;
    let y3;
    let x2;
    let y2;

    while (true) {
        if (!nodiagonals || (nodiagonals 
            && (x0 !== x3 || y0 !== y3) 
            && (x0 !== x2 || y0 !== y2))) {  // This is to ensure we don't plot an already plotted point
            plot (x0, y0, z0, RGBColor); 
        }
        if ((x0 === x1) && (y0 === y1)) break;
        /*
         * Note that comparing floats directly may fail as you step (though it shouldn't when stepping by integer amounts, it might if either end point is non-integer),
         * so instead of directly comparing the end points you might want to use an epsilon:
         * if (Math.abs(x0 - x1) < 0.0001 && Math.abs(y0 - y1) < 0.0001) break;
         */
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy; 
            x0 += sx;
            z0 += sz;
            if (nodiagonals) {
                plot (x0, y0, z0, RGBColor);
                x3 = x0;
                y3 = y0;
            }
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
            z0 += sz;
            if (nodiagonals) {
                plot (x0, y0, z0, RGBColor);
                x2 = x0;
                y2 = y0;
            }
        }
    }
}

function nextY (x0, y0, z0, y1, err01, dx01, dy01, sx01, sy01, sz01, nodiagonals) {
    let x3, y3, x4, y4;
    while (counter-- > 0) {
        if (!nodiagonals || (nodiagonals 
            && (x0 !== x3 || y0 !== y3) 
            && (x0 !== x4 || y0 !== y4))) {  // This is to ensure we don't plot an already plotted point
            //break;
        }
        const e2_01 = 2 * err01;
        if (e2_01 > -dy01) {
            err01 -= dy01; 
            x0 += sx01;
            z0 += sz01;
            if (nodiagonals) {
                x3 = x0;
                y3 = y0;
            }
        }
        if (y0 === y1) break;
        if (e2_01 < dx01) {
            err01 += dx01;
            y0 += sy01;
            z0 += sz01;
            if (nodiagonals) {
                x4 = x0;
                y4 = y0;
            }
            break;
        }
    }
    return [x0, y0, z0, err01];
}

var counter = 100000; //DEBUG
function triangle (x0, y0, z0, x1, y1, z1, x2, y2, z2, plot, nodiagonals = false, RGBColor = [255,255,255]) {
    var t;
    if (y1 < y0) {
        t = x1; x1 = x0; x0 = t;    
        t = y1; y1 = y0; y0 = t;    
        t = z1; z1 = z0; z0 = t;    
    }
    if (y2 < y0) {
        t = x2; x2 = x0; x0 = t;    
        t = y2; y2 = y0; y0 = t;    
        t = z2; z2 = z0; z0 = t;    
    }
    if (y2 < y1) {
        t = x2; x2 = x1; x1 = t;    
        t = y2; y2 = y1; y1 = t;    
        t = z2; z2 = z1; z1 = t;    
    }
    const dx01 = Math.abs (x1 - x0);
    const dy01 = Math.abs (y1 - y0);
    const dz01 = Math.abs (z1 - z0);
    const sx01 = (x0 < x1) ? 1 : -1;
    const sy01 = (y0 < y1) ? 1 : -1;
    const sz01 = dz01 / (dx01 + dy01) * ((z0 < z1) ? 1 : -1); // NOTE approximation
    var x02 = x0;
    var y02 = y0; 
    var z02 = z0;
    const dx02 = Math.abs (x2 - x0);
    const dy02 = Math.abs (y2 - y0);
    const dz02 = Math.abs (z2 - z0);
    const sx02 = (x0 < x2) ? 1 : -1;
    const sy02 = (y0 < y2) ? 1 : -1;
    const sz02 = dz02 / (dx02 + dy02) * ((z0 < z2) ? 1 : -1); // NOTE approximation
    var x12 = x1;
    var y12 = y1;
    var z12 = z1;
    const dx12 = Math.abs (x2 - x1);
    const dy12 = Math.abs (y2 - y1);
    const dz12 = Math.abs (z2 - z1);
    const sx12 = (x1 < x2) ? 1 : -1;
    const sy12 = (y1 < y2) ? 1 : -1;
    const sz12 = dz12 / (dx12 + dy12) * ((z1 < z2) ? 1 : -1); // NOTE approximation
    var err02 = dx02 - dy02;
    var err12 = dx12 - dy12;
    var err01 = dx01 - dy01;

    while (counter-- > 0) {
        line (x0, y0, z0, x02, y02, z02, plot, nodiagonals, RGBColor);
        if (y0 === y1) break;
        [x0, y0, z0, err01] = nextY (x0, y0, z0, y1, err01, dx01, dy01, sx01, sy01, sz01, nodiagonals);
        [x02, y02, z02, err02] = nextY (x02, y02, z02, y2, err02, dx02, dy02, sx02, sy02, sz02, nodiagonals);
    }
    while (counter-- > 0) {
        line (x12, y12, z12, x02, y02, z02, plot, nodiagonals, RGBColor); 
        if ((x12 === x2) && (y12 === y2)) break;
        [x12, y12, z12, err12] = nextY (x12, y12, z12, y2, err12, dx12, dy12, sx12, sy12, sz12, nodiagonals);
        [x02, y02, z02, err02] = nextY (x02, y02, z02, y2, err02, dx02, dy02, sx02, sy02, sz02, nodiagonals);
    }
}

function plotConsole (x, y, z) {
    console.log (x + "," + y + "," + z);
}

triangle (0,0,0,30,30,30,10,20,10, (app.activeImage !== undefined) ? plot : plotConsole);

function plot (screenX, screenY, z, RGBColor) {
    app.activeImage.putPixel (screenX, screenY, app.pixelColor.rgba (...RGBColor, 255));
}

function plotVisible (screenX, screenY, z, RGBColor) {
    if (Math.abs (z - zIndex [screenX] [screenY]) < 1) {
        plot (screenX, screenY, z, RGBColor);
    }
}

function plotZIndex (screenX, screenY, z) {
    zIndex [screenX] [screenY] = z;
}

zIndex = [];
for (var x = 0; x < app.activeImage.width; x ++) {
    zIndex [x] = [];
}

const of = new objFile.OBJFile (
// EDIT replace the line below with the content of your .obj file
'#Produced by Art of Illusion 3.2.0, Sun Aug 27 17:33:31 CEST 2023\ns 0\ng Cube_1\nv -25 -25 25\nv 25 -25 25\nv 25 -25 -25\nv -25 -25 -25\nv -25 25 25\nv 25 25 25\nv 25 25 -25\nv -25 25 -25\nv 0 0 25\nv 25 0 0\nv 0 0 -25\nv -25 0 0\nv 0 -25 0\nv 0 25 0\nf 2 1 13\nf 3 2 13\nf 4 3 13\nf 1 4 13\nf 2 3 10\nf 3 7 10\nf 7 6 10\nf 6 2 10\nf 1 2 9\nf 2 6 9\nf 6 5 9\nf 5 1 9\nf 4 1 12\nf 1 5 12\nf 5 8 12\nf 8 4 12\nf 5 6 14\nf 6 7 14\nf 7 8 14\nf 8 5 14\nf 3 4 11\nf 4 8 11\nf 8 7 11\nf 7 3 11\n'
);
const scale = 2;    // Edit this line to set the scale. 












const magicalVoxelPNGPalette = [
    [255, 255, 255], 
    [255, 255, 204], 
    [255, 255, 153], 
    [255, 255, 102], 
    [255, 255, 51], 
    [255, 255, 0], 
    [255, 204, 255], 
    [255, 204, 204], 
    [255, 204, 153], 
    [255, 204, 102], 
    [255, 204, 51], 
    [255, 204, 0], 
    [255, 153, 255], 
    [255, 153, 204], 
    [255, 153, 153], 
    [255, 153, 102], 
    [255, 153, 51], 
    [255, 153, 0], 
    [255, 102, 255], 
    [255, 102, 204], 
    [255, 102, 153], 
    [255, 102, 102], 
    [255, 102, 51], 
    [255, 102, 0], 
    [255, 51, 255], 
    [255, 51, 204], 
    [255, 51, 153], 
    [255, 51, 102], 
    [255, 51, 51], 
    [255, 51, 0], 
    [255, 0, 255], 
    [255, 0, 204], 
    [255, 0, 153], 
    [255, 0, 102], 
    [255, 0, 51], 
    [255, 0, 0],

    [204, 255, 255], 
    [204, 255, 204], 
    [204, 255, 153], 
    [204, 255, 102], 
    [204, 255, 51], 
    [204, 255, 0], 
    [204, 204, 255], 
    [204, 204, 204], 
    [204, 204, 153], 
    [204, 204, 102], 
    [204, 204, 51], 
    [204, 204, 0], 
    [204, 153, 255], 
    [204, 153, 204], 
    [204, 153, 153], 
    [204, 153, 102], 
    [204, 153, 51], 
    [204, 153, 0], 
    [204, 102, 255], 
    [204, 102, 204], 
    [204, 102, 153], 
    [204, 102, 102], 
    [204, 102, 51], 
    [204, 102, 0], 
    [204, 51, 255], 
    [204, 51, 204], 
    [204, 51, 153], 
    [204, 51, 102], 
    [204, 51, 51], 
    [204, 51, 0], 
    [204, 0, 255], 
    [204, 0, 204], 
    [204, 0, 153], 
    [204, 0, 102], 
    [204, 0, 51], 
    [204, 0, 0],

    [153, 255, 255], 
    [153, 255, 204], 
    [153, 255, 153], 
    [153, 255, 102], 
    [153, 255, 51], 
    [153, 255, 0], 
    [153, 204, 255], 
    [153, 204, 204], 
    [153, 204, 153], 
    [153, 204, 102], 
    [153, 204, 51], 
    [153, 204, 0], 
    [153, 153, 255], 
    [153, 153, 204], 
    [153, 153, 153], 
    [153, 153, 102], 
    [153, 153, 51], 
    [153, 153, 0], 
    [153, 102, 255], 
    [153, 102, 204], 
    [153, 102, 153], 
    [153, 102, 102], 
    [153, 102, 51], 
    [153, 102, 0], 
    [153, 51, 255], 
    [153, 51, 204], 
    [153, 51, 153], 
    [153, 51, 102], 
    [153, 51, 51], 
    [153, 51, 0], 
    [153, 0, 255], 
    [153, 0, 204], 
    [153, 0, 153], 
    [153, 0, 102], 
    [153, 0, 51], 
    [153, 0, 0],

    [102, 255, 255], 
    [102, 255, 204], 
    [102, 255, 153], 
    [102, 255, 102], 
    [102, 255, 51], 
    [102, 255, 0], 
    [102, 204, 255], 
    [102, 204, 204], 
    [102, 204, 153], 
    [102, 204, 102], 
    [102, 204, 51], 
    [102, 204, 0], 
    [102, 153, 255], 
    [102, 153, 204], 
    [102, 153, 153], 
    [102, 153, 102], 
    [102, 153, 51], 
    [102, 153, 0], 
    [102, 102, 255], 
    [102, 102, 204], 
    [102, 102, 153], 
    [102, 102, 102], 
    [102, 102, 51], 
    [102, 102, 0], 
    [102, 51, 255], 
    [102, 51, 204], 
    [102, 51, 153], 
    [102, 51, 102], 
    [102, 51, 51], 
    [102, 51, 0], 
    [102, 0, 255], 
    [102, 0, 204], 
    [102, 0, 153], 
    [102, 0, 102], 
    [102, 0, 51], 
    [102, 0, 0],

    [51, 255, 255], 
    [51, 255, 204], 
    [51, 255, 153], 
    [51, 255, 102], 
    [51, 255, 51], 
    [51, 255, 0], 
    [51, 204, 255], 
    [51, 204, 204], 
    [51, 204, 153], 
    [51, 204, 102], 
    [51, 204, 51], 
    [51, 204, 0], 
    [51, 153, 255], 
    [51, 153, 204], 
    [51, 153, 153], 
    [51, 153, 102], 
    [51, 153, 51], 
    [51, 153, 0], 
    [51, 102, 255], 
    [51, 102, 204], 
    [51, 102, 153], 
    [51, 102, 102], 
    [51, 102, 51], 
    [51, 102, 0], 
    [51, 51, 255], 
    [51, 51, 204], 
    [51, 51, 153], 
    [51, 51, 102], 
    [51, 51, 51], 
    [51, 51, 0], 
    [51, 0, 255], 
    [51, 0, 204], 
    [51, 0, 153], 
    [51, 0, 102], 
    [51, 0, 51], 
    [51, 0, 0],

    [0, 255, 255], 
    [0, 255, 204], 
    [0, 255, 153], 
    [0, 255, 102], 
    [0, 255, 51], 
    [0, 255, 0], 
    [0, 204, 255], 
    [0, 204, 204], 
    [0, 204, 153], 
    [0, 204, 102], 
    [0, 204, 51], 
    [0, 204, 0], 
    [0, 153, 255], 
    [0, 153, 204], 
    [0, 153, 153], 
    [0, 153, 102], 
    [0, 153, 51], 
    [0, 153, 0], 
    [0, 102, 255], 
    [0, 102, 204], 
    [0, 102, 153], 
    [0, 102, 102], 
    [0, 102, 51], 
    [0, 102, 0], 
    [0, 51, 255], 
    [0, 51, 204], 
    [0, 51, 153], 
    [0, 51, 102], 
    [0, 51, 51], 
    [0, 51, 0], 
    [0, 0, 255], 
    [0, 0, 204], 
    [0, 0, 153], 
    [0, 0, 102], 
    [0, 0, 51], 
    //[0, 0, 0],
    
    [238, 0, 0], 
    [221, 0, 0], 
    [187, 0, 0], 
    [170, 0, 0], 
    [136, 0, 0], 
    [119, 0, 0], 
    [85, 0, 0], 
    [68, 0, 0], 
    [34, 0, 0], 
    [17, 0, 0], 

    [0, 238, 0], 
    [0, 221, 0], 
    [0, 187, 0], 
    [0, 170, 0], 
    [0, 136, 0], 
    [0, 119, 0], 
    [0, 85, 0], 
    [0, 68, 0], 
    [0, 34, 0], 
    [0, 17, 0], 

    [0, 0, 238], 
    [0, 0, 221], 
    [0, 0, 187], 
    [0, 0, 170], 
    [0, 0, 136], 
    [0, 0, 119], 
    [0, 0, 85], 
    [0, 0, 68], 
    [0, 0, 34], 
    [0, 0, 17], 

    [238, 238, 238], 
    [221, 221, 221], 
    [187, 187, 187], 
    [170, 170, 170], 
    [136, 136, 136], 
    [119, 119, 119], 
    [85, 85, 85], 
    [68, 68, 68], 
    [34, 34, 34], 
    [17, 17, 17], 

    [0,0,0]
];

const midWidth = app.activeImage.width / 2;
const midHeight = app.activeImage.height / 2;


function fillScreen (model, face) {
    const screen = [];
    for (var vertexIndex = 0; vertexIndex < face.vertices.length; vertexIndex ++) {
        var firstX, firstY, firstZ;
        var previousX, previousY, previousZ;
        var vertex = face.vertices [vertexIndex];
        const v = model.vertices [vertex.vertexIndex - 1];
        const x = v.x * scale - v.z * scale;
        const y = v.y * scale + v.x * scale / 2 + v.z * scale / 2;
        const screenX = parseInt (Math.round (midWidth + x));
        const screenY = parseInt (Math.round (midHeight - y));
        const screenZ = parseInt (Math.round (y - v.y * scale));
        screen [vertexIndex] = [screenX, screenY, screenZ];
    }
    return screen;
}

// ZIndex fill
const object = of.parse ();
for (var model of object.models) {
    for (var face of model.faces) {
        const screen = fillScreen (model, face);
        for (var coordIndex = 2; coordIndex < screen.length; coordIndex ++) {
            triangle (...screen [0], ...screen [coordIndex], ...screen [coordIndex - 1], plotZIndex, false);
        }
    }
}

// Visible faces color drawing
for (var model of object.models) {
    for (var face of model.faces) {
        const screen = fillScreen (model, face);
        for (var coordIndex = 2; coordIndex < screen.length; coordIndex ++) {
            triangle (...screen [0], ...screen [coordIndex], ...screen [coordIndex - 1], plotVisible, false, magicalVoxelPNGPalette [Math.round (model.textureCoords [face.vertices [0].textureCoordsIndex - 1].u * magicalVoxelPNGPalette.length)]);
        }
    }
}

// Visible faces wireframe drawing
for (var model of object.models) {
    for (var face of model.faces) {
        const screen = fillScreen (model, face);
        for (var coordIndex = 2; coordIndex < screen.length; coordIndex ++) {
            line (...screen [0], ...screen [coordIndex], plotVisible, false, [0,0,0]);
            line (...screen [coordIndex], ...screen [coordIndex - 1], plotVisible, false, [0,0,0]);
            line (...screen [coordIndex - 1], ...screen [0], plotVisible, false, [0,0,0]);
        }
    }
}
