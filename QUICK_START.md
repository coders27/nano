# 🚀 Quick Start Guide - AWS AI for Bharat Demo

## 5-Minute Setup for Demo

### Prerequisites
- Node.js 18+ installed
- AWS Account with credentials
- Antigravity IDE installed

### Step 1: Clone & Install (2 minutes)

```bash
git clone https://github.com/coders27/Nano CLI2.git
cd Nano CLI2
npm install
```

### Step 2: Configure AWS (2 minutes)

1. **Copy environment file**:
   ```bash
   copy .env.example .env
   ```

2. **Edit .env** and add your AWS credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_here
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=Nano CLI-audio
   ```

3. **Create S3 bucket** (if not exists):
   ```bash
   aws s3 mb s3://Nano CLI-audio --region ap-south-1
   ```

### Step 3: Start Server (1 minute)

```bash
npm start -- --auto-launch
```

This will:
- Launch Antigravity IDE with debug mode
- Start Nano Server
- Display QR code for mobile connection

## Testing AWS Features

### Test 1: AI Chat

```bash
curl -X POST http://localhost:3000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain async/await in JavaScript"}'
```

### Test 2: Code Analysis

```bash
curl -X POST http://localhost:3000/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "function test() { var x = 1; }", "language": "javascript"}'
```

### Test 3: Code Generation

```bash
curl -X POST http://localhost:3000/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Create a function to validate email", "language": "javascript"}'
```

### Test 4: Translation

```bash
curl -X POST http://localhost:3000/translate/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "targetLanguage": "hi"}'
```

### Test 5: Voice Transcription

```bash
# Requires audio file
curl -X POST http://localhost:3000/voice/transcribe \
  -F "audio=@test-audio.wav" \
  -F "language=hi-IN"
```

## Mobile App Setup

### Option 1: Expo Go (Fastest)

1. **Install Expo Go** on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Start mobile app**:
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

3. **Scan QR code** with Expo Go app

4. **Connect to server**:
   - Scan the server QR code OR
   - Enter server URL manually

### Option 2: Build APK (For Demo)

```bash
cd mobile
npx expo build:android
```

## Demo Checklist

### Before Demo:
- [ ] Server running on laptop
- [ ] Mobile app connected
- [ ] Antigravity IDE open with a project
- [ ] Test voice input working
- [ ] Test AI features working
- [ ] Backup video ready

### Demo Flow:
1. **Show Connection** (30 sec)
   - Display QR code
   - Connect mobile app
   - Show real-time sync

2. **Voice Input Demo** (30 sec)
   - Tap microphone
   - Speak in Hindi: "एक फंक्शन बनाओ जो दो नंबर जोड़े"
   - Show transcription
   - Show code generation

3. **Code Analysis** (30 sec)
   - Paste buggy code
   - Click analyze
   - Show AI suggestions

4. **Translation** (30 sec)
   - Show English code
   - Translate to Tamil
   - Show translated comments

5. **Remote Control** (30 sec)
   - Send message from phone
   - Show IDE response
   - Receive notification

## Troubleshooting

### Issue: AWS Credentials Error
**Solution**: Check .env file has correct credentials
```bash
aws sts get-caller-identity
```

### Issue: Bedrock Access Denied
**Solution**: Enable model access in AWS Console
1. Go to Bedrock console
2. Click "Model access"
3. Request access to Claude 3.5 Sonnet

### Issue: S3 Bucket Not Found
**Solution**: Create bucket
```bash
aws s3 mb s3://Nano CLI-audio --region ap-south-1
```

### Issue: Mobile App Can't Connect
**Solution**: Check firewall, use same WiFi network

### Issue: Voice Transcription Fails
**Solution**: Check audio format (WAV), language code

## Quick Demo Script

**Opening** (15 sec):
"Hi, I'm [name]. We built Nano CLI to help Indian developers code in their native language using AWS AI."

**Problem** (30 sec):
"70% of Indian developers face barriers - English-only tools, poor connectivity, no AI access. We're solving this."

**Demo** (90 sec):
[Perform 5 demos above]

**Impact** (30 sec):
"This enables 10,000+ students, works on 2G networks, supports 9 languages. Built on AWS Bedrock, Transcribe, Translate."

**Close** (15 sec):
"We're making AI coding accessible for every Indian developer. Thank you!"

## Key Talking Points

1. **AWS Integration**: "We use 6 AWS services - Bedrock for AI, Transcribe for voice, Translate for languages"

2. **Innovation**: "First remote IDE controller with Indic language support"

3. **Impact**: "Solves accessibility for 70% of Indian developers"

4. **Technical**: "Clean architecture, RESTful APIs, WebSocket for real-time"

5. **Scalability**: "AWS infrastructure, ready for millions of users"

## Backup Plan

If live demo fails:
1. Show pre-recorded video
2. Walk through screenshots
3. Explain architecture
4. Focus on impact metrics

## Resources

- **Full Documentation**: AWS_AI_BHARAT.md
- **Presentation Guide**: HACKATHON_GUIDE.md
- **Setup Help**: SETUP_INSTRUCTIONS.md

---

**You're ready! Go win that hackathon!** 🏆🇮🇳
