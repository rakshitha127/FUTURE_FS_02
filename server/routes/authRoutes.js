import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/authMiddleware.js';
import { useFileDb } from '../config/database.js';

const router = express.Router();

function createToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (useFileDb()) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      token: createToken('file-admin'),
      admin: {
        id: 'file-admin',
        name: process.env.ADMIN_NAME || 'Admin',
        email: adminEmail
      }
    });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({
    token: createToken(admin._id),
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email
    }
  });
});

router.get('/me', protect, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
