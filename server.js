const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const contactRoutes = require('./routes/contacts');
const branchRoutes = require('./routes/branches');
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');
const notificationRoutes = require('./routes/notifications');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Tummala Finance API' }));

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('*', (req, res) => {
  const file = req.path === '/' ? 'index.html' : `${req.path.replace('/', '')}.html`;
  res.sendFile(path.join(__dirname, 'public', file), (error) => {
    if (error) {
      res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Tummala Finance running on port ${PORT}`));
