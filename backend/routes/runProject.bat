@echo off
title Run E-Commerce Project

REM Optional: Run Seeder
echo Running Seeder to populate products...
cd backend
start cmd /k "node seeder.js"
cd ..

timeout /t 3

REM Run Backend
echo Starting Backend Server...
cd backend
start cmd /k "node server.js"
cd ..

timeout /t 3

REM Run Frontend
echo Starting Frontend...
cd frontend
start cmd /k "live-server"
cd ..

echo All done! Project is running.
pause