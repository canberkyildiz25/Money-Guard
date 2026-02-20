import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = Router();
router.use(auth);

// GET /api/transactions
router.get('/', async (req,res)=>{
  const items = await Transaction.find({ userId: req.user.id }).sort({ date:-1, createdAt:-1 });
  res.json(items);
});

// POST /api/transactions
router.post('/', async (req,res)=>{
  const { type, category, amount, date, comment } = req.body;
  if (!type || !category || amount == null || !date) return res.status(400).json({message:'Missing fields'});
  const item = await Transaction.create({ userId:req.user.id, type, category, amount, date, comment });
  res.status(201).json(item);
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req,res)=>{
  const { id } = req.params;
  await Transaction.deleteOne({ _id:id, userId:req.user.id });
  res.json({ ok:true });
});

export default router;
