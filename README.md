Team Chat – Real-Time Collaboration App
A full-stack, Slack-like team chat application built with React, Node.js, Express, MongoDB, and Socket.IO.
This project includes user authentication, real-time messaging, online user presence, typing indicators, and channel-based communication.

Overview
Team Chat is a real-time communication application that allows multiple users to chat inside channels.
It supports features like real-time messages, presence updates, typing indicators, message history, and more.

Features
• User Sign Up and Login (JWT Authentication)
• Stay logged in after refresh
• Create and view channels
• Join and leave channels
• Real-time messaging using Socket.IO
• Online/Offline user presence indicator
• Typing indicator ("User is typing...")
• Message history fetched from backend
• Pagination support for older messages (optional extension)
• Protected routes on frontend
• Fully responsive UI using Tailwind CSS

Tech Stack
Frontend:
• React
• React Router
• Tailwind CSS
• Axios
• Socket.IO Client

Backend:
• Node.js
• Express.js
• MongoDB + Mongoose
• JWT Authentication
• Socket.IO
• CORS

Hosting:
• Backend hosted on Render
• Frontend hosted on Vercel (recommended)
• MongoDB Atlas used as cloud database

Project Structure
Backend contains routes, models, authentication, and real-time events.
Frontend contains pages, components, socket client, and API integration.

Setup Instructions
Backend Setup:

Install dependencies using: npm install

Create an .env file and add:
• MONGO_URI = your MongoDB URI
• JWT_SECRET = your secret key
• PORT = 4000 (or provided by hosting)

Start server using: node server.js

Frontend Setup:

Install dependencies: npm install

Update the API base URL in src/api.js

Update socket URL in src/socket.js

Start frontend: npm run dev

Deployment Notes
Backend:
Deploy on Render.
Enable WebSockets.
Add environment variables.

Frontend:
Deploy on Vercel.
Set React build command automatically.
Ensure API base URL is pointed to Render backend.

Optional Enhancements
• Private channels
• Message editing/deleting
• Search messages
• File uploads
• Dark mode
• Notifications
• Role-based access