# ============================================================
# routers/schema.py
# Exposes schema data as JSON and ASCII table
# ============================================================
from fastapi import APIRouter, HTTPException
from services import schema_service
from utils.formatter import format_schema_ascii

router = APIRouter()


@router.get("/")
async def get_schema():
    """
    Return the full schema as JSON.
    Frontend uses this to display the connected DB structure.
    """
    try:
        schema = schema_service.get_cached_schema()
        return {"schema": schema, "table_count": len(schema)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ascii")
async def get_schema_ascii():
    """
    Return the schema formatted as ASCII tables.
    Useful for display/copy-paste in the UI.
    """
    try:
        schema = schema_service.get_cached_schema()
        ascii_output = format_schema_ascii(schema)
        return {"ascii_schema": ascii_output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh")
async def refresh_schema():
    """Force re-extraction of schema from the database."""
    try:
        schema = schema_service.extract_schema()
        return {
            "message": "Schema refreshed successfully.",
            "table_count": len(schema)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
