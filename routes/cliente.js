import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import auth from '../middlewares/auth.js';

const router = Router();

// POST /cliente
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });

    const existe = await db('cliente').where({ email }).first();
    if (existe) return res.status(400).json({ error: 'E-mail já cadastrado.' });

    const hash = await bcrypt.hash(senha, Number(process.env.BCRYPT_ROUNDS));
    const [id] = await db('cliente').insert({ nome, email, senha: hash });

    res.status(201).json({ id, nome, email });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
});

// GET /cliente/perfil (Protegida)
router.get('/perfil', auth, async (req, res) => {
  try {
    const cliente = await db('cliente').select('id', 'nome', 'email').where({ id: req.clienteId }).first();
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
});

export default router;
