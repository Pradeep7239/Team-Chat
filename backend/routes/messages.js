const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// Pagination: GET /api/channels/:id/messages?before=timestamp&limit=20
router.get('/channel/:id', auth, async (req, res) => {
  const { before, limit = 20 } = req.query;
  const query = { channel: req.params.id };
  if (before) query.createdAt = { $lt: new Date(before) };
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('sender', 'username displayName')
    .lean();
  // return in chronological order (oldest first)
  res.json(messages.reverse());
});

module.exports = router;
