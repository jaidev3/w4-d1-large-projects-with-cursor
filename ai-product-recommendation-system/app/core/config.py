from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration loaded from environment variables or .env file."""

    # Application
    app_name: str = "AI Product Recommendation System"
    environment: str = "development"  # development | production | testing

    # Database
    database_url: str = (
        f"sqlite:///{Path(__file__).resolve().parent.parent.parent}/sqlite.db"
    )
    
    # JWT Authentication
    secret_key: str = "your-secret-key-here-please-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Return a cached instance of the application settings."""

    return Settings() 