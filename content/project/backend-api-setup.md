---
date: '2026-03-07T22:38:53+01:00'
lastmod: '2026-03-25T00:00:00+01:00'
title: 'Backend API Setup'
description: 'Best practices and example implementations for building a backend API for your Hugo frontend using Python FastAPI or Go.'
draft: false
slug: 'backend-api-setup'
tags:
  - 'backend'
  - 'api'
  - 'fastapi'
  - 'go'
  - 'hugo'
  - 'typescript'
categories:
  - 'Guidelines'
  - 'Backend'
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
---

## Overview

This guide outlines practical backend patterns for a Hugo frontend that uses TypeScript for interactivity, HTMX for partial updates, or both. The focus is on stable HTTP APIs, predictable caching, and simple deployment.

Instead of Node-specific examples, this document uses:

- **Python + FastAPI** for rapid API development
- **Go** for a small, fast, self-contained backend service

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Go Documentation](https://go.dev/doc/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Caching Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Recommended Architecture

```text
┌─────────────────────────────────┐
│ Hugo Frontend                   │
│ - TypeScript features           │
│ - HTMX partial requests         │
│ - Search and interactive UI     │
└─────────────────┬───────────────┘
                  │ HTTP / JSON
                  ↓
┌─────────────────────────────────┐
│ Backend API                     │
│ - Python FastAPI or Go          │
│ - Authentication                │
│ - Rate limiting                 │
│ - Cache-control headers         │
│ - Database / external services  │
└─────────────────────────────────┘
```

The frontend should treat the backend as a clean contract layer:

- `GET` routes for cached, repeatable reads
- `POST`, `PATCH`, and `DELETE` routes for writes
- predictable JSON response shapes
- auth handled through bearer tokens or secure session cookies

## Key Principles

### 1. Stateless API Design

- Each request should be independent
- Avoid server-side session coupling unless you intentionally use session cookies
- Make horizontal scaling easy from the start

### 2. Proper Cache Headers

Help the frontend cache effectively:

```http
Cache-Control: public, max-age=300
ETag: "33a64df..."
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
```

Use shorter or `no-store` style policies for user-specific or sensitive data.

### 3. Request Deduplication Support

For write endpoints, support idempotency where it matters:

```http
POST /api/users HTTP/1.1
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json
```

This is especially useful for forms that users may submit twice.

### 4. Consistent Response Format

Success response:

```json
{
  "data": { "id": "1", "name": "John", "email": "john@example.com" },
  "status": 200,
  "timestamp": "2026-03-25T10:30:00Z"
}
```

Error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  },
  "status": 400,
  "timestamp": "2026-03-25T10:30:00Z"
}
```

## Environment Configuration

```bash
# .env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/hugo_db
FRONTEND_URL=http://localhost:1313
JWT_SECRET=replace-this-in-production
LOG_LEVEL=info
```

Keep secrets out of Git and provide production overrides via your deployment platform.

## Python FastAPI Example

### Basic Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv pyjwt
```

### Server Implementation

```python
# app/main.py
import os
import time
from typing import Optional

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

load_dotenv()

app = FastAPI(title="Hugo Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:1313")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users = [
    {"id": "1", "name": "John", "email": "john@example.com"},
    {"id": "2", "name": "Jane", "email": "jane@example.com"},
]
idempotency_cache: dict[str, dict] = {}


class CreateUserPayload(BaseModel):
    name: str
    email: EmailStr


def api_response(data, status: int = 200):
    return {
        "data": data,
        "status": status,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def require_auth(authorization: Optional[str] = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1]
    try:
        return jwt.decode(token, os.getenv("JWT_SECRET", "change-me"), algorithms=["HS256"])
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc


@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}


@app.get("/api/users")
def list_users(response: Response):
    response.headers["Cache-Control"] = "public, max-age=300"
    return api_response(users)


@app.post("/api/users", status_code=201)
def create_user(
    payload: CreateUserPayload,
    response: Response,
    idempotency_key: Optional[str] = Header(default=None, alias="Idempotency-Key"),
    _: dict = Depends(require_auth),
):
    if idempotency_key and idempotency_key in idempotency_cache:
        response.status_code = 200
        return api_response(idempotency_cache[idempotency_key], 200)

    new_user = {
        "id": str(len(users) + 1),
        "name": payload.name,
        "email": payload.email,
    }
    users.append(new_user)

    if idempotency_key:
        idempotency_cache[idempotency_key] = new_user

    return api_response(new_user, 201)
```

Run locally:

```bash
uvicorn app.main:app --reload --port 3000
```

## Go Backend Example

### Basic Setup

```bash
mkdir go-backend
cd go-backend
go mod init example.com/hugo-backend
go get github.com/golang-jwt/jwt/v5
```

### Server Implementation

```go
// main.go
package main

import (
  "encoding/json"
  "fmt"
  "log"
  "net/http"
  "os"
  "strings"
  "time"

  "github.com/golang-jwt/jwt/v5"
)

type User struct {
  ID    string `json:"id"`
  Name  string `json:"name"`
  Email string `json:"email"`
}

type APIResponse struct {
  Data      any    `json:"data,omitempty"`
  Status    int    `json:"status"`
  Timestamp string `json:"timestamp"`
  Error     any    `json:"error,omitempty"`
}

var users = []User{
  {ID: "1", Name: "John", Email: "john@example.com"},
  {ID: "2", Name: "Jane", Email: "jane@example.com"},
}

func writeJSON(w http.ResponseWriter, status int, data any, errBody any) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(status)
  _ = json.NewEncoder(w).Encode(APIResponse{
    Data:      data,
    Status:    status,
    Timestamp: time.Now().UTC().Format(time.RFC3339),
    Error:     errBody,
  })
}

func withCORS(next http.Handler) http.Handler {
  frontend := os.Getenv("FRONTEND_URL")
  if frontend == "" {
    frontend = "http://localhost:1313"
  }

  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", frontend)
    w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Idempotency-Key")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    if r.Method == http.MethodOptions {
      w.WriteHeader(http.StatusNoContent)
      return
    }
    next.ServeHTTP(w, r)
  })
}

func requireAuth(next http.HandlerFunc) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    auth := r.Header.Get("Authorization")
    if !strings.HasPrefix(auth, "Bearer ") {
      writeJSON(w, http.StatusUnauthorized, nil, map[string]string{"code": "UNAUTHORIZED", "message": "Missing bearer token"})
      return
    }

    tokenString := strings.TrimPrefix(auth, "Bearer ")
    _, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
      return []byte(os.Getenv("JWT_SECRET")), nil
    })
    if err != nil {
      writeJSON(w, http.StatusUnauthorized, nil, map[string]string{"code": "UNAUTHORIZED", "message": "Invalid token"})
      return
    }

    next(w, r)
  }
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
  writeJSON(w, http.StatusOK, map[string]string{"status": "ok"}, nil)
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Cache-Control", "public, max-age=300")
  writeJSON(w, http.StatusOK, users, nil)
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {
  var payload User
  if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
    writeJSON(w, http.StatusBadRequest, nil, map[string]string{"code": "BAD_REQUEST", "message": "Invalid JSON payload"})
    return
  }

  payload.ID = fmt.Sprintf("%d", len(users)+1)
  users = append(users, payload)
  writeJSON(w, http.StatusCreated, payload, nil)
}

func main() {
  mux := http.NewServeMux()
  mux.HandleFunc("/api/health", healthHandler)
  mux.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
      usersHandler(w, r)
    case http.MethodPost:
      requireAuth(createUserHandler)(w, r)
    default:
      w.WriteHeader(http.StatusMethodNotAllowed)
    }
  })

  addr := ":3000"
  log.Printf("listening on %s", addr)
  log.Fatal(http.ListenAndServe(addr, withCORS(mux)))
}
```

Run locally:

```bash
go run .
```

## Database Integration Example (PostgreSQL)

### Python with SQLAlchemy

```python
from sqlalchemy import create_engine, text

engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True)

with engine.connect() as conn:
    result = conn.execute(text("SELECT id, name, email FROM users ORDER BY created_at DESC LIMIT 20"))
    rows = [dict(row._mapping) for row in result]
```

### Go with `database/sql`

```go
import (
  "context"
  "database/sql"

  _ "github.com/lib/pq"
)

db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
if err != nil {
  log.Fatal(err)
}

rows, err := db.QueryContext(context.Background(), `
  SELECT id, name, email
  FROM users
  ORDER BY created_at DESC
  LIMIT 20
`)
```

## Authentication

For APIs used by a Hugo frontend, common options are:

- bearer JWT tokens for SPA-like interactions
- secure, HTTP-only cookies for session-based auth
- signed API keys for internal service calls

FastAPI example dependency:

```python
from fastapi import Header, HTTPException

def require_api_key(x_api_key: str | None = Header(default=None)):
    if x_api_key != os.getenv("INTERNAL_API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
```

Go example middleware:

```go
func requireAPIKey(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Header.Get("X-API-Key") != os.Getenv("INTERNAL_API_KEY") {
      writeJSON(w, http.StatusUnauthorized, nil, map[string]string{"code": "UNAUTHORIZED", "message": "Invalid API key"})
      return
    }
    next.ServeHTTP(w, r)
  })
}
```

## Rate Limiting

Rate limiting can live:

- in the app
- at the reverse proxy layer
- at the CDN or API gateway layer

FastAPI option:

```bash
pip install slowapi
```

Go option:

```bash
go get golang.org/x/time/rate
```

If you already terminate traffic through Nginx, Caddy, Traefik, or Cloudflare, placing rate limiting there is often simpler.

## Testing the Backend

### FastAPI tests

```python
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_users_returns_cache_header():
    response = client.get("/api/users")
    assert response.status_code == 200
    assert "public" in response.headers["cache-control"]
    assert isinstance(response.json()["data"], list)
```

### Go tests

```go
func TestHealthHandler(t *testing.T) {
  req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
  w := httptest.NewRecorder()

  healthHandler(w, req)

  if w.Code != http.StatusOK {
    t.Fatalf("expected 200, got %d", w.Code)
  }
}
```

## Security Headers

Recommended headers for most APIs:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'
```

Add them in middleware close to the edge of your application stack.

## Monitoring & Logging

- log request method, path, status, and duration
- attach request IDs for correlation
- track error rates and latency percentiles
- monitor database pool saturation and slow queries

Good defaults:

- **FastAPI**: standard logging + OpenTelemetry / Prometheus client
- **Go**: `log/slog`, Prometheus metrics, and structured JSON logs

## Performance Optimization

1. Add database indexes for frequently queried columns
2. Use pagination for list endpoints
3. Compress responses where appropriate
4. Set accurate cache headers
5. Reuse database connections through pooling
6. Profile slow queries before optimizing application code

## Deployment

Good deployment targets for these stacks include:

- **Docker** for portable local and production builds
- **Railway** or **Render** for quick managed deployment
- **Fly.io** for lightweight global app hosting
- **A VPS** with systemd, Caddy, or Nginx for full control
- **Kubernetes** if you already operate container infrastructure

For small projects, a simple Docker image plus managed Postgres is usually enough.
