# AI-Powered Product Recommendation System

This project is a full-stack e-commerce application that delivers intelligent product recommendations using modern web technologies.

• **Backend** – FastAPI + SQLite (via SQLAlchemy) + Redis  
• **Frontend** – React 18 + Vite + Material-UI + Redux Toolkit

## Prerequisites

1. SQLite 3 (bundled with Python – no setup needed for development)
2. Redis 7+ running locally (default connection: `localhost:6379`)
3. Node ≥ 18 and npm ≥ 9 – for the frontend  
4. Python ≥ 3.11 – for the backend

---

## Getting Started

### 1. Backend (FastAPI)

```bash
# From the repository root
cd ai-product-recommendation-system

# Create & activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Upgrade pip and install dependencies
pip install -U pip
pip install -r requirements.txt

# Run the API with hot-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Environment variables can be provided via `.env` or your shell; the most important are:

```
# Optional—override default SQLite database path
DATABASE_URL=sqlite:///./sqlite.db
REDIS_URL=redis://localhost:6379/0
```

### 2. Frontend (Vite + React)

```bash
# From the repository root
cd ai-product-recommendation-system/frontend
npm install
npm run dev  # Starts Vite dev server at http://localhost:5173
```

---

## Project Structure (simplified)

```
ai-product-recommendation-system/
├── app/                 # FastAPI service (API, models, config)
├── frontend/            # React client (Vite)
├── requirements.txt
└── README.md            # (this file)
```

---

## Development Roadmap

The detailed plan is in `development_plan.md`. Phase 1 (project setup) is **complete**; Phase 2 focuses on authentication.

Contributions and bug reports are welcome!
