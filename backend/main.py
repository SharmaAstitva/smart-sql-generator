# ============================================================
# main.py - Entry point for the Smart SQL Generator API
# ============================================================

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import schema, query, upload
from services.db_service import set_connection_config

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Smart SQL Query Generator",
    description="Upload a DB schema, ask in plain English, get perfect SQL.",
    version="1.0.0"
)

# Configure DB connection at startup using environment variables
set_connection_config(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://smart-sql-generator.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route groups
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(schema.router, prefix="/api/schema", tags=["Schema"])
app.include_router(query.router,  prefix="/api/query",  tags=["Query"])


@app.get("/")
def root():
    return {"message": "Smart SQL Generator API is running ✅"}