# ============================================================
# services/db_service.py
# Handles MySQL (TiDB) connections — cloud compatible
# ============================================================

import mysql.connector
from typing import Optional

# In-memory cache: stores the last active connection config
_active_db_config: dict = {}


def set_connection_config(host: str, port: int, user: str, password: str, database: str):
    """Save DB credentials to the in-memory cache."""
    global _active_db_config
    _active_db_config = {
        "host": host,
        "port": port,
        "user": user,
        "password": password,
        "database": database,
    }


def get_connection():
    """Return a live MySQL (TiDB) connection using cached config."""
    if not _active_db_config:
        raise ConnectionError("No database connection configured. Please connect first.")

    return mysql.connector.connect(
        host=_active_db_config["host"],
        port=_active_db_config["port"],
        user=_active_db_config["user"],
        password=_active_db_config["password"],
        database=_active_db_config["database"],
        ssl_disabled=False  # Required for TiDB Cloud
    )


def import_sql_file(
    sql_content: str,
    database: str,
    host: str,
    port: int,
    user: str,
    password: str
) -> str:
    """
    Import SQL content directly using mysql connector (cloud safe).
    No CLI usage. Works on Render.
    """

    # 1️⃣ Create database if it doesn't exist
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        ssl_disabled=False
    )

    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database}`")
    conn.commit()
    cursor.close()
    conn.close()

    # 2️⃣ Connect to the new database
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
        ssl_disabled=False
    )

    cursor = conn.cursor()

    # 3️⃣ Execute SQL statements one by one
    statements = sql_content.split(";")
    for statement in statements:
        statement = statement.strip()
        if statement:
            cursor.execute(statement)

    conn.commit()
    cursor.close()
    conn.close()

    # Cache connection for future use
    set_connection_config(host, port, user, password, database)

    return database