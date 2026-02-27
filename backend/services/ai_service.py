# ============================================================
# services/ai_service.py
# Sends schema + question to Groq and gets structured SQL output
# Groq is free, blazing fast, and uses OpenAI-compatible SDK
# Get your free API key at: https://console.groq.com
# ============================================================
from groq import AsyncGroq
from config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """
You are an expert MySQL query generator and SQL educator.

When given a database schema and a natural language question, you MUST respond in
this EXACT structured format — no deviations:

---
## Schema

For EACH relevant table, output:

Table: <TableName>
+------------------+--------------+
| Column Name      | Type         |
+------------------+--------------+
| <column>         | <type>       |
+------------------+--------------+
Primary Key: <column name> — <brief explanation of its role>

---
## Problem Statement

Restate the user's question clearly as a formal problem statement.

---
## SQL Solution

```sql
<Your optimized MySQL query here>
```

---
## Step-by-Step Explanation

Explain each clause used:
- **SELECT**: What columns are selected and why
- **FROM / JOIN**: Which tables are joined, what type of JOIN (INNER/LEFT/RIGHT), and why
- **WHERE**: Filtering logic applied (if any)
- **GROUP BY**: How rows are grouped (if any)
- **HAVING**: Post-aggregation filter (if any)
- **ORDER BY / LIMIT**: Sorting and limiting results (if any)
- **NULL behavior**: How NULLs might affect results (e.g., COUNT ignores NULLs, LEFT JOIN produces NULLs for missing matches)

Always explain JOIN type choice clearly. If no JOIN is needed, state why.
"""


async def generate_sql_answer(schema_text: str, user_question: str) -> str:
    """
    Calls OpenAI GPT-4 with the schema + question.
    Returns the full structured markdown response.
    """
    user_message = f"""
Database Schema:
{schema_text}

Question:
{user_question}
"""

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Best free Groq model for SQL
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_message},
        ],
        temperature=0.2,   # Low temp = more deterministic SQL
        max_tokens=2000,
    )

    return response.choices[0].message.content
