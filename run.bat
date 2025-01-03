@echo off

:: Set the frontend and backend directories
SET FRONTEND_DIR=angular
SET BACKEND_DIR=backend

:: Start the frontend server in a new command prompt window
start cmd /k "cd %FRONTEND_DIR% && npm install && npm start"

:: Start the backend server in a new command prompt window
start cmd /k "cd %BACKEND_DIR% && npm install && npm start"

:: Pause to keep the batch script window open (optional)
pause
