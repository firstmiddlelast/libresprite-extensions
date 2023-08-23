set VERSION=0.0.4
call buildSingleFileJS.cmd
7z a -r -tzip libresprite-extensions-%VERSION%.zip ..\*.js 
7z d -tzip libresprite-extensions-%VERSION%.zip ..\*-WIP.js 
