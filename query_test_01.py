import os
import psycopg2
import time
import json
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from translation_service import TranslationService 

# Load .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Load full schema JSON as string
def load_schema_raw(json_path="database_schema.json"):
    with open(json_path, "r") as f:
        return f.read()

SCHEMA_JSON = load_schema_raw("database_schema.json")

# Prompt template
PROMPT_TEMPLATE = """You are an expert SQL generator.
The database schema is given below in JSON format:

{schema_json}

Rules:
- Generate only a valid PostgreSQL SELECT query.
- Use only the tables and columns that appear in the JSON schema above.
- Do not invent new columns or tables.
- Do not include explanations, comments, or anything else.
- Do not use multiple statements, only one SQL query.
- For any user input involving state, district, or assessment_unit_name, use the PostgreSQL pg_trgm extension's fuzzy matching operator (%) in the WHERE clause. For example: WHERE state % 'user_input' or assessment_unit_name % 'user_input'.
- Only output the SQL query. Do not include any explanation or formatting.

Question: {question}
SQL:
"""

def get_sql_from_gemini(question: str) -> str:
    prompt = PROMPT_TEMPLATE.format(schema_json=SCHEMA_JSON, question=question)
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    response = model.generate_content(prompt)
    return response.text.strip().strip("```sql").strip("```").strip()

def execute_sql(sql: str):
    print("Hello IN EXECUTE SQL FUNCTION:", sql)
    try:
        conn = psycopg2.connect(
            host=DB_HOST, port=DB_PORT,
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
        )
        cur = conn.cursor()
        start = time.time()
        cur.execute(sql)
        rows = cur.fetchall()
        end = time.time()
        cols = [desc[0] for desc in cur.description]
        cur.close()
        conn.close()
        return cols, rows, end - start
    except Exception as e:
        print("Error: ", e)
        return [], [], 0

def main():
    # Example user questions
    questions = [
        "What was the total rainfall in Telangana in 2019?",
        "List the districts in Andaman and Nicobar Islands with their groundwater recharge in 2016.",
        "Retrieve the categorization of groundwater for Jayashankar Bhupalapally district in 2019."
    ]

    for q in questions:
        print("\n" + "="*60)
        print(f"Question: {q}")
        sql = get_sql_from_gemini(q)
        print(f"Generated SQL-Query:\n{sql}")

        try:
            cols, rows, duration = execute_sql(sql)
            print("Retrieved data:")
            print([tuple(cols)])
            for r in rows[:10]:  # show only first 10 rows
                print(r)
            print(f"Time-taken: {duration:.3f} seconds")
        except Exception as e:
            print("Error executing query:", e)


# --- FastAPI endpoint ---

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/forecast")
async def forecast_endpoint(request: Request):
    data = await request.json()
    question = data.get("question", "")
    print("[DEBUG] Received forecast question:", question)
    if not question:
        return JSONResponse({"error": "No question provided."}, status_code=400)

    # No translation, use question as-is
    try:
        # Encourage inclusion of time column for proper forecasting
        enriched_question = (
            question
            + "\n\nPlease return the 'year' column and the main numeric measure needed for this question. "
              "Ensure results include all available years up to the latest in the database, "
              "with rows sorted by year ascending. Do not aggregate unless asked."
        )
        sql = get_sql_from_gemini(enriched_question)
        print("[DEBUG] Generated SQL for forecast:", sql)
    except Exception as e:
        return JSONResponse({"error": f"Gemini SQL generation failed: {e}"}, status_code=500)
    try:
        cols, rows, duration = execute_sql(sql)
        print(f"[DEBUG] SQL executed. Columns: {cols}, Rows: {len(rows)}, Duration: {duration:.3f}s")
        table = [dict(zip(cols, r)) for r in rows]
    except Exception as e:
        return JSONResponse({"error": f"SQL execution failed: {e}", "sql": sql}, status_code=500)
    try:
        # Prepare data for LLM forecasting
        import datetime
        def convert_for_json(obj):
            if isinstance(obj, dict):
                return {k: convert_for_json(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_for_json(i) for i in obj]
            elif hasattr(obj, 'as_tuple') and obj.__class__.__name__ == 'Decimal':
                return float(obj)
            elif isinstance(obj, (datetime.datetime, datetime.date)):
                return obj.isoformat()
            else:
                return obj

        table_for_llm = convert_for_json(table)
        # Compose a detailed prompt for forecasting with new requirements
        forecast_prompt = f"""
You are an expert data scientist. Given the following SQL query and its results, forecast the next value(s) for the relevant time period (e.g., next year).\n Question: {question}\nSQL Query:\n{sql}\n\nResults:\n{json.dumps(table_for_llm, indent=2)}\n\nReturn ONLY a valid JSON array of objects, where each object has:\n- 'year': the year (existing or predicted)\n- 'value': the value for that year\n- 'existing': true if it is from the original data, false if it is a prediction\n\nAlso, provide a separate string (not in the array) called 'reason' explaining why the predicted values were given.\n\nReturn a JSON object with two keys:\n- 'data': the array of year/value/existing objects\n- 'reason': the reasoning string\n\nReturn ONLY a valid JSON object with this structure. Do not include any explanation or text outside the JSON.\n"""
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        forecast_response = model.generate_content(forecast_prompt)
        # Try to extract JSON from the response
        import re
        import json as pyjson
        match = re.search(r'\{[\s\S]*\}', forecast_response.text)
        if match:
            forecast_json = match.group(0)
            try:
                forecast_data = pyjson.loads(forecast_json)
            except Exception as e:
                print("[ERROR] Could not parse LLM JSON:", e)
                forecast_data = {"data": [], "reason": "Could not parse LLM output."}
        else:
            forecast_data = {"data": [], "reason": "No forecast data returned."}
        print("[DEBUG] LLM forecast generated.")
        return {"forecast": forecast_data, "sql": sql, "duration": duration}
    except Exception as e:
        return JSONResponse({"error": f"LLM forecasting failed: {e}", "sql": sql}, status_code=500)
    
     # --- Holistic View Endpoints ---
@app.get("/dashboard/pie")
async def dashboard_pie():
    # State-wise pie chart of groundwater categories
    sql = """
        SELECT state, categorization, COUNT(*) as count
        FROM attribute_data
        WHERE categorization IS NOT NULL
        GROUP BY state, categorization
        ORDER BY count DESC
    """
    cols, rows, _ = execute_sql(sql)
    return [dict(zip(cols, r)) for r in rows]

@app.get("/dashboard/trend")
async def dashboard_trend():
    sql = """
        SELECT 
            year,
            SUM(CASE WHEN total_annual_ground_water_recharge_ham::text ~ '^[0-9.]+$' THEN total_annual_ground_water_recharge_ham::numeric ELSE 0 END) as recharge,
            SUM(CASE WHEN total_extraction_ham::text ~ '^[0-9.]+$' THEN total_extraction_ham::numeric ELSE 0 END) as extraction
        FROM attribute_data
        WHERE year ~ '^[0-9]{4}$' AND year::integer >= EXTRACT(YEAR FROM CURRENT_DATE) - 9
        GROUP BY year
        ORDER BY year::integer
    """
    cols, rows, _ = execute_sql(sql)
    return [dict(zip(cols, r)) for r in rows]

@app.get("/dashboard/bar")
async def dashboard_bar():
    sql = """
        SELECT 
            assessment_unit_name AS block,
            state,
            CASE 
                WHEN stage_of_ground_water_extraction_pct IS NULL 
                     OR stage_of_ground_water_extraction_pct::text = 'NaN'
                THEN 0
                ELSE stage_of_ground_water_extraction_pct
            END AS stage_of_ground_water_extraction_pct
        FROM attribute_data
        WHERE year = '2024'
        ORDER BY stage_of_ground_water_extraction_pct DESC
        LIMIT 10
    """
    cols, rows, _ = execute_sql(sql)
    import math
    result = []
    for r in rows:
        row_dict = dict(zip(cols, r))
        val = row_dict.get("stage_of_ground_water_extraction_pct")
        if val is not None:
            try:
                fval = float(val)
                if math.isnan(fval) or math.isinf(fval):
                    row_dict["stage_of_ground_water_extraction_pct"] = 0
                else:
                    row_dict["stage_of_ground_water_extraction_pct"] = fval
            except Exception:
                row_dict["stage_of_ground_water_extraction_pct"] = 0
        result.append(row_dict)
    return result

@app.get("/dashboard/map")
async def dashboard_map():
    # State-wise groundwater status: show most critical status per state
    # Priority: over-exploited > critical > semi-critical > safe
    sql = """
        SELECT 
            state,
            COUNT(*) as total_blocks,
            SUM(CASE WHEN categorization = 'safe' THEN 1 ELSE 0 END) as safe_blocks,
            ROUND(100.0 * SUM(CASE WHEN categorization = 'safe' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0), 2) as percent_safe
        FROM attribute_data
        WHERE categorization IS NOT NULL
        GROUP BY state
        ORDER BY state
    """
    cols, rows, _ = execute_sql(sql)
    return [dict(zip(cols, r)) for r in rows]

@app.post("/query")
async def query_endpoint(request: Request):
    data = await request.json()
    question = data.get("question", "")
    language = data.get("language", "en")
    print("[DEBUG] Received question:", question, "Language:", language)
    if not question:
        print("[ERROR] No question provided.")
        return JSONResponse({"error": "No question provided."}, status_code=400)

    #Modular translation service
    ts = TranslationService(provider="google")  # or "aws" or "indictrans2"
    if language != "en":
        question_en = ts.translate(question, source_lang=language, target_lang="en")
    else:
        question_en = question  
    

    try:
        sql = get_sql_from_gemini(question_en)
        print("[DEBUG] Generated SQL:", sql)
    except Exception as e:
        print("[ERROR] Gemini SQL generation failed:", e)
        return JSONResponse({"error": f"Gemini SQL generation failed: {e}"}, status_code=500)
    try:
        cols, rows, duration = execute_sql(sql)
        print(f"[DEBUG] SQL executed. Columns: {cols}, Rows: {len(rows)}, Duration: {duration:.3f}s")
        table = [dict(zip(cols, r)) for r in rows]
    except Exception as e:
        print("[ERROR] SQL execution failed:", e)
        return JSONResponse({"error": f"SQL execution failed: {e}", "sql": sql}, status_code=500)
    try:
        # Convert Decimal/NaN/Datetime to JSON-safe types
        import datetime
        import math
        from decimal import Decimal

        def convert_for_json(obj):
            if isinstance(obj, dict):
                return {k: convert_for_json(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_for_json(i) for i in obj]
            elif isinstance(obj, Decimal):
                try:
                    f = float(obj)
                except Exception:
                    return None
                if math.isnan(f) or math.isinf(f):
                    return None
                return f
            elif isinstance(obj, str) and obj.strip().lower() in {"nan", "+inf", "-inf", "inf", "infinity"}:
                return None
            elif isinstance(obj, (datetime.datetime, datetime.date)):
                return obj.isoformat()
            else:
                return obj

        table_for_llm = convert_for_json(table[:10])
        safe_table = convert_for_json(table)
        summary_prompt = f"""
You are a helpful assistant. Given the following SQL query and its results, summarize the answer in natural language for the user.

SQL Query:
{sql}

Results:
{json.dumps(table_for_llm, indent=2)}

Provide a concise, clear answer for the user.
"""
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        summary_response = model.generate_content(summary_prompt)
        answer_en = summary_response.text.strip()
        print("[DEBUG] LLM summary generated.")
        # Translate answer back to user language if needed
        if language != "en":
            answer = ts.translate(answer_en, source_lang="en", target_lang=language)
        else:
            answer = answer_en
        return {"answer": answer, "table": safe_table, "sql": sql, "duration": duration}
    except Exception as e:
        print("[ERROR] LLM summarization failed:", e)
        return JSONResponse({"error": f"LLM summarization failed: {e}", "sql": sql}, status_code=500)

if __name__ == "__main__":
    main()
