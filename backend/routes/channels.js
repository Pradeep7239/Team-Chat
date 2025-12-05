const express = require('express');
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');
const router = express.Router();

// Create channel
router.post('/', auth, async (req, res) => {
  const { name, isPrivate } = req.body;
  if (!name) return res.status(400).send({ message: 'Name required' });
  try {
    const channel = await Channel.create({ name, isPrivate, members: [req.user.id] });
    res.json(channel);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// List channels
router.get('/', auth, async (req, res) => {
  const channels = await Channel.find().select('-__v').lean();
  res.json(channels);
});

// Join a channel
router.post('/:id/join', auth, async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).send({ message: 'Not found' });
  if (!channel.members.includes(req.user.id)) {
    channel.members.push(req.user.id);
    await channel.save();
  }
  res.json(channel);
});

// Leave
router.post('/:id/leave', auth, async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).send({ message: 'Not found' });
  channel.members = channel.members.filter(m => m.toString() !== req.user.id);
  await channel.save();
  res.json(channel);
});

module.exports = router;
