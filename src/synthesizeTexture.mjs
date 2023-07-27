/** EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS */
const OVERLAP_RATIO = 1/6;  // The size of the overlap between blocks
const PATCH_SIZE_RATIO = 1/2; // The size of the blocks that should be patched
// ONLY ONE OF THE THREE FOLLOWING LINES MUST NOT BE COMMENTED OUT WITH //
//const DISTANCE_FUNC = "l1";   // The sum of the R, G and B distances
const DISTANCE_FUNC = "l2"; // The square root of the squared R, G, B distances (SSD)
//const DISTANCE_FUNC = "ldiff";    // The difference between the R+G+B components
















const image = app.activeImage;

import {l1, l2, ldiff, CanvasDataImage, quilt_image} from './lib/quilting.mjs';

var tile_size;
for (var x = 0; x < image.width; x ++) {
    if (image.getPixel (x, 0) === 0) {
        tile_size = x;
        break;
    }
}
const patch_size = Math.floor (tile_size * PATCH_SIZE_RATIO);
const overlap = Math.floor (tile_size * OVERLAP_RATIO);

const distance_func = {l1: l1, l2: l2, ldiff: ldiff} [DISTANCE_FUNC];

const quiltParams = {size: [image.width, image.height], patch_size: patch_size, overlap: overlap, seed_coords: undefined, selection_chance: undefined, distance_func: distance_func};
image.color = app.pixelColor;
const result = new CanvasDataImage (quilt_image (
    new CanvasDataImage (image).sub_image (0, 0, tile_size, tile_size), quiltParams)
);
const resultData = result.data;
for (var x = 0; x < resultData.width(); x ++) {
    for (var y = 0; y < resultData.height(); y ++) {
        const p = result.get_pixel (x, y);
        image.putPixel (x, y, image.color.rgba (p [0], p[1], p[2], 255));
    }
}
