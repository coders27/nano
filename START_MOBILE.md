# 📱 Start Mobile App - Quick Guide

## ✅ Prerequisites Installed

Dependencies are already installed! Now let's start the app.

## 🚀 Start the App

### Option 1: Using npm (Recommended)

```bash
cd mobile
npm start
```

### Option 2: Using npx

```bash
cd mobile
npx expo start
```

### Option 3: Clear cache and start

```bash
cd mobile
npx expo start -c
```

## 📱 Connect Your Phone

### Step 1: Install Expo Go

- **iOS**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### Step 2: Connect

1. **Make sure phone and computer are on same WiFi**

2. **Scan QR Code**:
   - The terminal will show a QR code
   - iOS: Open Camera app → Scan QR
   - Android: Open Expo Go → Tap "Scan QR code"

3. **Or enter URL manually**:
   - Look for URL like: `exp://192.168.1.100:8081`
   - Open Expo Go → Enter URL manually

## 🔧 Troubleshooting

### Issue: "Command not found: expo"

**Solution**:
```bash
cd mobile
npx expo start
```

### Issue: "Cannot connect to Metro"

**Solution**:
```bash
cd mobile
npx expo start -c
```

### Issue: "Port already in use"

**Solution**:
```bash
# Kill process on port 8081
npx kill-port 8081

# Or use different port
npx expo start --port 8082
```

### Issue: "Phone can't connect"

**Solutions**:
1. Check same WiFi network
2. Disable firewall temporarily
3. Use tunnel mode:
   ```bash
   npx expo start --tunnel
   ```

### Issue: "Module not found"

**Solution**:
```bash
cd mobile
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start -c
```

## 🎯 Quick Commands

```bash
# Start normally
npm start

# Start with cache clear
npx expo start -c

# Start with tunnel (for different networks)
npx expo start --tunnel

# Start for specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

## 📋 What to Expect

When you run `npm start`, you'll see:

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

## ✅ Success Indicators

1. ✅ Terminal shows "Metro waiting on..."
2. ✅ QR code is displayed
3. ✅ No error messages
4. ✅ Phone can scan QR code
5. ✅ App loads in Expo Go

## 🎉 Next Steps

Once the app loads:

1. **Connect to Backend**:
   - Start backend server: `npm start` (in root directory)
   - In mobile app, scan backend QR code or enter URL

2. **Test Features**:
   - Voice input
   - Code generation
   - Real-time chat
   - Settings

## 📞 Need Help?

If you're still having issues:

1. Check `mobile/SETUP.md` for detailed setup
2. Verify Node.js version: `node --version` (need 18+)
3. Reinstall dependencies:
   ```bash
   cd mobile
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

---

**Ready to start? Run:** `cd mobile && npm start` 🚀
