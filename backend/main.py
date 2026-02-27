# ============================================================
# main.py - Entry point for the Smart SQL Generator API
# ============================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import schema, query, upload

app = FastAPI(
    title="Smart SQL Query Generator",
    description="Upload a DB schema, ask in plain English, get perfect SQL.",
    version="1.0.0"
)

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route groups
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(schema.router,  prefix="/api/schema",  tags=["Schema"])
app.include_router(query.router,   prefix="/api/query",   tags=["Query"])

@app.get("/")
def root():
    return {"message": "Smart SQL Generator API is running ✅"}
