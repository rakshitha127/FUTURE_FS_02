import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import Lead from './models/Lead.js';
import { connectDatabase, useFileDb } from './config/database.js';
import { seedFileDb } from './data/fileStore.js';

dotenv.config();

async function seed() {
  await connectDatabase();

  if (useFileDb()) {
    const leadCount = await seedFileDb();
    console.log(`File database ready with ${leadCount} leads.`);
    return;
  }

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 10);
    await Admin.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email,
      password: hashedPassword
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  const leadCount = await Lead.countDocuments();

  if (leadCount === 0) {
    await Lead.insertMany([
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 98765 43210',
        company: 'Bright Studio',
        source: 'Website Contact Form',
        message: 'Interested in a landing page for my design agency.',
        status: 'new',
        notes: [{ text: 'Send pricing package and portfolio links.' }]
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@example.com',
        phone: '+91 91234 56780',
        company: 'Mehta Foods',
        source: 'Instagram Campaign',
        message: 'Needs a website with online ordering.',
        status: 'contacted',
        notes: [{ text: 'Called once. Follow up tomorrow with proposal.' }]
      },
      {
        name: 'Neha Iyer',
        email: 'neha@example.com',
        phone: '+91 99887 76655',
        company: 'Iyer Consulting',
        source: 'Referral',
        message: 'Asked for CRM and automation help.',
        status: 'converted',
        notes: [{ text: 'Converted after demo call. Prepare onboarding checklist.' }]
      }
    ]);
    console.log('Sample leads created.');
  } else {
    console.log('Sample leads skipped because leads already exist.');
  }

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
