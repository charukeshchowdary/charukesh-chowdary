const express = require('express');
const Branch = require('../models/Branch');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { city, state } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(city, 'i');
  if (state) filter.state = new RegExp(state, 'i');
  const branches = await Branch.find(filter).sort({ city: 1 });
  res.json(branches);
});

router.post('/', auth, authorize('admin'), async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json(branch);
});

router.put('/:id', auth, authorize('admin'), async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  res.json(branch);
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  const branch = await Branch.findByIdAndDelete(req.params.id);
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  res.json({ message: 'Branch deleted' });
});

module.exports = router;
