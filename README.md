# FormFix
Webcam exercise form checker — live skeleton overlay plus AI coaching on technique.

## Stack
- Frontend: React + Vite + MediaPipe Tasks Vision (runs in browser, no video leaves device)
- Backend: Flask + OpenAI-compatible API

## Quick start
1. cd backend && pip install -r requirements.txt && cp .env.example .env && python app.py
2. cd frontend && npm install && npm run dev
3. Allow webcam access, select an exercise, move — get AI feedback

## Privacy
All pose estimation runs locally in your browser. Only anonymized joint-angle data is sent to the backend.
