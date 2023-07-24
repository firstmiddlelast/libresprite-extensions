/* EDIT THE FOLLOWING LINES TO FIT YOUR NEEDS */
const TILE_SIZE = 8;
const TARGET_TILES_COUNT = 256;










const rgb = require ('./lib/rgb.mjs');

const DEBUG = false;

const color = app.pixelColor;
const image = app.activeImage;
const tiles = [];

const pixelDistance = function (p1, p2) {
    return rgb.rgbDistance (
        color.rgbaR (p1), color.rgbaG (p1), color.rgbaB (p1), 
        color.rgbaR (p2), color.rgbaG (p2), color.rgbaB (p2)
    );
}



tileDistances = [];
const duplicates = [];
for (var x = 0; x < image.width; x += TILE_SIZE) {
    for (var y = 0; y < image.height; y += TILE_SIZE) {
        duplicates [[x, y]] = [];
        for (var tileIndex = 0; tileIndex < tiles.length; tileIndex ++) {
            var tileDistance = 0;
            for (var tileX = 0; tileX < TILE_SIZE; tileX ++) {
                for (var tileY = 0; tileY < TILE_SIZE; tileY ++) {
                    tileDistance += pixelDistance (image.getPixel (x + tileX, y + tileY), image.getPixel (tiles [tileIndex].x + tileX, tiles [tileIndex].y + tileY));
                }
            }
            if (tileDistance === 0) {
                tiles [tileIndex].count = tiles [tileIndex].count + 1;
                duplicates [[tiles [tileIndex].x, tiles [tileIndex].y]].push ({x: x, y: y});
                break;
            }
            else {
                tileDistances.push ({x1: x, y1: y, x2: tiles [tileIndex].x, y2: tiles [tileIndex].y, d: tileDistance});
            }
        }
        if (tileIndex === tiles.length) {
            tiles.push ({x: x, y: y, count: 1});
        }
    }
}
tiles.sort ((t1, t2) => t1.count - t2.count);
if (DEBUG) console.log ("unique tiles : " + tiles.length + ", min count : " + tiles [0].count + ", max count : " + tiles [tiles.length - 1].count);
tileDistances.sort ((t1, t2) => t1.d - t2.d);
if (DEBUG) {
    var c = 4;
    for (tile of tileDistances) {
        console.log ("distance between ", tile.x1, tile.y1, tile.x2, tile.y2, tile.d);
        if (c--===0) break;
    }
}


const updatedTiles = [];
function copyTile (sourceX, sourceY, destinationX, destinationY) {
    if (updatedTiles [[tile1.x, tile1.y]] === undefined) {
        if (DEBUG) console.log ("copying " + sourceX + "," + sourceY + " into " + destinationX + "," + destinationY);
        updatedTiles[[destinationX, destinationY]] = [sourceX, sourceY];
        duplicates [[sourceX, sourceY]].push ({x: destinationX, y: destinationY});
        if (duplicates [[destinationX, destinationY]].length === 0) {
            uniqueTilesCount --;
        }
        else {
            duplicates [[destinationX, destinationY]] = duplicates [[destinationX, destinationY]].filter (e => e.x !== sourceX || e.y !== sourceY);
        }
        for (var tileX = 0; tileX < TILE_SIZE; tileX ++) {
            for (var tileY = 0; tileY < TILE_SIZE; tileY ++) {
                image.putPixel (destinationX + tileX, destinationY + tileY, image.getPixel (sourceX + tileX, sourceY + tileY));
                if (DEBUG && (tileX === 0 || tileX === TILE_SIZE - 1 || tileY === 0 || tileY === TILE_SIZE - 1)) {
                    image.putPixel (destinationX + tileX, destinationY + tileY, color.rgba (255, 0, 0, 255));
                    image.putPixel (sourceX + tileX, sourceY + tileY, color.rgba (0, 255, 0, 255));
                }
            }
        }
        return true;
    }
    else {
        return false;
    }
}

var replacements_count = -1; // DEBUG
var uniqueTilesCount = tiles.length;
while (uniqueTilesCount > TARGET_TILES_COUNT && replacements_count !== 0 && tileDistances.length > 0) {
    const closestTiles = tileDistances.shift ();
    var tile1 = undefined;
    for (tile of tiles) if (tile.x === closestTiles.x1 && tile.y === closestTiles.y1) {
        tile1 = tile;
        break;
    }
    if (tile1 === undefined) continue;
    var tile2 = undefined;
    for (tile of tiles) if (tile.x === closestTiles.x2 && tile.y === closestTiles.y2) {
        tile2 = tile;
        break;
    }
    if (tile1 === undefined) continue;
    if (tile1.count > tile2.count) {
        tile = tile2; 
        tile2 = tile1; 
        tile1 = tile;
    }

    replacements_count --;
    var replaced = copyTile (tile2.x, tile2.y, tile1.x, tile1.y);
    if (DEBUG) console.log ("tile ", tile1.x, tile1.y, "has", duplicates [[tile1.x, tile1.y]].length, "duplicates");
    for (var duplicate of duplicates [[tile1.x, tile1.y]]) {
        replaced = replaced || copyTile (tile2.x, tile2.y, duplicate.x, duplicate.y);
    }
}
if (DEBUG) console.log ("Replacement attempts left:" +replacements_count);
