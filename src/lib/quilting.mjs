import seedrandom from "./seedrandom.mjs";

const TOLERANCE = 0.1;









const DEBUG = false;

var params;
var source;
var buffer_opt;
const [LEFT, TOP, TOP_LEFT] = ["LEFT", "TOP", "TOP_LEFT"];
var randomSeed;

const random = (randomSeed === undefined) ? Math.random : seedrandom(randomSeed);

const rng = random;

function blit_rect (bottom, top, rect, coords) {
    for (var x = 0; x < rect.size [0]; x ++) {
        for (var y = 0; y < rect.size [1]; y ++) {
            bottom.put_pixel (coords [0] + x, coords [1] + y, top.get_pixel (x + rect.coords [0], y + rect.coords [1]));
        }
    }
}

function patch_overlap_area (patch_no) {
    if (patch_no [0] === 0) return TOP; else if (patch_no [1] === 0) return LEFT; else return TOP_LEFT;
}

// Compute the error between two images in a rectangle of specified size at the specified coordinates.
function patch_rect_error (distance_func, image1, image2, coords1, coords2, rect) {
    const [x1, y1] = coords1;
    const [x2, y2] = coords2; 
    var error = 0;
    for (var y = 0; y < rect [1]; y ++) {
        for (var x = 0; x < rect [0]; x ++) {
            error += distance_func (image1.get_pixel (x + x1, y + y1), image2.get_pixel (x + x2, y + y2));
        }
    }
    return error;
}

export function quilt_image (imageSource, quiltParams) {
    source = imageSource;
    params = quiltParams;
    const [img_width, img_height] = source.dimensions;
    const step = params.patch_size - params.overlap;
    const x_patches = Math.ceil (params.size [0] / step);
    const y_patches = Math.ceil (params.size [1] / step);
    const [buffer_width, buffer_height] = [params.size [0] + params.patch_size, params.size [1] + params.patch_size];
    buffer_opt = new Image (buffer_width, buffer_height);

    blit_rect (buffer_opt, source, {coords: (params.seed_coords !== undefined) ? params.seed_coords 
        : [Math.floor (rng () * (img_width - params.patch_size)), Math.floor (rng () * (img_height - params.patch_size))], 
        size: [params.patch_size, params.patch_size]}, [0, 0]);
    for (var patch_y = 0; patch_y < y_patches; patch_y ++) {
        for (var patch_x = 0; patch_x < x_patches; patch_x ++) {
            if (patch_x === 0 && patch_y === 0) continue;
            const area = patch_overlap_area([patch_x, patch_y]);
            const corner = [patch_x * step, patch_y * step];
            const candidate = select_candidate (area, corner);
            const err_surf = patch_error_surface (area, candidate, corner);
            cut_and_blit_patch (candidate, corner, err_surf, area);
        }
    }

    return buffer_opt.sub_image (0, 0, params.size [0], params.size [1]);
}

// Compute the error between the specified overlap area of the specified patch and the buffer.
function patch_error (area, patch, buf_coords) {
    const buffer = buffer_opt;
    switch (area) {
        case TOP: return patch_rect_error (params.distance_func, source, buffer, patch.coords, buf_coords, [params.overlap, patch.size]);
        case LEFT: return patch_rect_error (params.distance_func, source, buffer, patch.coords, buf_coords, [patch.size, params.overlap]);
        case TOP_LEFT: return patch_rect_error (params.distance_func, source, buffer, patch.coords, buf_coords, [params.size, patch.overlap]) +
            patch_rect_error (params.distance_func, source, buffer, [patch.coords [0], patch.coords [1] + params.overlap], 
                [buf_coords [0], buf_coords [1] + params.overlap], [params.overlap, patch.size - params.overlap]);
    }
}

// Find a candidate patch to be quilted at the specified coordinates on the buffer.
function select_candidate (area, buf_coords) {
    const [w, h] = source.dimensions;
    const [max_x, max_y] = [w - params.patch_size, h - params.patch_size];
    var scores = [];
    var best = Infinity;
    if (params.selection_chance !== undefined) {
        while (scores.length === 0) {
            for (var y = 0; y < max_y + 1; y ++) {
                for (var x = 0; x < max_x + 1; x ++) {
                    const d = rng ();
                    if (d > params.selection_chance) {
                        const p = {coords: [x, y], size: params.patch_size};
                        const error = patch_error (area, p, buf_coords);
                        if (error < best * (1 + TOLERANCE)) {
                            best = (error < best) ? error : best;
                            scores.push ([p, error]);
                        }
                    }
                }
            }
        }
    }
    else {
        for (var y = 0; y < max_y + 1; y ++) {
            for (var x = 0; x < max_x + 1; x ++) {
                const p = {coords: [x, y], size: params.patch_size};
                const error = patch_error (area, p, buf_coords);
                if (error < best * (1 + TOLERANCE)) {
                    if (error < best) {
                        best = error;
                    }
                    scores.push ([p, error]);
                }
            }
        }
    }
    const candidates = [];
    for (var score of scores) {
        if (score [1] <= best * (1 + TOLERANCE)) {
            candidates.push (score);
        }
    }
    const candidate = candidates [Math.floor (rng () * candidates.length)][0];
    return candidate;
}
    
// Compute the error surface of the specified patch.
function patch_error_surface (area, patch, buf_coords) {
    const err_surf = new Image (params.patch_size, params.patch_size, [0]);
    const [xs, ys] = buf_coords;
    const [px, py] = patch.coords;
    const dist = params.distance_func;
    switch (area) {
        case TOP : 
            for (var x = 0; x < params.patch_size; x ++) {
                for (var y = 0; y < params.overlap; y ++) {
                    const err = dist (source.get_pixel (px + x, py + y), buffer_opt.get_pixel (xs + x, ys + x)); // QUESTION pourquoi ys+X et non ys+Y???
                    err_surf.put_pixel (x, y, [err]);
                }
            }
            break;
        case LEFT : 
            for (var x = 0; x < params.overlap; x ++) {
                for (var y = 0; y < params.patch_size; y ++) {
                    const err = dist (source.get_pixel (px + x, py + y), buffer_opt.get_pixel (xs + x, ys + x));
                    err_surf.put_pixel (x, y, [err]);
                }
            }
            break;
        case TOP_LEFT:
            for (var x = 0; x < params.patch_size; x ++) {
                for (var y = 0; y < params.overlap; y ++) {
                    const err = dist (source.get_pixel (px + x, py + y), buffer_opt.get_pixel (xs + x, ys + x));
                    err_surf.put_pixel (x, y, [err]);
                }
            }
            for (var x = 0; x < params.overlap; x ++) {
                for (var y = 0; y < params.patch_size; y ++) {
                    const err = dist (source.get_pixel (px + x, py + y), buffer_opt.get_pixel (xs + x, ys + x));
                    err_surf.put_pixel (x, y, [err]);
                }
            }
            break;
    }
    return err_surf;
}

function vertical_cost_map (err_surf) {


    function pixel_error (cost_map, e, overlap, x, y) {
        if (cost_map.has ([x, y])) {
            return cost_map.get ([x, y]);
        }
        if (y === 0) {
            const val = e.get_pixel (x, y);
            const v = val [0];
            cost_map.set ([x, y], v);
            return v;
        }
        
        // Find the minimal pixel_error value between x-1, x, and x+1
        var val = pixel_error (cost_map, e, overlap, x, y - 1);
        if (x !== 0) {
            const v = pixel_error (cost_map, e, overlap, x - 1, y - 1);
            if (v < val) { val = v; }
        }
        if (x !== (overlap - 1)) {
            const v = pixel_error (cost_map, e, overlap, x + 1, y - 1);
            if (v < val) { val = v; }
        }
        val += e.get_pixel (x, y) [0];
        cost_map.set ([x, y], val);
        return val;
    }


    const cost_map = [];
    cost_map.has = function ([x, y]) {
        return this [[x,y]] !==  undefined;
    }
    cost_map.get = function ([x, y]) {
        return this [[x, y]];
    }
    cost_map.set = function ([x, y], v) {
        this [[x, y]] = v;
    }
    for (var x = 0; x < params.overlap; x ++) {
        pixel_error (cost_map, err_surf, params.overlap, x, params.patch_size - 1);
    }
    return cost_map;
}
function minimum_cost_vertical_path (err_surf) {
    var v = [];
    const cost_map = vertical_cost_map (err_surf);

    // Find path starting point
    var x;
    var min_cost = cost_map.get ([0, params.patch_size - 1]);
    for (var x_map = 0; x_map < params.overlap; x_map ++) {
        const cost = cost_map.get ([x_map, params.patch_size - 1]);
        if (cost < min_cost) {
            x = x_map;
            min_cost = cost;
        }
    }
    var y = params.patch_size - 1;
    v.push ([x, y]);
    while (y != 0) {
        const top = cost_map.get ([x, y - 1]);
        if (x === 0) {
            const right = cost_map.get ([x + 1, y - 1]);
            if (right < top) {x += 1;}
        }
        else if (x === params.overlap - 1) {
                const left = cost_map.get ([x - 1, y - 1]);
                if (left < top) {x -= 1;}
            }
        else {
            const left = cost_map.get ([x - 1, y - 1]);
            const right = cost_map.get ([x + 1, y - 1]);
            if (left < top) {
                if (left < right) {x -= 1;}
            }
            else if (right < top) {x += 1;}
        }
        y -= 1;
        v.push ([x, y]);
    }
    return v;
}

function horizontal_cost_map (err_surf) {

    function pixel_error (cost_map, e, overlap, x, y) {
        if (cost_map.has ([x, y])) {
            return cost_map.get ([x, y]);
        }
        if (x === 0) {
            const val = e.get_pixel (x, y);
            const v = val [0];
            cost_map.set ([x, y], v);
            return v;
        }
        var val = pixel_error (cost_map, e, overlap, x - 1, y);
        if (y !== 0) {
            const v = pixel_error (cost_map, e, overlap, x - 1, y - 1);
            if (v < val) {val = v;}
        }
        if (y !== overlap - 1) {
            const v = pixel_error (cost_map, e, overlap, x - 1, y + 1);
            if (v < val) {val = v;}
        }
        val += e.get_pixel (x, y) [0];
        cost_map.set ([x, y], val);
        return val;
    }

    const cost_map = [];
    cost_map.has = function ([x, y]) {
        return this [[x,y]] !==  undefined;
    }
    cost_map.get = function ([x, y]) {
        return this [[x, y]];
    }
    cost_map.set = function ([x, y], v) {
        this [[x, y]] = v;
    }
    for (var y = 0; y < params.overlap; y ++) {
        pixel_error (cost_map, err_surf, params.overlap, params.patch_size - 1, y);
    }
    return cost_map;
}

    
function minimum_cost_horizontal_path (err_surf) {
    var v = [];
    const cost_map = horizontal_cost_map (err_surf);

    // Find path starting point
    var y;
    var min_cost = cost_map.get ([params.patch_size - 1, 0]);
    for (var y_map = 0; y_map < params.overlap; y_map ++) {
        var cost = cost_map.get ([params.patch_size - 1, y_map]);
        if (cost < min_cost) {
            min_cost = cost;
            y = y_map;
        }
    }
    var x = params.patch_size - 1;
    v.push ([x, y]);
    while (x != 0) {
        const left = cost_map.get ([x - 1, y]);
        if (y === 0) {
            const down = cost_map.get ([x - 1, y + 1]);
            if (down < left) {y += 1;}
        }
        else if (y === params.overlap - 1) {
                const up = cost_map.get ([x - 1, y - 1]);
                if (up < left) {y -= 1;}
            }
        else {
            const up = cost_map.get ([x - 1, y - 1]);
            const down = cost_map.get ([x - 1, y + 1]);
            if (up < left) {
                if (up < down) {y -= 1;}
            }
            else if (down < left) {y += 1;}
        }
        x -= 1;
        v.push ([x, y]);
    }
    return v;
}

function cut_and_blit_vertical (patch, buf_coords, path) {
    const buffer = buffer_opt;
    for (var [xp, yp] of path) {
        if (yp + patch.coords [1] < buffer.height ()) {
            for (var x = 0; x < params.overlap; x ++) {
                if (x >= xp && x < buffer.width ()) {
                    buffer.put_pixel (buf_coords [0] + x, buf_coords [1] + yp, source.get_pixel (patch.coords [0] + x, patch.coords [1] + yp));
                }
            }
        }
    }
}

function cut_and_blit_horizontal (patch, buf_coords, path) {
    const buffer = buffer_opt;
    for (var [xp, yp] of path) {
        if (xp + patch.coords [0] < buffer.width ()) {
            for (var y = 0; y < params.overlap; y ++) {
                if (y >= yp && y < buffer.height ()) {
                    buffer.put_pixel (buf_coords [0] + xp, buf_coords [1] + y, source.get_pixel (patch.coords [0] + xp, patch.coords [1] + y));
                }
            }
        }
    }
}

function cut_and_blit_corner (patch, buf_coords, hpath, vpath) {
    const overlap = params.overlap;
    const do_pixel = function (x, y) {
        const buffer = buffer_opt;
        const hpos = hpath.find (c => c[0] === x);
        const vpos = vpath.find (c => c[1] === y);
        if (y >= hpos [1] && x >= vpos [0]) {
            buffer.put_pixel (buf_coords [0] + x, buf_coords [1] + y, source.get_pixel (patch.coords [0] + x, patch.coords [1] + y));
        }
    }
    for (var x = 0; x < overlap; x ++) {
        for (var y = 0; y < overlap; y ++) {
            do_pixel (x, y);
        }
    }
}

function cut_and_blit_patch (patch, buf_coords, err_surf, area) {
    const overlap = params.overlap;
    var vpath;
    var hpath;
    switch (area) {
        case LEFT: 
            vpath = minimum_cost_vertical_path (err_surf);
            cut_and_blit_vertical (patch, buf_coords, vpath);
            var buffer = buffer_opt; 
            blit_rect (buffer, source, {coords: [patch.coords [0] + overlap, patch.coords[1]],
                size: [params.patch_size - overlap, params.patch_size]}, 
                [buf_coords [0] + overlap, buf_coords [1]]);
            break;
        case TOP:
            hpath = minimum_cost_horizontal_path (err_surf);
            cut_and_blit_horizontal (patch, buf_coords, hpath);
            var buffer = buffer_opt;
            blit_rect (buffer, source, {coords: [patch.coords [0], patch.coords[1] + overlap],
                size: [params.patch_size, params.patch_size - overlap]}, 
                [buf_coords [0], buf_coords [1] + overlap]);
            break;
        case TOP_LEFT:
            vpath = [];
            const vpath_corner = [];
            for (var [x, y] of minimum_cost_vertical_path (err_surf)) {
                if (y >= overlap) {
                    vpath.push ([x, y]);
                }
                else {
                    vpath_corner.push ([x, y]);
                }
            }
            hpath = [];
            const hpath_corner = [];
            for ([x, y] of minimum_cost_horizontal_path (err_surf)) {
                if (x >= overlap) {
                    hpath.push ([x, y]);
                }
                else {
                    hpath_corner.push ([x, y]);
                }
            }
            cut_and_blit_vertical (patch, buf_coords, vpath);
            cut_and_blit_horizontal (patch, buf_coords, hpath);
            cut_and_blit_corner (patch, buf_coords, hpath_corner, vpath_corner);
            var buffer = buffer_opt;
            blit_rect (buffer, source, {coords: [patch.coords [0] + overlap, patch.coords [1] + overlap], 
                size: [params.patch_size - overlap, params.patch_size - overlap]}, [buf_coords [0] + overlap, buf_coords [1] + overlap]);
            break;
    }
}

// Go through the image to be synthesized in raster scan order in steps of one block (minus the overlap).
// For every location, 
//  search the input texture for a set of blocks that satisfy the overlap constraints (above and left) within some error tolerance. 
//  Randomly pick one such block.
//  Compute the error surface between the newly chosen block and the old blocks at the overlap region. 
//  Find the minimum cost path along this surface
//  make that the boundary of the new block. 
//  Paste the block onto the texture. 

export const l1 = function (p1, p2) {
    return Math.abs (p1 [0] - p2 [0]) + Math.abs (p1 [1] - p2 [1]) + Math.abs (p1 [2] - p2 [2]);
}

export const l2 = function (p1, p2) {
    return Math.sqrt ((p1 [0] - p2 [0]) ** 2 + (p1 [1] - p2 [1]) ** 2 + (p1 [2] - p2 [2]) ** 2);
}

export const ldiff = function (p1, p2) {
    return Math.abs (p1 [0] - p2 [0] + p1 [1] - p2 [1] + p1 [2] - p2 [2]);
}

class Image {
    constructor (width, height, init) {
        if (init === undefined) {
            init = [0, 0, 0];
        }
        this.pixels = [];
        for (var x = 0; x < width; x ++) {
            this.pixels [x] = [];
            for (var y = 0; y < height; y ++) {
                this.pixels [x] [y] = init;
            }
        }
    }
    width () {
        return this.pixels.length;
    }
    height () {
        return this.pixels [0].length;
    }
    put_pixel (x, y, data) {
        this.pixels [x] [y] = data;
    }
    get_pixel (x, y) {
        return this.pixels [x] [y];
    }
    sub_image (x, y, width, height) {
        const sub_pixels = new Image (width, height);
        for (var sub_x = 0; sub_x < width; sub_x ++) {
            for (var sub_y = 0; sub_y < height; sub_y ++) {
                sub_pixels.put_pixel (sub_x, sub_y, this.get_pixel (x + sub_x, y + sub_y));
            }
        }
        return sub_pixels;
    }
}

export class CanvasDataImage {
    constructor (contextOrImage) {
        if (contextOrImage instanceof Image) {
            const width = contextOrImage.width ();
            const height = contextOrImage.height ();
            if (DEBUG) console.log ("width="+width+",height="+height);
            this.data = new Image (width, height);
            for (var x = 0; x < width; x ++) {
                for (var y = 0; y < height; y ++) {
                    const pixel = contextOrImage.get_pixel (x, y);
                    this.data.put_pixel (x, y, pixel);
                }
            }
            this.get_pixel = function (x, y) {
                return this.data.get_pixel (x, y);
            }
        }
        else if (contextOrImage instanceof Object) {    // NOTE actually Object is the class of LibreSprite app.activeImage
            this.width = contextOrImage.width;
            this.height = contextOrImage.height; 
            this.dimensions = [this.width, this.height];
            if (DEBUG) console.log ("width="+this.width+",height="+this.height);
            this.data = new Image (this.width, this.height);
            const color = contextOrImage.color;
            for (var x = 0; x < this.width; x ++) {
                for (var y = 0; y < this.height; y ++) {
                    const p = contextOrImage.getPixel (x, y);
                    this.data.put_pixel (x, y, [color.rgbaR (p), color.rgbaG (p), color.rgbaB (p)]);
                }
            }
            this.get_pixel = function (x, y) {
                return this.data.get_pixel (x, y);
            }
            this.put_pixel = function (x, y, data) {
                this.data.put_pixel (x, y, data);
            }
            this.sub_image = function (x, y, w, h) {
                const sub_pixels = new Image (w, h);
                for (var sub_x = 0; sub_x < w; sub_x ++) {
                    for (var sub_y = 0; sub_y < h; sub_y ++) {
                        sub_pixels.put_pixel (sub_x, sub_y, this.get_pixel (x + sub_x, y + sub_y));
                    }
                }
                sub_pixels.dimensions = [w, h];
                return sub_pixels;
            }
        }
        else {
            throw "Class " + contextOrImage.constructor.name + " not implemented";
        }
    }
}
