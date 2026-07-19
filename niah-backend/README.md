# Niah Foundation — Go Backend

Volunteer registration API. Structurally decoupled from the Vite+React frontend — runs as an independent process, communicates over HTTP/JSON.

---

## Project structure

```
niah-backend/
├── cmd/
│   └── server/
│       └── main.go          ← entry point: wires config → db → router → server
├── config/
│   └── config.go            ← env-based config with defaults
├── internal/
│   ├── db/
│   │   └── db.go            ← SQLite connection + schema migration
│   ├── handlers/
│   │   ├── health.go        ← GET  /api/health
│   │   └── volunteer.go     ← POST /api/register
│   └── middleware/
│       ├── cors.go          ← CORS headers + preflight handling
│       └── logger.go        ← request/response logging
├── .env.example
├── .gitignore
└── go.mod
```

### Dependency flow

```
main.go
  ├── config.Load()                 reads env vars
  ├── db.Open(cfg.DBPath)           opens SQLite, runs migration
  ├── chi.NewRouter()               sets up routes
  │     ├── middleware.Logger
  │     ├── middleware.CORS(origin)
  │     ├── GET  /api/health   → handlers.HealthCheck
  │     └── POST /api/register → handlers.RegisterVolunteer(db)
  └── http.Server{}                 graceful shutdown on SIGINT/SIGTERM
```

---

## Terminal setup

### 1. Initialise module and install dependencies

```bash
# From the niah-backend/ directory:

go mod init github.com/niah-foundation/backend

go get github.com/go-chi/chi/v5@latest
go get modernc.org/sqlite@latest

go mod tidy
```

### 2. Run in development

```bash
go run ./cmd/server
```

Server starts on `http://localhost:8080`. The SQLite database file `niah.db` is created automatically on first run.

### 3. Build a production binary

```bash
go build -o niah-backend ./cmd/server
./niah-backend
```

### 4. Override config via environment variables

```bash
PORT=9000 DB_PATH=/data/niah.db ALLOWED_ORIGIN=https://niahfoundation.org ./niah-backend
```

---

## API reference

### `GET /api/health`

Liveness check. Returns `200 OK` immediately.

```json
{ "status": "ok", "time": "2025-01-15T10:30:00Z" }
```

---

### `POST /api/register`

Registers a new volunteer. Called by the React `Volunteer.jsx` page.

**Request headers**
```
Content-Type: application/json
```

**Request body**
```json
{
  "name":    "Amaka Obi",
  "email":   "amaka@example.com",
  "phone":   "+234 801 234 5678",
  "role":    "Clinical Volunteer",
  "message": "I am a licensed psychologist available on weekends."
}
```

| Field     | Required | Notes                                |
|-----------|----------|--------------------------------------|
| `name`    | yes      | min 2 chars                          |
| `email`   | yes      | must be valid format; unique per row |
| `phone`   | yes      | min 7 chars                          |
| `role`    | no       | free text                            |
| `message` | no       | free text                            |

**Success — `201 Created`**
```json
{ "id": 1, "message": "Registration successful — we'll be in touch shortly." }
```

**Validation error — `422 Unprocessable Entity`**
```json
{ "error": "email address is invalid" }
```

**Duplicate email — `409 Conflict`**
```json
{ "error": "this email is already registered" }
```

**Bad JSON — `400 Bad Request`**
```json
{ "error": "invalid JSON body" }
```

---

## Connecting from React

In `Volunteer.jsx`, replace the local `setSubmitted(true)` with a real fetch:

```js
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const res = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setSubmitted(true)
  } catch (err) {
    setError(err.message)
  }
}
```

---

## SQLite schema

```sql
CREATE TABLE volunteers (
  id         INTEGER  PRIMARY KEY AUTOINCREMENT,
  name       TEXT     NOT NULL,
  email      TEXT     NOT NULL UNIQUE,
  phone      TEXT     NOT NULL,
  role       TEXT     NOT NULL DEFAULT '',
  message    TEXT     NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
```
