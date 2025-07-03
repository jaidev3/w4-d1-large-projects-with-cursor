from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import get_settings

settings = get_settings()

# Create SQLAlchemy engine
engine = create_engine(settings.database_url, echo=settings.environment == "development", future=True)

# Create a configured "Session" class
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# Base class for models
Base = declarative_base()


def get_db():
    """Provide a transactional scope for database operations."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 