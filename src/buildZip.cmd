set VERSION=0.0.1
call buildSingleFileJS.cmd
7z a -r -tzip libresprite-extensions-%VERSION%.zip ..\*.js 
