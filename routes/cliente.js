import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import auth from '../middlewares/auth.js';

const router = Router();

// POST /cliente
router.post('/', async (req, res) => {
  try {
    const { nome, cpf, celular, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });

    const existe = await db('cliente').where({ email }).first();
    if (existe) return res.status(400).json({ msg: 'E-mail já cadastrado.' });

    const hash = await bcrypt.hash(senha, Number(process.env.BCRYPT_ROUNDS));
    const [id] = await db('cliente').insert({ nome, cpf, celular, email, senha: hash });

    res.status(201).json({ id, nome, email });
  } catch (error) {
    res.status(500).json({ msg: 'Erro interno ao cadastrar.' });
  }
});

// GET /cliente/perfil (Protegida)
router.get('/perfil', auth, async (req, res) => {
  try {
    const cliente = await db('cliente').select('id', 'nome', 'cpf', 'celular', 'email').where({ id: req.clienteId }).first();
    if (!cliente) return res.status(404).json({ msg: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao buscar perfil.' });
  }
});

export default router;
