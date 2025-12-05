const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) return res.status(400).send({ message: 'Missing fields' });
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).send({ message: 'Username taken' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash: hash, displayName });
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, displayName: user.displayName }});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).send({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
  res.json({ token, user: { id: user._id, username: user.username, displayName: user.displayName }});
});

module.exports = router;
