import { Router } from 'express';

const router = Router();
const data = []; // demo amaçlı hafızada

router.get('/', (req, res) => {
  res.json({ items: data });
});

router.post('/', (req, res) => {
  const { type='EXPENSE', amount=0, category='', date=new Date().toISOString().slice(0,10), comment='' } = req.body || {};
  const item = { id: String(Date.now()), type, amount: Number(amount), category, date, comment };
  data.push(item);
  res.status(201).json(item);
});

export default router;
