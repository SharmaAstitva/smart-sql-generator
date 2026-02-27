# ============================================================
# routers/upload.py
# Handles .sql file upload OR MySQL credential connection
# ============================================================
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from pydantic import BaseModel
from services import db_service, schema_service

router = APIRouter()


# ── 1. Connect via MySQL credentials ──────────────────────────────────────────

class MySQLCredentials(BaseModel):
    host: str = "localhost"
    port: int = 3306
    user: str
    password: str
    database: str


@router.post("/connect")
async def connect_mysql(creds: MySQLCredentials):
    """
    Accept MySQL credentials and verify connectivity.
    Stores the config in memory and extracts schema immediately.
    """
    try:
        db_service.set_connection_config(
            host=creds.host,
            port=creds.port,
            user=creds.user,
            password=creds.password,
            database=creds.database,
        )
        # Verify by extracting schema
        schema = schema_service.extract_schema()
        table_count = len(schema)
        return {
            "status": "connected",
            "database": creds.database,
            "tables_found": table_count,
            "message": f"✅ Connected! Found {table_count} table(s)."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── 2. Upload .sql file ────────────────────────────────────────────────────────

@router.post("/sql-file")
async def upload_sql_file(
    file: UploadFile = File(...),
    database: str = Form(...),
    host: str = Form("localhost"),
    port: int = Form(3306),
    user: str = Form("root"),
    password: str = Form(""),
):
    """
    Accept a .sql file, import it into MySQL, then extract schema.
    The `database` field becomes the target DB name.
    """
    if not file.filename.endswith(".sql"):
        raise HTTPException(status_code=400, detail="Only .sql files are accepted.")

    try:
        content = await file.read()
        sql_text = content.decode("utf-8")

        db_name = db_service.import_sql_file(
            sql_content=sql_text,
            database=database,
            host=host,
            port=port,
            user=user,
            password=password,
        )

        schema = schema_service.extract_schema()
        return {
            "status": "imported",
            "database": db_name,
            "tables_found": len(schema),
            "message": f"✅ Imported '{file.filename}' into database '{db_name}'. Found {len(schema)} table(s)."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
