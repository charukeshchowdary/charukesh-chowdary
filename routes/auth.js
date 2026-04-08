const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { generateOtp } = require('../utils/otp');
const { sendEmail } = require('../utils/email');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ name, email, phone, password: hashedPassword, otp, otpExpiresAt });

    await sendEmail({
      to: email,
      subject: 'Verify your Tummala Finance account',
      body: `Your OTP is ${otp}. It expires in 10 minutes.`
    });

    res.status(201).json({
      message: 'Registration successful. Verify OTP sent to email.',
      token: signToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.json({ message: 'Email verification successful' });
  } catch (error) {
    return res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password -otp -otpExpiresAt');
  res.json(user);
});

module.exports = router;
