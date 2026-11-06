import 'dotenv/config';
import express from 'express';
import db from './db.js';

import clienteRoutes from './routes/cliente.js';
import loginRoutes from './routes/login.js';
import produtoRoutes from './routes/produto.js';

const app = express();
app.use(express.json());

app.use('/cliente', clienteRoutes);
app.use('/login', loginRoutes);
app.use('/produto', produtoRoutes);

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    console.log('Verificando banco de dados e executando migrations...');
    await db.migrate.latest(); // Executa a migration automaticamente (Exigência AV1)
    
    app.listen(PORT, () => {
      console.log(`🚀 API rodando na porta ${PORT}`);
      console.log(`Rotas AV1: POST /cliente | POST /login | GET /cliente/perfil`);
      console.log(`Rota AV2: GET /produto`);
    });
  } catch (error) {
    console.error('Erro crítico ao iniciar a API:', error);
    process.exit(1);
  }
}

iniciar();



//Para a AV1 (Autenticação):

//POST http://localhost:3000/cliente
//Body (JSON): { "nome": "Patrick", "email": "patrick@email.com", "senha": "123" }

//POST http://localhost:3000/login
//Body (JSON): { "email": "patrick@email.com", "senha": "123" }
//(Copie o token que ele gerar)

//GET http://localhost:3000/cliente/perfil
//Vá em Auth -> Bearer Token e cole o token.

//Para a AV2 (Filtros da Loja):

//Buscar por nome: GET http://localhost:3000/produto?nome=smart

//Filtrar categoria: GET http://localhost:3000/produto?categoria=audio

//Preço entre 500 e 3000, do mais barato: GET http://localhost:3000/produto?preco_min=500&preco_max=3000&ordem=menor

//Paginação: GET http://localhost:3000/produto?pagina=2