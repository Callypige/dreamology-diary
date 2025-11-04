# 💤 Dreamology Tools

A dream journal web app to record, revisit, and reflect on dreams — with audio entries, filtering, pagination, and authentication.

<img width="898" height="410" alt="somni_dreamology" src="https://github.com/user-attachments/assets/2c076b6c-a689-44f7-813b-d8037aa7c12c" />

**🌐 Live Demo:** [Dreamology Diary](https://dreamologydiary.netlify.app)

🔑 Demo Account
For recruiters and testers, use these credentials:
Email: somni_dreamology-demo@yopmail.com
Password: Demouser1234

This account contains sample dream entries to showcase all features.

## ✨ Features

✍️ **Write and save dream entries** with detailed metadata  
🎙️ **Record and replay voice memos** for each dream  
🔍 **Filter and search** by date, keywords, or dream type  
📄 **Paginated entries** for better navigation  
🔐 **Secure authentication** with NextAuth.js  
📱 **Progressive Web App (PWA)** - installable on mobile & desktop  
🗓️ **Calendar view** for browsing dreams by date  

## 🧰 Tech Stack
- **Frontend:** Next.js 14 (React), Tailwind CSS
- **Backend:** MongoDB with Mongoose
- **Authentication:** NextAuth.js  
- **Audio:** HTML5 Audio / Web Audio API
- **Deployment:** Netlify with automatic CI/CD
- **PWA:** Service Worker for offline functionality

## ⚙️ Setup & Configuration

### Prerequisites
- Node.js ≥ 16
- MongoDB (Atlas or local)

### Install
```bash
git clone https://github.com/Callypige/dreamology-tools.git
cd dreamology-tools
npm install
```

### Configure Environment
Create `.env.local` with:
```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dreams

# Authentication
NEXTAUTH_SECRET=yourRandomSecretKey
NEXTAUTH_URL=http://localhost:3000

# Email (SMTP) - Required for user verification & password reset
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@dreamology.com
```

> **Note:** For Gmail SMTP, enable 2FA and generate an [App Password](https://myaccount.google.com/apppasswords).
> See `.env.example` for alternative SMTP providers (SendGrid, Mailgun, Amazon SES, etc.)

### Run Locally
```bash
npm run dev
```
Access at: http://localhost:3000

## 📱 PWA Installation

The app can be installed as a Progressive Web App:
1. Visit the live site on mobile or desktop
2. Look for "Install App" or "Add to Home Screen" prompt
3. Enjoy the native app experience with offline capabilities

## 🗓️ Roadmap

✅ Calendar view for browsing dreams  
✅ PWA implementation  
✅ Netlify deployment  
🔄 **In Progress:** Export as PDF / encrypted archive  
🔔 **Future:** Push notifications for dream reminders



*Sweet dreams! 🌙✨*
