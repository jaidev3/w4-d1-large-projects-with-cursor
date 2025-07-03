from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.database import Base, engine
from .api.products import router as products_router
from .api.auth import router as auth_router
from .api.interactions import router as interactions_router
from .core.config import get_settings

# Create database tables (in production, use Alembic migrations instead)
Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(title=settings.app_name, version="1.0.0")

# CORS (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(interactions_router, prefix="/api")


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the AI Product Recommendation System API"} 