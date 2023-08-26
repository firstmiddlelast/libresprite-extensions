/** EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS */
const OVERLAP_RATIO_X = 1/4;
const OVERLAP_RATIO_Y = 1/4;
// Determines the size of the overlap between patches by its ratio to the input texture image. Must be between 0 and 1. The higher it is, the more the patches fit into each other, and the longer the compute time is. The lower it is, the more patches are visible on the resulting image. Usual values are between 0.1 and 1/3. This value MUST BE lower than the PATCH_SIZE values below. 
const PATCH_SIZE_X_RATIO = 2/3;
const PATCH_SIZE_Y_RATIO = 2/3;
// Determines the size of the patches that should be patched by their ratio to the input texture image. Must be big enouth that the patches have some sense of texture, of repetition. Must be between 0 and 1. The higher it is, the more the input texture image is 'copied' into the output image, and the faster the computation is. The lower it is, the longer the compute time, and the more random the result. Usual values are between 1/3 and 3/4. 
// ONLY ONE OF THE THREE FOLLOWING LINES MUST NOT BE COMMENTED OUT WITH //
//const DISTANCE_FUNC = "l1";   // The sum of the R, G and B distances
const DISTANCE_FUNC = "l2"; // The square root of the squared R, G, B distances (SSD)
//const DISTANCE_FUNC = "ldiff";    // The difference between the R+G+B components
















const image = app.activeImage;

import {l1, l2, ldiff, CanvasDataImage, quilt_image} from './lib/quilting.mjs';

var tile_size_x;
var tile_size_y;
//var tile_size;
for (var x = 0; x < image.width; x ++) {
    if (image.getPixel (x, 0) === 0) {
        tile_size_x = x;
        break;
    }
}
for (var y = 0; y < image.height; y ++) {
    if (image.getPixel (0, y) === 0) {
        tile_size_y = y;
        break;
    }
}
const patch_size_x = Math.floor (tile_size_x * PATCH_SIZE_X_RATIO);
const patch_size_y = Math.floor (tile_size_y * PATCH_SIZE_Y_RATIO);
//const patch_size = Math.floor (tile_size * PATCH_SIZE_RATIO);
const overlap_x = Math.floor (tile_size_x * OVERLAP_RATIO_X);
const overlap_y = Math.floor (tile_size_y * OVERLAP_RATIO_Y);
//const overlap = Math.floor (tile_size * OVERLAP_RATIO);

const distance_func = {l1: l1, l2: l2, ldiff: ldiff} [DISTANCE_FUNC];

const quiltParams = {size: [image.width, image.height], patch_size_x: patch_size_x, patch_size_y: patch_size_y, /*patch_size: patch_size, overlap: overlap,*/ overlap_x: overlap_x, overlap_y: overlap_y, seed_coords: undefined, selection_chance: undefined, distance_func: distance_func};
image.color = app.pixelColor;
const result = new CanvasDataImage (quilt_image (
    new CanvasDataImage (image).sub_image (0, 0, /*tile_size, tile_size,*/ tile_size_x, tile_size_y), quiltParams)
);
const resultData = result.data;
for (var x = 0; x < resultData.width(); x ++) {
    for (var y = 0; y < resultData.height(); y ++) {
        const p = result.get_pixel (x, y);
        image.putPixel (x, y, image.color.rgba (p [0], p[1], p[2], 255));
    }
}
