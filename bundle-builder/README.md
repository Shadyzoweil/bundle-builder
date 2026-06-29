# Bundle Builder
A security bundle configurator. Shoppers pick cameras, a plan, sensors, and accessories across four guided steps, with a live review panel showing totals and savings.
## Prerequisites
- **Node.js** 18+ (20+ recommended)
- **Python** 3.11+
- **npm** (comes with Node)

## Quick start (development)
Run **both** servers — the frontend and backend.

```bash
1. Backend
cd bundle-builder-backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
API: http://127.0.0.1:8000
Docs: http://127.0.0.1:8000/docs

2. Frontend
In a second terminal:

cd bundle-builder
npm install
npm run dev
App: http://localhost:5173

3. Features
step builder — Cameras → Plan → Sensors → Accessories (BigCard accordion steps)
Live review panel — Selected items, before/after pricing, savings
Variant counters — Per-product color/variant quantities; plans toggle on/off
Step navigation — “Next” opens the following step; multiple steps can stay open
Save for later — “Save my system for later” writes the configuration to localStorage and restores it on reload
API endpoints
Endpoint	Description
GET /api/cameras
Camera products
GET /api/sensors
Sensor products
GET /api/accessories
Accessory products
GET /api/plans
Subscription plans
GET /media/*
Product images
Product data lives in bundle-builder-backend/data/*.json.

Design decisions & tradeoffs
State in App.tsx
Selection is a flat selectedProducts[] (category, title, variant, count).

Default selection on first visit
New users get a pre-filled starter bundle (e.g. 1× Cam v4, 2× Pan v3). Returning users with a saved system in localStorage get that instead.

Client-side persistence only
Save uses localStorage (bundle-builder-saved-system). No server sync — works offline, but not across devices or browsers. Save is explicit (click the link); changes after saving are not auto-persisted.

Multi-open steps
Open steps are tracked as a Set<number>. “Next” adds the next step without closing others; chevrons toggle individual steps.

Backend ↔ frontend coupling
The API serves images from the frontend assets/ folder. Convenient for dev, but ties deploy layout to this repo structure.

Shipping in review
Shipping is hardcoded in the UI (“FREE” / $5.99 strikethrough). main.py references a shipping.json file but no /api/shipping route is exposed.

