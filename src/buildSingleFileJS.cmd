for %%f in (*.mjs) do if /I "%%~xf" EQU ".mjs" browserify %%f -p esmify -o %%~dpf..\%%~nf.js
