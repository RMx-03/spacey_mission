from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    app_name: str = Field(default="Spacey Mission API")
    app_env: str = Field(default="dev")
    app_host: str = Field(default="0.0.0.0")
    app_port: int = Field(default=8000)

    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost:5174"])  # Vite dev servers

    database_url: str = Field(default="postgresql+asyncpg://spacey:spacey@db:5432/spacey")
    redis_url: str = Field(default="redis://redis:6379/0")

    # Providers
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    google_api_key: str | None = None

    # Firebase
    firebase_project_id: str | None = None
    firebase_credentials_file: str | None = None

    # Observability
    prometheus_enabled: bool = Field(default=True)
    sentry_dsn: str | None = None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    # Parse comma-separated origins if provided
    if isinstance(settings.cors_origins, str):
        settings.cors_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    return settings


