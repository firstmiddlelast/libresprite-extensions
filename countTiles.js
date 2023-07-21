(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* EDIT THE FOLLOWING LINE TO FIT YOUR NEEDS */
const TILE_SIZE = 8;












const DEBUG = false;

const color = app.pixelColor;
const image = app.activeImage;
const tiles = [];

for (var x = 0; x < image.width; x += TILE_SIZE) {
    for (var y = 0; y < image.height; y += TILE_SIZE) {
        for (var tileIndex = 0; tileIndex < tiles.length; tileIndex ++) {
            var tileMatches = true;
            for (var tileX = 0; tileMatches && tileX < TILE_SIZE; tileX ++) {
                for (var tileY = 0; tileMatches && tileY < TILE_SIZE; tileY ++) {
                    tileMatches = (image.getPixel (x + tileX, y + tileY) === image.getPixel (tiles [tileIndex].x + tileX, tiles [tileIndex].y + tileY));
                }
            }
            if (tileMatches) {
                tiles [tileIndex].count = tiles [tileIndex].count + 1;
                if (DEBUG) console.log ("tile # " + tileIndex + " found @" + x + "," + y);
                break;
            }
        }
        if (tileIndex === tiles.length) {
            tiles.push ({x: x, y: y, count: 1});
            if (DEBUG) console.log ("New tile # " + tileIndex + " @" + x + "," + y);
        }
    }
}
tiles.sort ((t1, t2) => t1.count - t2.count);
console.log ("unique tiles : " + tiles.length + ", min count : " + tiles [0].count + ", max count : " + tiles [tiles.length - 1].count);
var lastCount;
var countText = "";
for (var tile of tiles) {
    if (lastCount !== tile.count) {
        console.log (countText);
        countText = tile.count + " : ";
        lastCount = tile.count;
    }
    countText += tile.x + "," + tile.y + "  ";
}
console.log (countText);

},{}]},{},[1]);
