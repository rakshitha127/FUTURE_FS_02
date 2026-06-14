import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'fileDb.json');

const sampleLeads = [
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    company: 'Bright Studio',
    source: 'Website Contact Form',
    service: 'Landing Page',
    priority: 'high',
    estimatedValue: 45000,
    nextFollowUp: '2026-06-18',
    message: 'Interested in a landing page for my design agency.',
    status: 'new',
    notes: [{ text: 'Send pricing package and portfolio links.', createdBy: 'Admin' }]
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    phone: '+91 91234 56780',
    company: 'Mehta Foods',
    source: 'Instagram Campaign',
    service: 'E-commerce Website',
    priority: 'medium',
    estimatedValue: 85000,
    nextFollowUp: '2026-06-20',
    message: 'Needs a website with online ordering.',
    status: 'contacted',
    notes: [{ text: 'Called once. Follow up tomorrow with proposal.', createdBy: 'Admin' }]
  },
  {
    name: 'Neha Iyer',
    email: 'neha@example.com',
    phone: '+91 99887 76655',
    company: 'Iyer Consulting',
    source: 'Referral',
    service: 'CRM Automation',
    priority: 'high',
    estimatedValue: 120000,
    nextFollowUp: '2026-06-22',
    message: 'Asked for CRM and automation help.',
    status: 'converted',
    notes: [{ text: 'Converted after demo call. Prepare onboarding checklist.', createdBy: 'Admin' }]
  }
];

function now() {
  return new Date().toISOString();
}

function makeLead(lead) {
  const timestamp = now();

  return {
    _id: randomUUID(),
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company || '',
    source: lead.source || 'Website Contact Form',
    service: lead.service || 'Website / App Development',
    priority: lead.priority || 'medium',
    estimatedValue: Number(lead.estimatedValue) || 0,
    nextFollowUp: lead.nextFollowUp || null,
    message: lead.message || '',
    status: lead.status || 'new',
    notes: (lead.notes || []).map((note) => ({
      _id: randomUUID(),
      text: note.text,
      createdBy: note.createdBy || 'Admin',
      createdAt: timestamp,
      updatedAt: timestamp
    })),
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

async function readDb() {
  try {
    const content = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(content);
  } catch {
    const db = { leads: sampleLeads.map(makeLead) };
    await writeDb(db);
    return db;
  }
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function seedFileDb() {
  const db = await readDb();

  if (db.leads.length === 0) {
    db.leads = sampleLeads.map(makeLead);
    await writeDb(db);
  }

  return db.leads.length;
}

export async function createLead(data) {
  const db = await readDb();
  const lead = makeLead(data);
  db.leads.unshift(lead);
  await writeDb(db);
  return lead;
}

export async function listLeads({ status = 'all', search = '' }) {
  const db = await readDb();
  const query = search.toLowerCase();

  let leads = db.leads;

  if (status !== 'all') {
    leads = leads.filter((lead) => lead.status === status);
  }

  if (query) {
    leads = leads.filter((lead) => (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.source.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.service.toLowerCase().includes(query)
    ));
  }

  const analytics = {
    total: db.leads.length,
    new: db.leads.filter((lead) => lead.status === 'new').length,
    contacted: db.leads.filter((lead) => lead.status === 'contacted').length,
    converted: db.leads.filter((lead) => lead.status === 'converted').length,
    highPriority: db.leads.filter((lead) => lead.priority === 'high').length,
    pipelineValue: db.leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0)
  };

  return { leads, analytics };
}

export async function updateLeadStatus(id, status) {
  const db = await readDb();
  const lead = db.leads.find((item) => item._id === id);

  if (!lead) return null;

  lead.status = status;
  lead.updatedAt = now();
  await writeDb(db);
  return lead;
}

export async function addLeadNote(id, text, createdBy) {
  const db = await readDb();
  const lead = db.leads.find((item) => item._id === id);

  if (!lead) return null;

  const timestamp = now();
  lead.notes.push({
    _id: randomUUID(),
    text,
    createdBy,
    createdAt: timestamp,
    updatedAt: timestamp
  });
  lead.updatedAt = timestamp;
  await writeDb(db);
  return lead;
}

export async function deleteLeadById(id) {
  const db = await readDb();
  const beforeCount = db.leads.length;
  db.leads = db.leads.filter((lead) => lead._id !== id);
  await writeDb(db);
  return db.leads.length !== beforeCount;
}
