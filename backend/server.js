require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const onlineUsers = new Map(); // userId -> { sockets: Set(socketId), info: {username, displayName} }

// 🔐 Authenticate socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload; // { id, username }
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user.id;
  const userInfo = { id: userId, username: socket.user.username };

  // Track online users (multi-tab supported)
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, { sockets: new Set(), info: userInfo });
  }
  onlineUsers.get(userId).sockets.add(socket.id);

  // Broadcast updated online list
  const onlineList = Array.from(onlineUsers.values()).map(v => v.info);
  io.emit('presence:update', onlineList);

  // Join a channel room
  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
  });

  // Leave channel
  socket.on('leaveChannel', (channelId) => {
    socket.leave(channelId);
  });

  // ✨ New Feature: Real-time Typing Indicator ✨
  socket.on("typing", ({ channelId }) => {
    socket.to(channelId).emit("typing", {
      userId: socket.user.id,
      username: socket.user.username,
      channelId,
    });
  });

  socket.on("stopTyping", ({ channelId }) => {
    socket.to(channelId).emit("stopTyping", {
      userId: socket.user.id,
      channelId,
    });
  });

  // Send Message
  socket.on('message:send', async ({ channelId, text }) => {
    if (!text || !channelId) return;

    const msg = await Message.create({
      channel: channelId,
      sender: userId,
      text,
      createdAt: new Date()
    });

    await msg.populate('sender', 'username displayName');

    io.to(channelId).emit('message:new', {
      _id: msg._id,
      channel: msg.channel,
      text: msg.text,
      createdAt: msg.createdAt,
      sender: msg.sender
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (onlineUsers.has(userId)) {
      const entry = onlineUsers.get(userId);
      entry.sockets.delete(socket.id);

      if (entry.sockets.size === 0) {
        onlineUsers.delete(userId);
      } else {
        onlineUsers.set(userId, entry);
      }
    }

    const onlineList2 = Array.from(onlineUsers.values()).map(v => v.info);
    io.emit('presence:update', onlineList2);
  });
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log('Server running on', PORT));
  })
  .catch(err => console.error(err));
