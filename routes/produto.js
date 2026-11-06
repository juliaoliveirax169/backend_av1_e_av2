import { Router } from 'express';
import db from '../db.js';

const router = Router();
const ITENS_POR_PAGINA = 10;

// GET /produto
router.get('/', async (req, res) => {
  try {
    const { nome, categoria, ordem, preco_min, preco_max, pagina = 1 } = req.query;
    
    let query = db('produto');

    // 1. Filtro por nome
    if (nome) query = query.whereRaw('LOWER(nome) LIKE ?', [`%${nome.toLowerCase()}%`]);
    
    // 2. Filtro por categoria
    if (categoria) query = query.whereRaw('LOWER(categoria) = ?', [categoria.toLowerCase()]);
    
    // 3. Filtro por faixa de preço
    if (preco_min) query = query.where('preco', '>=', Number(preco_min));
    if (preco_max) query = query.where('preco', '<=', Number(preco_max));

    // 4. Ordenação
    if (ordem === 'menor') query = query.orderBy('preco', 'asc');
    else if (ordem === 'maior') query = query.orderBy('preco', 'desc');
    else query = query.orderBy('id', 'asc');

    // Contagem Total
    const totalQuery = query.clone().clearSelect().clearOrder().count('* as total').first();
    const { total } = await totalQuery;

    // 5. Paginação
    const paginaAtual = Math.max(1, parseInt(pagina));
    const offset = (paginaAtual - 1) * ITENS_POR_PAGINA;

    const produtos = await query.limit(ITENS_POR_PAGINA).offset(offset);

    res.json({
      meta: {
        total_encontrados: Number(total),
        pagina_atual: paginaAtual,
        itens_por_pagina: ITENS_POR_PAGINA,
        total_paginas: Math.ceil(Number(total) / ITENS_POR_PAGINA)
      },
      dados: produtos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

export default router;
