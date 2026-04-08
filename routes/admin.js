const express = require('express');
const User = require('../models/User');
const LoanApplication = require('../models/LoanApplication');
const ContactInquiry = require('../models/ContactInquiry');
const Branch = require('../models/Branch');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', auth, authorize('admin'), async (req, res) => {
  const [users, loans, inquiries, branches] = await Promise.all([
    User.countDocuments(),
    LoanApplication.countDocuments(),
    ContactInquiry.countDocuments(),
    Branch.countDocuments()
  ]);

  const byStatus = await LoanApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  res.json({
    totals: { users, loans, inquiries, branches },
    loanStatus: byStatus
  });
});

router.get('/users', auth, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password -otp -otpExpiresAt').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = router;
