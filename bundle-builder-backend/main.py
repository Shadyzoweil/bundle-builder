import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
CAMERAS_FILE = BASE_DIR / "data" / "cameras.json"
SENSORS_FILE = BASE_DIR / "data" / "sensors.json"
PLANS_FILE = BASE_DIR / "data" / "plans.json"
ACCESSORIES_FILE = BASE_DIR / "data" / "accessories.json"
SHIPPING_FILE = BASE_DIR / "data" / "shipping.json"
ASSETS_DIR = BASE_DIR.parent / "bundle-builder-frontend" / "src" / "assets"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://bundle-builder-two.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Bundle Builder API"}


@app.get("/api/cameras")
def get_cameras():
    with open(CAMERAS_FILE, encoding="utf-8") as file:
        return json.load(file)


@app.get("/api/sensors")
def get_sensors():
    with open(SENSORS_FILE, encoding="utf-8") as file:
        return json.load(file)


@app.get("/api/plans")
def get_plans():
    with open(PLANS_FILE, encoding="utf-8") as file:
        return json.load(file)


@app.get("/api/accessories")
def get_accessories():
    with open(ACCESSORIES_FILE, encoding="utf-8") as file:
        return json.load(file)


if ASSETS_DIR.is_dir():
    app.mount("/media", StaticFiles(directory=ASSETS_DIR), name="media")
