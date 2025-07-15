💤 Dreamology Tools

A dream journal web app to record, revisit, and reflect on dreams — with audio entries, filtering, pagination, and authentication.


---

✨ Features

✍️ Write and save dream entries

🎙️ Record and replay voice memos

🔍 Filter and search by date or keywords

📄 Paginated entries for better navigation

🔐 Secure login with NextAuth.js



---

🧰 Tech Stack

Next.js (React)

MongoDB with Mongoose

NextAuth.js for authentication

Tailwind CSS (or your preferred UI library)

HTML5 Audio / Web Audio API



---

⚙️ Setup & Configuration

Prerequisites

Node.js ≥ 16

MongoDB (local or Atlas)


Install

git clone https://github.com/Callypige/dreamology-tools.git
cd dreamology-tools
npm install

Configure Environment

Create .env.local with:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dreams
NEXTAUTH_SECRET=yourSecretKey
NEXTAUTH_URL=http://localhost:3000

Run Locally

npm run dev

Access at: http://localhost:3000


---

🗓️ Roadmap

🗓 Calendar view for browsing dreams

☁️ Deployment to Vercel or Railway

📱 Mobile optimization

📤 Export as PDF / encrypted archive
