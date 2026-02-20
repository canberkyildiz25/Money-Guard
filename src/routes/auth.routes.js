import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// POST /api/users/register
router.post('/register', async (req,res)=>{
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({message:'Missing fields'});
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({message:'Email in use'});
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash });
  res.status(201).json({ id:user._id, name:user.name, email:user.email });
});

// POST /api/users/login
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({message:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({message:'Invalid credentials'});
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: String(user._id), expiresIn: '7d' });
  res.json({ token, user: { id:user._id, name:user.name, email:user.email } });
});

export default router;
