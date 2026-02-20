import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const users = new Map(); // { email -> {name,email,passwordHash} } (demo amaçlı in-memory)

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  if (users.has(email)) return res.status(409).json({ message: 'user exists' });
  users.set(email, { name: name || email.split('@')[0], email, passwordHash: password });
  return res.status(201).json({ message: 'registered' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const u = users.get(email);
  if (!u || u.passwordHash !== password) return res.status(401).json({ message: 'invalid credentials' });
  const token = jwt.sign({ sub: email }, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' });
  return res.json({ token, user: { email: u.email, name: u.name } });
});

export default router;
