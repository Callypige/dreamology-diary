# 💤 Dreamology Tools

A dream journal web app to record, revisit, and reflect on dreams — with audio entries, filtering, pagination, and authentication.

**🌐 Live Demo:** [dreamology-tools.netlify.app](https://dreamology-tools.netlify.app)

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
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dreams
NEXTAUTH_SECRET=yourSecretKey
NEXTAUTH_URL=http://localhost:3000
```

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
