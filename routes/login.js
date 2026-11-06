import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();

// POST /login
router.post('/', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Informe e-mail e senha.' });

    const cliente = await db('cliente').where({ email }).first();
    if (!cliente) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: cliente.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

export default router;
