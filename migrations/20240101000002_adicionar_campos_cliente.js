export async function up(knex) {
  await knex.schema.alterTable('cliente', (t) => {
    t.string('cpf').notNullable().defaultTo('');
    t.string('celular').notNullable().defaultTo('');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('cliente', (t) => {
    t.dropColumn('cpf');
    t.dropColumn('celular');
  });
}
