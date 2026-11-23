import { Router } from 'express';
import db from '../db.js';
import auth from '../middlewares/auth.js';

const router = Router();

// POST /compras - Cadastrar compra (Protegida)
router.post('/', auth, async (req, res) => {
  // Recebe um array de produtos: [{ produto_id: 1, quantidade: 2 }, ...]
  const { produtos } = req.body; 
  const clienteId = req.clienteId; // Vem do seu middleware auth

  if (!produtos || produtos.length === 0) {
    return res.status(400).json({ msg: 'O carrinho está vazio.' });
  }

  try {
    // Busca os preços atuais dos produtos no banco para evitar fraudes
    const idsProdutos = produtos.map(p => p.produto_id);
    const produtosDB = await db('produto').whereIn('id', idsProdutos);
    
    let valorTotal = 0;
    const itensParaSalvar = [];

    // Valida se todos os produtos existem e calcula o total
    for (const item of produtos) {
      const produtoEncontrado = produtosDB.find(p => p.id === item.produto_id);
      if (!produtoEncontrado) {
        return res.status(404).json({ msg: `Produto ID ${item.produto_id} não encontrado.` });
      }
      
      const precoUnitario = parseFloat(produtoEncontrado.preco);
      valorTotal += precoUnitario * item.quantidade;

      itensParaSalvar.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: precoUnitario
      });
    }

    // 1. Salva a compra principal
    const [compraId] = await db('compras').insert({
      cliente_id: clienteId,
      valor_total: valorTotal
    }).returning('id');

    // 2. Salva os itens da compra
    const itensComIdCompra = itensParaSalvar.map(item => ({
      ...item,
      compra_id: compraId
    }));
    
    await db('itens_compra').insert(itensComIdCompra);

    res.status(201).json({ 
      msg: 'Compra realizada com sucesso!', 
      compra_id: compraId, 
      valor_total: valorTotal 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro interno ao processar a compra.' });
  }
});

// GET /compras - Consultar compras do usuário logado (Protegida)
router.get('/', auth, async (req, res) => {
  const clienteId = req.clienteId;

  try {
    // Busca as compras do cliente
    const compras = await db('compras').where({ cliente_id: clienteId }).orderBy('data_compra', 'desc');
    
    // Para cada compra, busca os itens e os nomes dos produtos
    const comprasCompletas = await Promise.all(compras.map(async (compra) => {
      const itens = await db('itens_compra')
        .join('produto', 'itens_compra.produto_id', 'produto.id')
        .where('itens_compra.compra_id', compra.id)
        .select('produto.nome', 'itens_compra.quantidade', 'itens_compra.preco_unitario');
      
      return { ...compra, itens };
    }));

    res.json(comprasCompletas);
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao buscar histórico de compras.' });
  }
});

export default router;
