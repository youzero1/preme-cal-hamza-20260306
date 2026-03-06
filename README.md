# Preme Cal

A productivity-focused calculator web app built with Next.js, TypeScript, Tailwind CSS, and SQLite.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Advanced operations: percentage, sign toggle (+/-), backspace
- Decimal support
- Calculation history stored in SQLite
- Keyboard support
- Responsive mobile-first design
- Dark theme with smooth button animations

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite via TypeORM + better-sqlite3

## Getting Started

### Local Development

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker Deployment

```bash
docker-compose up -d
```

App will be available at [http://localhost:3000](http://localhost:3000).

Database is persisted in a Docker volume `preme-cal-data`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `./data/preme-cal.db` | Path to SQLite database |
| `NEXT_PUBLIC_APP_NAME` | `Preme Cal` | App display name |

## API Routes

- `GET /api/history` — Fetch recent calculations (last 50)
- `POST /api/history` — Save a new calculation

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Number input |
| `+`, `-`, `*`, `/` | Operators |
| `.` | Decimal point |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete last character |
| `Escape` | Clear all |
| `%` | Percentage |
