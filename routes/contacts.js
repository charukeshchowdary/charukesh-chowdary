const express = require('express');
const ContactInquiry = require('../models/ContactInquiry');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
  }
});

router.get('/', auth, authorize('admin'), async (req, res) => {
  const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

module.exports = router;
