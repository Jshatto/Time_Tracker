# Time Tracker Monorepo

This project tracks time across desktop, web, and browser environments with central sync and productivity analytics.

## 📦 Project Structure
See `prompt.md` for full breakdown.

## 🚀 Run Instructions

### Root (install all workspaces)
Running `npm install` from the repository root uses npm workspaces to install
dependencies for the `server`, `desktop`, `extension`, and `dashboard` packages.
```bash
npm install
```

### Server
```bash
cd server
npm start
```

### Desktop
```bash
cd desktop
npm start
```

### Extension
Load `/extension` as an unpacked Chrome extension.

### Dashboard
```bash
cd dashboard
npm start
```

## 🛠 Environment
Create `.env` files for each service using `.env.example` as a guide.

## API Endpoints
The server exposes timer routes:

- `POST /api/timer/start` – begin tracking for a user. Body should include `userId`.
- `POST /api/timer/stop` – stop the active timer for a user and return the log with duration.