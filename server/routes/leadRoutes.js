import express from 'express';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/authMiddleware.js';
import { useFileDb } from '../config/database.js';
import {
  addLeadNote,
  createLead,
  deleteLeadById,
  listLeads,
  updateLeadStatus
} from '../data/fileStore.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    source,
    service,
    priority,
    estimatedValue,
    nextFollowUp,
    message
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  if (useFileDb()) {
    const lead = await createLead({
      name,
      email,
      phone,
      company,
      source,
      service,
      priority,
      estimatedValue,
      nextFollowUp,
      message
    });
    return res.status(201).json({ message: 'Lead received successfully.', lead });
  }

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    source,
    service,
    priority,
    estimatedValue: Number(estimatedValue) || 0,
    nextFollowUp: nextFollowUp || null,
    message
  });

  res.status(201).json({ message: 'Lead received successfully.', lead });
});

router.get('/', protect, async (req, res) => {
  const { status, search } = req.query;

  if (useFileDb()) {
    const data = await listLeads({ status, search });
    return res.json(data);
  }

  const filters = {};

  if (status && status !== 'all') {
    filters.status = status;
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { source: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { service: { $regex: search, $options: 'i' } }
    ];
  }

  const leads = await Lead.find(filters).sort({ createdAt: -1 });
  const allLeads = await Lead.find();

  const analytics = {
    total: allLeads.length,
    new: allLeads.filter((lead) => lead.status === 'new').length,
    contacted: allLeads.filter((lead) => lead.status === 'contacted').length,
    converted: allLeads.filter((lead) => lead.status === 'converted').length,
    highPriority: allLeads.filter((lead) => lead.priority === 'high').length,
    pipelineValue: allLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0)
  };

  res.json({ leads, analytics });
});

router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  if (!['new', 'contacted', 'converted'].includes(status)) {
    return res.status(400).json({ message: 'Invalid lead status.' });
  }

  if (useFileDb()) {
    const lead = await updateLeadStatus(req.params.id, status);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.json({ message: 'Lead status updated.', lead });
  }

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }

  res.json({ message: 'Lead status updated.', lead });
});

router.post('/:id/notes', protect, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Note text is required.' });
  }

  if (useFileDb()) {
    const lead = await addLeadNote(req.params.id, text, req.admin.name);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.status(201).json({ message: 'Follow-up note added.', lead });
  }

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }

  lead.notes.push({ text, createdBy: req.admin.name });
  await lead.save();

  res.status(201).json({ message: 'Follow-up note added.', lead });
});

router.delete('/:id', protect, async (req, res) => {
  if (useFileDb()) {
    const deleted = await deleteLeadById(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.json({ message: 'Lead deleted.' });
  }

  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: 'Lead not found.' });
  }

  res.json({ message: 'Lead deleted.' });
});

export default router;
