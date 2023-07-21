(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const col = app.pixelColor
const img = app.activeImage

for (var y=0; y<img.height; ++y) {
  for (var x=0; x<img.width; ++x) {
    const c = img.getPixel(x, y)
    img.putPixel(x, y,
                 col.rgba(col.rgbaR(c) * 0.9,
                          col.rgbaG(c) * 0.9,
                          col.rgbaB(c) * 0.9,
                          col.rgbaA(c))
    )
  }
}

},{}]},{},[1]);
