#!/bin/bash
# Startup script for AgentSphere AI

echo "🚀 Starting AgentSphere AI Backend (FastAPI)..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "🚀 Starting AgentSphere AI Frontend (Vite)..."
cd ../frontend
npm run dev -- --host &
FRONTEND_PID=$!

echo "✅ AgentSphere AI is live!"
echo "   - Frontend UI: http://localhost:3000"
echo "   - Backend API: http://localhost:8000/docs"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
