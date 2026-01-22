# 🚀 How to Run Nano IDE - Complete Guide

## 📋 Overview

Nano IDE has two parts:
1. **Backend Server** (Node.js) - Runs on your computer
2. **Mobile App** (Expo/React Native) - Runs on your phone

## ⚡ Quick Start (5 Minutes)

### Step 1: Start Backend Server

```bash
# In project root directory
npm install
npm start
```

You'll see:
- ✅ Server running on port 3000
- ✅ QR code displayed
- ✅ Connection URL shown

### Step 2: Start Mobile App

```bash
# In new terminal
cd mobile
npm start
```

You'll see:
- ✅ Metro bundler running
- ✅ QR code displayed
- ✅ Expo DevTools opened

### Step 3: Connect Phone

1. Install **Expo Go** on your phone
2. Scan the **mobile app QR code**
3. App opens in Expo Go
4. Scan the **backend server QR code** or enter URL
5. Start coding! 🎉

---

## 📱 Detailed Mobile App Setup

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ Phone with Expo Go app
- ✅ Same WiFi network for phone and computer

### Installation

```bash
cd mobile
npm install --legacy-peer-deps
```

### Starting the App

**Option 1: Normal Start**
```bash
npm start
```

**Option 2: Clear Cache**
```bash
npx expo start -c
```

**Option 3: Tunnel Mode** (if on different networks)
```bash
npx expo start --tunnel
```

### Connecting Your Phone

#### iOS:
1. Open **Camera** app
2. Point at QR code in terminal
3. Tap notification to open in Expo Go

#### Android:
1. Open **Expo Go** app
2. Tap "Scan QR code"
3. Scan QR code in terminal

#### Manual URL Entry:
1. Look for URL like: `exp://192.168.1.100:8081`
2. Open Expo Go
3. Enter URL manually

---

## 🖥️ Backend Server Setup

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ Antigravity IDE installed (optional, for full features)

### Installation

```bash
# In project root
npm install
```

### Starting the Server

**Option 1: Simple Start**
```bash
npm start
```

**Option 2: With Antigravity Auto-Launch**
```bash
npm start -- --auto-launch
```

**Option 3: Web Mode (ngrok tunnel)**
```bash
npm start -- --web
```

### Server URLs

After starting, you'll see:
- **Local**: `http://192.168.1.100:3000`
- **Web** (if using ngrok): `https://abc123.ngrok.io`

---

## 🔧 Troubleshooting

### Mobile App Issues

#### "Cannot connect to Metro"
```bash
cd mobile
npx expo start -c
```

#### "Module not found"
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npx expo start -c
```

#### "Phone can't connect"
1. Check same WiFi network
2. Disable firewall temporarily
3. Try tunnel mode:
   ```bash
   npx expo start --tunnel
   ```

#### "Port 8081 already in use"
```bash
npx kill-port 8081
# Or
npx expo start --port 8082
```

### Backend Server Issues

#### "Port 3000 already in use"
```bash
# Kill process
npx kill-port 3000
# Or use different port
PORT=3001 npm start
```

#### "Cannot find Antigravity"
```bash
# Start without auto-launch
npm start

# Or manually start Antigravity first
antigravity . --remote-debugging-port=9000
```

#### "AWS credentials error"
```bash
# Configure AWS (optional, for AI features)
cp .env.example .env
# Edit .env with your AWS credentials
```

---

## 📂 Project Structure

```
nano/
├── backend/              # Backend server
│   ├── aws/             # AWS integrations
│   ├── routes/          # API routes
│   ├── cdp/             # Chrome DevTools Protocol
│   └── server/          # Express server
│
├── mobile/              # Mobile app
│   ├── app/            # Expo Router pages
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API services
│   └── package.json    # Mobile dependencies
│
├── package.json         # Backend dependencies
└── README.md           # Documentation
```

---

## 🎯 Testing the Setup

### Test Backend

```bash
# Check server health
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","cdp":true}
```

### Test Mobile App

1. Open Expo Go on phone
2. Scan QR code
3. App should load without errors
4. You should see "Connect to Server" screen

### Test Full Flow

1. Start backend: `npm start`
2. Start mobile: `cd mobile && npm start`
3. Open app on phone
4. Scan backend QR code
5. Send a test message
6. Verify response appears

---

## 🚀 Running in Production

### Backend

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "nano-backend" -- start

# View logs
pm2 logs nano-backend

# Stop
pm2 stop nano-backend
```

### Mobile App

```bash
# Build for Android
cd mobile
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

---

## 📊 Performance Tips

### Backend
- Use PM2 for process management
- Enable compression (already configured)
- Use Redis for session storage (optional)
- Deploy to AWS EC2 or Lambda

### Mobile
- Enable Hermes engine (already configured)
- Use production build for testing
- Optimize images and assets
- Enable code splitting

---

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Configure AWS credentials securely
- [ ] Enable HTTPS (auto-generated SSL)
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets

---

## 📚 Additional Resources

- **Setup Guide**: `mobile/SETUP.md`
- **Start Guide**: `START_MOBILE.md`
- **AWS Features**: `AWS_AI_BHARAT.md`
- **Advanced Features**: `ADVANCED_FEATURES.md`
- **Hackathon Guide**: `HACKATHON_GUIDE.md`

---

## 🆘 Getting Help

### Common Commands

```bash
# Backend
npm start                    # Start server
npm install                  # Install dependencies
npm start -- --auto-launch   # Start with Antigravity

# Mobile
cd mobile
npm start                    # Start Expo
npx expo start -c           # Clear cache and start
npx expo start --tunnel     # Start with tunnel
npm install --legacy-peer-deps  # Install dependencies
```

### Check Versions

```bash
node --version              # Should be 18+
npm --version               # Should be 8+
npx expo --version          # Should show version
```

### Reset Everything

```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Mobile
cd mobile
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## ✅ Success Checklist

### Backend
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] QR code displays

### Mobile
- [ ] Dependencies installed
- [ ] Expo starts without errors
- [ ] QR code displays
- [ ] App loads on phone

### Integration
- [ ] Phone connects to backend
- [ ] Messages can be sent
- [ ] Responses appear
- [ ] Real-time updates work

---

## 🎉 You're Ready!

If all checks pass, you're ready to:
1. ✅ Demo the app
2. ✅ Test all features
3. ✅ Present at hackathon
4. ✅ Deploy to production

**Need help?** Check the troubleshooting section or documentation files.

---

**Built with ❤️ by Coders27 Team** 🇮🇳
