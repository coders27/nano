# Mobile App Setup Guide

## Prerequisites

1. **Node.js 18+** installed
2. **Expo Go app** on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Quick Setup

### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

If you encounter errors, try:
```bash
npm install --legacy-peer-deps
```

### Step 2: Start Development Server

```bash
npm start
```

Or with cache clear:
```bash
npm run clear
```

### Step 3: Connect Your Phone

1. **Make sure your phone and computer are on the same WiFi network**

2. **Scan QR Code**:
   - iOS: Open Camera app, scan QR code
   - Android: Open Expo Go app, tap "Scan QR code"

3. **Or enter URL manually** in Expo Go:
   - Look for the URL in terminal (e.g., `exp://192.168.1.100:8081`)
   - Enter it in Expo Go app

## Troubleshooting

### Issue: "Cannot connect to Metro"

**Solution**:
```bash
# Clear cache and restart
npm run clear
```

### Issue: "Module not found"

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: "Expo Go app shows error"

**Solution**:
1. Make sure you're on the same WiFi
2. Check firewall settings
3. Try using tunnel mode:
   ```bash
   npm start -- --tunnel
   ```

### Issue: "Dependencies version mismatch"

**Solution**:
```bash
# Use legacy peer deps
npm install --legacy-peer-deps
```

### Issue: "Camera permission error"

**Solution**:
1. Go to phone Settings
2. Find Expo Go app
3. Enable Camera permission

## Development Tips

### Hot Reload
- Shake your phone to open developer menu
- Enable "Fast Refresh" for instant updates

### Debug Mode
- Shake phone → "Debug Remote JS"
- Opens Chrome DevTools for debugging

### Clear Cache
```bash
npm run clear
```

### Platform-Specific Launch
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Features to Test

1. **Connect to Server**
   - Scan QR code from backend
   - Or enter server URL manually

2. **Voice Input**
   - Tap microphone icon
   - Speak in your language
   - See transcription

3. **Chat Interface**
   - Send messages
   - View AI responses
   - Real-time updates

4. **Settings**
   - Change mode (Fast/Planning)
   - Change model
   - View workspace

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Start with cache clear
npm run clear

# Start for Android
npm run android

# Start for iOS
npm run ios

# Start for web
npm run web
```

## File Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── index.js           # Main screen
│   └── _layout.js         # Root layout
├── components/            # React components
├── hooks/                 # Custom hooks
├── services/              # API services
├── constants/             # Theme, config
├── utils/                 # Utilities
├── assets/                # Images, icons
├── app.json              # Expo config
├── package.json          # Dependencies
└── babel.config.js       # Babel config
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start server**: `npm start`
3. **Scan QR code** with Expo Go
4. **Connect to backend** server
5. **Start coding!**

## Support

If you encounter issues:
1. Check this guide
2. Clear cache: `npm run clear`
3. Reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`
4. Check Expo documentation: https://docs.expo.dev

---

**Happy Coding!** 🚀
