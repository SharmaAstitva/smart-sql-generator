# ============================================================
# services/db_service.py
# Handles MySQL connections — both from credentials and .sql files
# ============================================================
import mysql.connector
import tempfile
import subprocess
import os
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
    """Return a live MySQL connection using cached config."""
    if not _active_db_config:
        raise ConnectionError("No database connection configured. Please connect first.")
    return mysql.connector.connect(**_active_db_config)


def import_sql_file(sql_content: str, database: str, host: str = "localhost",
                    port: int = 3306, user: str = "root", password: str = "") -> str:
    """
    Create a new DB from a .sql file upload.
    Steps:
      1. Create the database if it doesn't exist.
      2. Write the SQL to a temp file.
      3. Run `mysql` CLI to import it.
    Returns the database name on success.
    """
    # 1. Create database
    conn = mysql.connector.connect(host=host, port=port, user=user, password=password)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database}`")
    conn.commit()
    cursor.close()
    conn.close()

    # 2. Write to temp file
    with tempfile.NamedTemporaryFile(suffix=".sql", mode="w", delete=False) as f:
        f.write(sql_content)
        tmp_path = f.name

    # 3. Import using mysql CLI
    cmd = ["mysql", f"-h{host}", f"-P{port}", f"-u{user}"]
    if password:
        cmd.append(f"-p{password}")
    cmd.append(database)

    with open(tmp_path, "r") as sql_file:
        result = subprocess.run(cmd, stdin=sql_file, capture_output=True, text=True)

    os.unlink(tmp_path)  # Clean up temp file

    if result.returncode != 0:
        raise RuntimeError(f"MySQL import failed: {result.stderr}")

    # Cache the connection for future requests
    set_connection_config(host, port, user, password, database)
    return database
