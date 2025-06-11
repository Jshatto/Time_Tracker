# Time Tracker Chrome Extension 🎨

A beautiful Chrome extension with glassmorphism design for tracking time with your Time Tracker application.

## ✨ Features

- **Beautiful glassmorphism UI** with gradient backgrounds and glass effects
- **Real-time timer display** in the extension popup
- **Smart API connection** - automatically finds your running server
- **Badge notifications** - shows timer status in the browser toolbar
- **Quick dashboard access** - one-click access to full web application
- **Error handling** - graceful fallbacks when server is offline
- **Responsive design** - optimized for the extension popup format

## 🚀 Installation

### For Development:

1. **Build the extension:**
   ```bash
   cd extension
   npm install
   npm run build
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Test the extension:**
   - Make sure your Time Tracker server is running
   - Click the extension icon in the toolbar
   - The popup should connect and show timer status

### For Production:

1. **Package for Chrome Web Store:**
   ```bash
   zip -r time-tracker-extension.zip extension/ -x "*/node_modules/*" "*/tests/*" "*/.git/*"
   ```

2. **Upload to Chrome Web Store** (requires developer account)

## 🔧 Configuration

The extension automatically connects to these API endpoints in order:

1. `https://time-tracker-nust.onrender.com` (Production)
2. `http://localhost:5000` (Development)
3. `http://localhost:3000` (Alternative dev port)

## 🎨 Design Features

- **Glassmorphism effects** with backdrop blur and transparency
- **Gradient backgrounds** matching your main application
- **Smooth animations** and hover effects
- **Status badges** with color-coded states:
  - 🟢 Green: Timer running
  - ⚫ Gray: Timer stopped
  - 🔴 Red: Connection error
- **Real-time updates** every 5 seconds
- **Beautiful typography** using Inter font

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Test coverage includes:
- Background script functionality
- Popup UI interactions
- API connection handling
- Error states and recovery
- Chrome API integrations

## 📱 Usage

1. **Click the extension icon** to open the popup
2. **Start/Stop timer** with the toggle button
3. **View elapsed time** in real-time
4. **Open dashboard** for full functionality
5. **Check status** via the badge icon

## 🔒 Permissions

The extension requires these permissions:

- `tabs` - To open dashboard in new tab
- `activeTab` - To get current tab info
- `storage` - To save timer state locally
- `scripting` - For future content script features
- Host permissions for API servers

## 🐛 Troubleshooting

**Extension shows "Connection Error":**
- Make sure your Time Tracker server is running
- Check if you can access the dashboard in a regular browser tab
- Verify the API endpoints in the popup.js file

**Timer not updating:**
- The extension updates every 5 seconds
- Try closing and reopening the popup
- Check the browser console for error messages

**Popup not loading:**
- Reload the extension in `chrome://extensions/`
- Check that all files are present in the extension directory
- Verify the manifest.json is valid

## 🔄 Updates

The extension automatically checks timer status periodically and updates:
- **Badge text** (ON/OFF/!)
- **Badge color** (green/gray/red)  
- **Popup content** when opened
- **Local storage** for offline state

## 🎯 Future Enhancements

- [ ] Keyboard shortcuts for start/stop
- [ ] Context menu integration
- [ ] Desktop notifications
- [ ] Time tracking analytics
- [ ] Project selection from extension
- [ ] Pomodoro timer integration

---

Built with ❤️ and glassmorphism design principles