# SportSync

SportSync is a lightweight Node.js backend for managing sports matches and match commentary with real-time updates via WebSockets.

## Features

- REST API for creating and listing matches
- REST API for adding and fetching match commentary
- PostgreSQL persistence using Drizzle ORM
- WebSocket server for broadcasting newly created matches and live commentary
- Input validation with Zod
- Basic security protection middleware via Arcjet

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Drizzle ORM
- WebSockets (`ws`)
- Zod
- dotenv

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with at least:

```env
DATABASE_URL=postgres://user:password@host:port/database
PORT=8000
HOST=0.0.0.0
```

3. Run the server in development mode:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

## API Endpoints

### Matches

- `GET /matches`
  - List matches
  - Query params: `limit` (optional)

- `POST /matches`
  - Create a new match
  - Body example:

```json
{
  "homeTeam": "Team A",
  "awayTeam": "Team B",
  "startTime": "2026-06-03T18:00:00.000Z",
  "endTime": "2026-06-03T20:00:00.000Z",
  "homeScore": 0,
  "awayScore": 0
}
```

### Commentary

- `GET /matches/:id/commentary`
  - List commentary entries for a match
  - Query params: `limit` (optional)

- `POST /matches/:id/commentary`
  - Add commentary to a match
  - Body example:

```json
{
  "author": "Commentator",
  "message": "Great goal!",
  "minutes": 34
}
```

## WebSocket Usage

The WebSocket server runs on `/ws`.

### Connect

Use a WebSocket client to connect to:

```
ws://localhost:8000/ws
```

### Subscribe to commentary for a match

Send:

```json
{
  "type": "subscribe",
  "matchId": 1
}
```

### Unsubscribe

Send:

```json
{
  "type": "unsubscribe",
  "matchId": 1
}
```

### Events

- `match_created` — broadcast when a new match is created
- `commentary` — broadcast to subscribers when new commentary is added for a match

## Database

The project uses PostgreSQL with Drizzle ORM. SQL migration or schema snapshots are stored in the `drizzle/` folder.

## Project Structure

- `src/index.js` — application entry point
- `src/routes/matches.js` — match REST routes
- `src/routes/commentary.js` — commentary REST routes
- `src/ws/server.js` — WebSocket server and subscriptions
- `src/db/db.js` — database connection
- `src/db/schema.js` — database schema definitions
- `src/validation/` — request validation schemas
- `src/utils/matchStatus.js` — match status helpers
- `drizzle/` — schema/migration files

## Notes

- Ensure `DATABASE_URL` is set before starting the app.
- `HOST` defaults to `0.0.0.0` and `PORT` defaults to `8000`.

## License

This project is licensed under the ISC License.
