# Time Tracker App: Full Stack Monorepo

## 🔧 Stack Requirements
- Node.js (v20+) with **npm** as the package manager (NO Yarn, pnpm, or Corepack)
- Express for server API
- MongoDB Atlas for the database
- Electron for desktop
- Chrome browser extension
- React (or basic JS/HTML) for dashboard
- Mongoose for MongoDB interaction
- dotenv for config/environment variables

## 📁 Directory Structure
Time_Tracker/
├── package.json                (root npm config for workspaces)
├── .gitignore                  (standard Node/gitignore)
├── .env.example                (sample vars, no secrets)
├── README.md                   (overview + run instructions)
├── server/                     (Express + MongoDB backend)
│   ├── package.json
│   ├── index.js
│   ├── .env
│   ├── models/
│   ├── routes/
│   └── controllers/
├── desktop/                    (Electron app)
│   ├── package.json
│   ├── main.js
│   └── renderer/
├── extension/                  (Chrome extension)
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   └── popup.js
├── dashboard/                  (React or basic web UI)
│   ├── package.json
│   └── src/
└── shared/                     (optional utility functions)
    └── utils.js

## 🧠 Features
- Track time per app/window, apply rules (e.g., "if window contains X, assign to Project Y")
- Basic AI-like suggestions based on usage patterns
- Cross-platform sync between desktop, extension, and dashboard
- MongoDB Atlas for persistent data
- Productivity insights dashboard

## ✅ Constraints
- Do NOT use Yarn, Corepack, or pnpm
- Do NOT hardcode secrets or DB strings
- Use `dotenv` and `.env.example`
- Make each module independently runnable
- Use `npm install` + `npm start` for setup

