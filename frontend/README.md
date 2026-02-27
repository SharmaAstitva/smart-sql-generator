# Smart SQL Generator — Frontend v2

Production-ready React SaaS frontend for the Smart SQL Query Generator.

## Quick Start

```bash
npm install
npm start        # dev server → http://localhost:3000
npm run build    # production build
```

## Environment

Create `.env` in project root (already included):

```
REACT_APP_API_URL=http://localhost:8001
```

Change `8001` to wherever your FastAPI backend runs.

## Routes

| Path       | Page          | Description                    |
|------------|---------------|--------------------------------|
| `/`        | Landing       | Hero page with feature cards   |
| `/connect` | Connect       | MySQL credentials form         |
| `/ask`     | Ask           | Natural language question input|
| `/results` | Results       | SQL output + explanation       |

## Folder Structure

```
src/
 ├── pages/
 │    ├── Landing.jsx     Hero landing page
 │    ├── Connect.jsx     DB connection form
 │    ├── Ask.jsx         Question input + schema preview
 │    └── Results.jsx     SQL output, explanation, copy/download
 ├── components/
 │    ├── Navbar.jsx      Sticky top nav with DB status
 │    ├── Card.jsx        Reusable hoverable card
 │    ├── Button.jsx      All button variants
 │    ├── Loader.jsx      Spinning loader
 │    └── Toast.jsx       Toast notification system
 ├── services/
 │    └── api.js          Axios instance + all API calls
 ├── context/
 │    └── AppContext.jsx  Global state (DB info, query result)
 ├── styles/
 │    └── globals.css     CSS variables + resets
 ├── App.jsx              Router + providers
 └── index.js             React entry point
```

## Dependencies

```
react-router-dom   Routing
axios              HTTP client
```

No other runtime dependencies — Toast and syntax highlighting are built-in.
