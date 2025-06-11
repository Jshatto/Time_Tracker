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
The API listens on **port 5000** by default. Set the `PORT` variable in `.env` if you need a different value.

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
- - `POST /api/timer/stop` – stop the active timer for a user and return the log with duration.

### Keep Alive Ping
Run `keepAlive.js` to prevent the Render backend from sleeping:
```bash
node keepAlive.js &
```
This pings `https://your-service-name.onrender.com` every 14 minutes. You can keep this running in the background or launch it from your desktop app or extension startup script.