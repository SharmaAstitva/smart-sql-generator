# ============================================================
# config.py - Loads all environment variables safely
# ============================================================
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Groq (free) - get key at https://console.groq.com
    GROQ_API_KEY: str

    # MySQL connection (used when user provides credentials)
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = ""
    MYSQL_DATABASE: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
