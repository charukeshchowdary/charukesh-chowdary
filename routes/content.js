const express = require('express');
const ContentBlock = require('../models/ContentBlock');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const blocks = await ContentBlock.find().sort({ key: 1 });
  res.json(blocks);
});

router.put('/:key', auth, authorize('admin'), async (req, res) => {
  const block = await ContentBlock.findOneAndUpdate(
    { key: req.params.key },
    { key: req.params.key, ...req.body },
    { new: true, upsert: true }
  );
  res.json(block);
});

module.exports = router;
