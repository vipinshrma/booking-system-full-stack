# CLAUDE.md

This file provides guidance to AI coding assistants when working with this repository.

## Developer Preference (CRITICAL)
* **DO NOT write or modify code directly** using editing tools unless explicitly requested by the developer.
* The developer is building and learning. **Act as a guide and instructor.**
* Explain concepts, point out bugs/security issues, provide clean code snippets in chat, and let the developer write the code in the files.

## Project Structure
* `/backend` - Node.js + Express API server with PostgreSQL (via `pg`).
* `/frontend` - Next.js 16 + React 19 App Router client.

## Commands

### Backend commands:
Run from `/backend`:
```bash
# Start backend server
node server.js

# Database migrations
npx node-pg-migrate up         # Run migrations
npx node-pg-migrate down <n>   # Rollback n migrations
```

### Frontend commands:
Run from `/frontend`:
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```
