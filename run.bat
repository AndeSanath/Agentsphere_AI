@echo off
echo ===================================================
echo   Starting AgentSphere AI (Deloitte Capstone)
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "AgentSphere Backend" cmd /k "cd backend && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Vite Frontend on http://localhost:3000 ...
start "AgentSphere Frontend" cmd /k "cd frontend && npm run dev -- --port 3000"

echo.
echo ===================================================
echo   AgentSphere AI is starting!
echo   - Web UI:     http://localhost:3000
echo   - Swagger API: http://localhost:8000/docs
echo ===================================================
