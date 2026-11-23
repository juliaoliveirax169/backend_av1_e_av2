exports.up = async function(knex) {
  // Tabela de Compras (Pedido principal)
  await knex.schema.createTable('compras', (t) => {
    t.increments('id').primary();
    t.integer('cliente_id').unsigned().notNullable()
      .references('id').inTable('cliente').onDelete('CASCADE');
    t.decimal('valor_total', 10, 2).notNullable();
    t.timestamp('data_compra').defaultTo(knex.fn.now());
  });

  // Tabela de Itens da Compra (Produtos comprados)
  await knex.schema.createTable('itens_compra', (t) => {
    t.increments('id').primary();
    t.integer('compra_id').unsigned().notNullable()
      .references('id').inTable('compras').onDelete('CASCADE');
    t.integer('produto_id').unsigned().notNullable()
      .references('id').inTable('produto');
    t.integer('quantidade').notNullable();
    t.decimal('preco_unitario', 10, 2).notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('itens_compra');
  await knex.schema.dropTable('compras');
};
