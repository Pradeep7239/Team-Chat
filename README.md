📌 Team Chat – Real-Time Collaboration App (Slack-Like)

Team Chat is a modern real-time messaging application built with React, Node.js, Express, MongoDB, and Socket.IO.
It supports channel-based communication, presence tracking, typing indicators, authentication, and instant messaging — similar to Slack or Discord.

This project was built as part of a Full-Stack Internship Assignment to demonstrate clean architecture, scalable backend structure, and real-time communication.

🚀 Features
🔐 Authentication

User Signup

User Login

JWT-based authentication

Stay logged in after refresh

💬 Real-Time Chat

Send & receive messages instantly

Messages saved in MongoDB

Message history loading

🧵 Channels

Create channels

View all channels

Join & leave channels

Each channel has its own chat room

🟢 Presence

Online/offline user list

Multi-tab support

Updates instantly when a user connects or disconnects

✏️ Typing Indicator

“User is typing…” is shown in real-time

Auto-disappears after inactivity

🎨 Frontend UI

Responsive design

Built with Tailwind CSS

Clean layout with sidebar + chat window

🌐 Deployment Ready

Backend deployable on Render

Frontend deployable on Vercel

Works with MongoDB Atlas

📁 Project Structure
Team-Chat/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api.js
    │   ├── socket.js
    │   └── App.jsx
    ├── index.html
    ├── package.json
    └── tailwind.config.cjs

⚙️ Backend Setup
1. Install dependencies
cd backend
npm install

2. Create .env file
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
PORT = 4000

3. Start backend
node server.js


Expected output:

Server running on 4000

💻 Frontend Setup
1. Install dependencies
cd frontend
npm install

2. Configure API URL

In src/api.js:

baseURL: "http://localhost:4000/api",

3. Configure Socket.io URL

In src/socket.js:

io("http://localhost:4000", { auth: { token } })

4. Start frontend
npm run dev


Open browser:

http://localhost:5173

🧪 How to Test the Application
✔ Signup

Create a new account → redirects to chat

✔ Login

Enter credentials → redirects to chat

✔ Channels

Create channel

Click to join channel

Chat window loads

✔ Real-time messaging

Open two browsers → messages sync instantly

✔ Typing indicator

Typing in Window A shows indicator in Window B

✔ Online presence

Open multiple windows → online users list updates

🌍 Deployment
🔹 Backend Deployment (Render)

Push project to GitHub

Create Render Web Service

Root Directory → backend

Build Command → npm install

Start Command → node server.js

Add environment variables

Enable WebSockets

🔹 Frontend Deployment (Vercel)

Import project from GitHub

Root Directory → frontend

Build Command → npm run build

Output Directory → dist

Add environment variable:

VITE_API_URL = https://your-backend-url

Deploy

🧩 Optional Features (Bonus)

You may implement additional features:

Private channels

Message editing/deletion

Pagination for older messages

Search messages

File uploads

Emojis & reactions

User profiles

Dark mode

Add any implemented bonus features in this README later.

🎬 Screen Recording Requirements

Record a 8–15 minute video showing:

Signup + login

Creating, joining, and leaving channels

Realtime chat between two windows

Online presence

Typing indicators

Message history

Code walkthrough:

Folder structure

Backend routes

Authentication flow

Socket.IO events

Design decisions

👤 Author

Developed by Pradeep Kumar Jangir
Part of a Full-Stack Assignment.