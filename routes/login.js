import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();

// POST /login
router.post('/', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ msg: 'Informe e-mail e senha.' });

    const cliente = await db('cliente').where({ email }).first();
    if (!cliente) return res.status(401).json({ msg: 'Credenciais inválidas.' });

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) return res.status(401).json({ msg: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: cliente.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    
    // O front-end espera receber o "nome" e o "token"
    res.json({ nome: cliente.nome, token });
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao fazer login.' });
  }
});

export default router;
