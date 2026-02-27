# 🧠 Smart SQL Query Generator

> Upload a database → Ask in plain English → Get perfect SQL with step-by-step explanations.

---

##  Project Structure

```
smart-sql-generator/
│
├── backend/                        # Python FastAPI server
│   ├── main.py                     # App entry point & CORS setup
│   ├── config.py                   # Environment variable loader
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Copy to .env and fill in values
│   │
│   ├── routers/                    # API route handlers
│   │   ├── upload.py               # POST /api/upload/connect & /sql-file
│   │   ├── schema.py               # GET  /api/schema/
│   │   └── query.py                # POST /api/query/
│   │
│   ├── services/                   # Business logic
│   │   ├── db_service.py           # MySQL connection & .sql import
│   │   ├── schema_service.py       # SHOW TABLES + DESCRIBE extraction
│   │   └── ai_service.py           # OpenAI GPT-4 integration
│   │
│   └── utils/
│       └── formatter.py            # ASCII table + SQL extractor
│
├── frontend/                       # React app
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│    ├── pages/
│    │    ├── Landing.jsx     Hero landing page
│    │    ├── Connect.jsx     DB connection form
│    │    ├── Ask.jsx         Question input + schema preview
│    │    └── Results.jsx     SQL output, explanation, copy/download
│    ├── components/
│    │    ├── Navbar.jsx      Sticky top nav with DB status
│    │    ├── Card.jsx        Reusable hoverable card
│    │    ├── Button.jsx      All button variants
│    │    ├── Loader.jsx      Spinning loader
│    │    └── Toast.jsx       Toast notification system
│    ├── services/
│    │      └── api.js          Axios instance + all API calls
│    ├── context/
│    │    └── AppContext.jsx  Global state (DB info, query result)
│    ├── styles/
│    │    └── globals.css     CSS variables + resets
│    ├── App.jsx              Router + providers
|    └── index.js             React entry point
│
└── sample_ecommerce.sql            # Test database (4 tables, sample data)
```

---

##  Prerequisites

| Tool    | Version  | Install |
|---------|----------|---------|
| Python  | 3.10+    | python.org |
| Node.js | 18+      | nodejs.org |
| MySQL   | 8.0+     | mysql.com |
| mysql CLI | any   | Included with MySQL |

You also need a **Groq API key** (free) → https://console.groq.com

---

## Setup Instructions

### 1. Clone / Download

```bash
cd smart-sql-generator
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=gsk_your-actual-key-here
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
REACT_APP_API_URL=http://localhost:8001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Running Locally

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8001
```
→ API available at http://localhost:8001
→ Auto-docs at http://localhost:8001/docs

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
→ App available at http://localhost:3000

---

##  Example Test Run

### Using the Sample Database

1. Open http://localhost:3000
2. Click **"Upload .sql File"** tab
3. Enter database name: `ecommerce_test`
4. Upload `sample_ecommerce.sql`
5. Click **"Import & Connect"**
6. You'll be redirected to the Query page

### Example Questions to Try

| Question | Tests |
|----------|-------|
| "Find all customers who placed more than 2 orders" | GROUP BY + HAVING |
| "List customers who never placed an order" | LEFT JOIN + NULL check |
| "Get top 3 products by total revenue" | JOIN + GROUP BY + ORDER BY + LIMIT |
| "Find the most expensive product in each category" | Subquery / GROUP BY |
| "Show total orders per customer with their city" | Multi-table JOIN |

### Example Output for "Customers who never placed an order"

```
## Schema

Table: customers
+-------------+--------------+
| Column Name | Type         |
+-------------+--------------+
| id          | int          |
| name        | varchar(100) |
| email       | varchar(200) |
+-------------+--------------+
Primary Key: id — unique identifier for each customer

## Problem Statement
Find all customers who have not placed any orders in the system.

## SQL Solution
SELECT c.id, c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

## Explanation
- **SELECT**: Returns customer id, name, and email
- **FROM / JOIN**: Uses a LEFT JOIN so all customers appear even with no matching orders
- **WHERE o.id IS NULL**: After the LEFT JOIN, customers with no orders have NULL in the orders columns
- **NULL behavior**: This is the key — LEFT JOIN produces NULLs for non-matching rows
```
---
## Interview Mode Flow
1. Select difficulty 
2. Generate Questions
3. Get AI Solutions
4. View Explanations
5. Track Streak Progress
```
---
## Tech Stack

Frontend:
React
Axios
Framer Motion
React Router

Backend:
FastAPI
MySQL Connector
Groq API
Uvicorn

Database:
MySQL
---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload/connect | Connect via MySQL credentials |
| POST | /api/upload/sql-file | Upload and import .sql file |
| GET | /api/schema/ | Get schema as JSON |
| GET | /api/schema/ascii | Get schema as ASCII table |
| POST | /api/schema/refresh | Re-extract schema from DB |
| POST | /api/query/ | Generate SQL from natural language |

Full interactive docs: http://localhost:8000/docs

---

## Future Improvements

- **Query history** — save past questions and answers per session
- **Schema visualization** — interactive ERD diagram of the database
- **Query execution** — actually run the generated SQL and show results
- **Multi-database support** — PostgreSQL, SQLite, MSSQL
- **Auth system** — user accounts with saved databases
- **Export** — download results as PDF or markdown
- **Streaming** — stream AI response token by token for faster UX
- **Few-shot examples** — attach sample rows to improve AI accuracy
- **Feedback loop** — thumbs up/down to improve query quality over time

---

##  Troubleshooting

**MySQL connection refused:**
- Make sure MySQL is running: `sudo service mysql start`
- Check credentials in `.env`

**GROQ API error:**
- Verify `GROQ_API_KEY` is set correctly
- Ensure you have API credits at platform.openai.com

**`mysql` command not found (for .sql import):**
- Install MySQL client tools
- macOS: `brew install mysql-client`
- Ubuntu: `sudo apt install mysql-client`

**CORS errors:**
- Backend must be running on port 8000
- Frontend must be on port 3000
