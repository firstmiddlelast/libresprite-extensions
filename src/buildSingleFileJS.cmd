call setVersion.cmd
@for %%f in (*.mjs) do @if /I "%%~xf" EQU ".mjs" @for /F %%d in ('stat -c "%%Y" %%f') do @for /F %%e in ('stat -c "%%Y" %%~dpf..\%%~nf.js ^|^| echo 0') do (if %%d GTR %%e (browserify %%f -p esmify -o %%~dpf..\%%~nf.js && echo const VERSION="%VERSION%" >> %%~dpf..\%%~nf.js))
