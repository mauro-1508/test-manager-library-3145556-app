# Manager Library - App

React 18 + Vite frontend for the Manager Library system (login, catalogue, members, loans, returns, overdue books and the most-borrowed report). It consumes the HTTP API described in the specification.

## Requirements

- Node.js 20+
- A running Manager Library API

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server listens on http://localhost:5173.

## Environment

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Base URL of the API |

## Build

```bash
npm run build
```

## Docker

```bash
docker build -t manager-library-app .
docker run --rm -p 5173:5173 manager-library-app
```

## Specification

https://github.com/mauro-1508/test-manager-library-3145556-docs/tree/develop/spec-laravel
