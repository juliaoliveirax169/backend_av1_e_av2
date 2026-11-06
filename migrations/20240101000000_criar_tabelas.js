export async function up(knex) {
  await knex.schema.createTable('cliente', (t) => {
    t.increments('id').primary();
    t.string('nome').notNullable();
    t.string('email').notNullable().unique();
    t.string('senha').notNullable();
    t.timestamp('criado_em').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('produto', (t) => {
    t.increments('id').primary();
    t.string('nome').notNullable();
    t.string('categoria').notNullable();
    t.decimal('preco', 10, 2).notNullable();
  });
}

export async function down(knex) {
  await knex.schema.dropTable('cliente');
  await knex.schema.dropTable('produto');
}
