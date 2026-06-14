import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { useFileDb } from '../config/database.js';

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (useFileDb() && decoded.id === 'file-admin') {
      req.admin = {
        _id: 'file-admin',
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com'
      };
      return next();
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({ message: 'Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}
