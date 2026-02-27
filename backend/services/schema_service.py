# ============================================================
# services/schema_service.py
# Extracts full DB schema using SHOW TABLES + DESCRIBE
# ============================================================
from services.db_service import get_connection
from typing import Dict, List

# Module-level schema cache (JSON-like dict)
_schema_cache: Dict[str, List[dict]] = {}


def extract_schema() -> Dict[str, List[dict]]:
    """
    Fetch all tables and their columns from the connected MySQL database.

    Returns a dict like:
    {
      "users": [
        {"Field": "id", "Type": "int", "Null": "NO", "Key": "PRI", ...},
        ...
      ],
      ...
    }
    """
    global _schema_cache
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Get all table names
    cursor.execute("SHOW TABLES")
    tables = [list(row.values())[0] for row in cursor.fetchall()]

    schema = {}
    for table in tables:
        cursor.execute(f"DESCRIBE `{table}`")
        columns = cursor.fetchall()
        schema[table] = columns

    cursor.close()
    conn.close()

    _schema_cache = schema
    return schema


def get_cached_schema() -> Dict[str, List[dict]]:
    """Return the last extracted schema without re-querying MySQL."""
    if not _schema_cache:
        return extract_schema()
    return _schema_cache


def schema_to_text(schema: Dict[str, List[dict]]) -> str:
    """
    Convert the schema dict to a compact text representation
    suitable for sending to the AI prompt.

    Example output:
    Table: users | Columns: id (int) [PK], name (varchar(100)), email (varchar(200))
    """
    lines = []
    for table, columns in schema.items():
        col_parts = []
        for col in columns:
            part = f"{col['Field']} ({col['Type']})"
            if col.get("Key") == "PRI":
                part += " [PK]"
            if col.get("Key") == "MUL":
                part += " [FK]"
            if col.get("Null") == "NO" and col.get("Key") != "PRI":
                part += " NOT NULL"
            col_parts.append(part)
        lines.append(f"Table: {table} | Columns: {', '.join(col_parts)}")
    return "\n".join(lines)
