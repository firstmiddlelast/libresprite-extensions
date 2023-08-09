set VERSION=0.0.3
call buildSingleFileJS.cmd
7z a -r -tzip libresprite-extensions-%VERSION%.zip ..\*.js 
