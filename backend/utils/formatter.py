# ============================================================
# utils/formatter.py
# Converts schema dict to ASCII table format (LeetCode-style)
# ============================================================
from typing import Dict, List


def format_schema_ascii(schema: Dict[str, List[dict]]) -> str:
    """
    Render the full schema as ASCII tables.

    Example:
    Table: users
    +-------------+--------------+-----+-----+
    | Field       | Type         | Key | Null|
    +-------------+--------------+-----+-----+
    | id          | int          | PRI | NO  |
    | name        | varchar(100) |     | YES |
    +-------------+--------------+-----+-----+
    """
    output = []
    for table, columns in schema.items():
        output.append(f"Table: {table}")

        # Determine column widths
        headers = ["Field", "Type", "Key", "Null", "Default"]
        col_widths = {h: len(h) for h in headers}

        for col in columns:
            for h in headers:
                val = str(col.get(h, "") or "")
                if len(val) > col_widths[h]:
                    col_widths[h] = len(val)

        # Build separator line
        sep = "+" + "+".join("-" * (col_widths[h] + 2) for h in headers) + "+"

        # Header row
        header_row = "|" + "|".join(
            f" {h:<{col_widths[h]}} " for h in headers
        ) + "|"

        output.append(sep)
        output.append(header_row)
        output.append(sep)

        # Data rows
        for col in columns:
            row = "|" + "|".join(
                f" {str(col.get(h, '') or ''):<{col_widths[h]}} " for h in headers
            ) + "|"
            output.append(row)

        output.append(sep)
        output.append("")  # Blank line between tables

    return "\n".join(output)


def extract_sql_from_response(ai_response: str) -> str:
    """
    Pull just the SQL query out of the AI's markdown response.
    Looks for ```sql ... ``` block.
    """
    import re
    match = re.search(r"```sql\s*(.*?)\s*```", ai_response, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""
