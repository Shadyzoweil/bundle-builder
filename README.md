# Bundle Builder

Backend & responsive design

The backend serves product data from separate JSON files per category 
(cameras.json, sensors.json, accessories.json, and plans.json in bundle-builder-backend/data/), 
so each step of the bundle builder maps cleanly to its own API endpoint. 
The frontend is fully responsive across desktop, tablet, and mobile breakpoints, 
so the layout adapts smoothly as the viewport width changes.

**Project structure**
bundle-builder/ → React + Vite frontend 
bundle-builder-backend/ → FastAPI backend

---

**Prerequisites**

- Node.js 18+
- Python 3.11+
- npm

---

**Install & run (local)**

Run the **backend** and **frontend** in two terminals.

1. Backend


```bash
cd bundle-builder-backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

-API: http://127.0.0.1:8000
-Docs: http://127.0.0.1:8000/docs

---
2. Frontend

cd bundle-builder
npm install
npm run dev

frontend: http://localhost:5173

