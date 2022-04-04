REM This script finds all *.ts files (recursivly in all sub directories)
REM and removes the associated *.js and *.js.map files.
REM the folder "node_modules" is excluded from this process.

@echo off
echo Removing transpiled files. Please wait...

for /R %%I in (*.ts) do (
    (Echo "%%~pI" | FIND /I "node_modules" 1>NUL) || (
        if exist %%~pI%%~nI.js del %%~pI%%~nI.js
        if exist %%~pI%%~nI.js.map del %%~pI%%~nI.js.map
    )
)

echo Done