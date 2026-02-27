# ============================================================
# routers/query.py
# Takes a natural language question → returns structured SQL answer
# ============================================================
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services import schema_service, ai_service
from utils.formatter import format_schema_ascii, extract_sql_from_response

router = APIRouter()


class QueryRequest(BaseModel):
    question: str   # e.g. "Find all users who placed more than 3 orders"


class QueryResponse(BaseModel):
    question: str
    schema_ascii: str       # ASCII table view of the schema
    full_answer: str        # Complete AI markdown response
    extracted_sql: str      # Just the SQL query, extracted cleanly


@router.post("/", response_model=QueryResponse)
async def generate_query(request: QueryRequest):
    """
    Main endpoint:
    1. Load schema from cache
    2. Convert to text for AI prompt
    3. Call OpenAI
    4. Return structured response
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        # Step 1: Get schema
        schema = schema_service.get_cached_schema()
        if not schema:
            raise HTTPException(
                status_code=400,
                detail="No database schema found. Please connect to a database first."
            )

        # Step 2: Format schema for prompt
        schema_text = schema_service.schema_to_text(schema)
        schema_ascii = format_schema_ascii(schema)

        # Step 3: Call AI
        ai_response = await ai_service.generate_sql_answer(
            schema_text=schema_text,
            user_question=request.question
        )

        # Step 4: Extract clean SQL
        sql_only = extract_sql_from_response(ai_response)

        return QueryResponse(
            question=request.question,
            schema_ascii=schema_ascii,
            full_answer=ai_response,
            extracted_sql=sql_only,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
