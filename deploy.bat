@echo off
echo === Starting Deployment ===
echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Starting server...
call npm start
