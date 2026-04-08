const express = require('express');
const multer = require('multer');
const path = require('path');
const LoanApplication = require('../models/LoanApplication');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');
const { generateLoanSummaryPdf } = require('../utils/pdf');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only PDF/JPG/JPEG/PNG files are allowed'));
    cb(null, true);
  }
});

router.post('/', auth, upload.single('document'), async (req, res) => {
  try {
    const payload = req.body;
    const loan = await LoanApplication.create({
      user: req.user.userId,
      applicantName: payload.applicantName,
      loanType: payload.loanType,
      loanAmount: Number(payload.loanAmount),
      interestRate: Number(payload.interestRate),
      tenureMonths: Number(payload.tenureMonths),
      documentUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    loan.pdfSummaryUrl = generateLoanSummaryPdf(loan);
    await loan.save();

    await Notification.create({
      user: req.user.userId,
      title: 'Loan Application Submitted',
      message: `Your ${loan.loanType} application has been submitted successfully.`
    });

    return res.status(201).json(loan);
  } catch (error) {
    return res.status(500).json({ message: 'Loan submission failed', error: error.message });
  }
});

router.get('/my', auth, async (req, res) => {
  const loans = await LoanApplication.find({ user: req.user.userId }).sort({ createdAt: -1 });
  res.json(loans);
});

router.get('/', auth, authorize('admin'), async (req, res) => {
  const loans = await LoanApplication.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(loans);
});

router.patch('/:id/status', auth, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  const loan = await LoanApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!loan) return res.status(404).json({ message: 'Loan application not found' });

  await Notification.create({
    user: loan.user,
    title: 'Loan Status Updated',
    message: `Your application status is now: ${status}.`
  });

  res.json(loan);
});

module.exports = router;
