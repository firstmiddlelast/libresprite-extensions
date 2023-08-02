(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var gridType = "HORIZONTAL";
const image = app.activeImage;
if (image === undefined) throw "Draw the left-to-bottom edge line of the tile please.";
const pixel = image.getPixel (0, 0);
if (pixel === 0) throw "Plot the bottom right of the grid please.";

if (image.height === 0) throw "Draw the left-to-bottom edge line of the diamond please.";
var y = 0;
const steps = [];
while (image.getPixel (0, y) !== 0) {
    y ++;
    if (y === image.height) throw "Plot the bottom right of the grid please.";
}
if (y > 1) gridType = "VERTICAL";
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
    if (gridType === "VERTICAL") {
        for (var h = 0; h < tileHeight; h ++) {
            putPixel (x, y + h);
        }
    }
    for (var step of steps) {
        x += step [0];
        y += step [1];
        yTop -= step [1];
        putPixel (x, y);
        if (gridType === "HORIZONTAL") {
            putPixel (x, yTop);
        }
    }
    if (gridType === "VERTICAL") {
        for (var h = 0; h < tileHeight; h ++) {
            putPixel (x, y + h);
        }
    }
    for (var step of steps) {
        x += step [0];
        y -= step [1];
        yTop += step [1];
        putPixel (x, y);
        if (gridType === "HORIZONTAL") {
            putPixel (x, yTop);
        }
    }
    if (gridType === "VERTICAL") {
        for (var h = 0; h < tileHeight; h ++) {
            putPixel (x, y + h);
        }
    }
    if (x > image.width) {
        if (gridType === "HORIZONTAL") {
            y += tileDepth * 2;
            yTop += tileDepth * 2;
        }
        else {
            y += tileHeight;
        }
        x = 0;
    }
}


},{}]},{},[1]);
