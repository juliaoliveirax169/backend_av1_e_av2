export async function up(knex) {
  const produtos = [
    { nome: 'Smartphone Galaxy S23', categoria: 'smartphone', preco: 3499.00 },
    { nome: 'iPhone 15 Pro Max', categoria: 'smartphone', preco: 8999.00 },
    { nome: 'Fone Bluetooth JBL', categoria: 'audio', preco: 299.90 },
    { nome: 'Headset Gamer HyperX', categoria: 'audio', preco: 450.00 },
    { nome: 'Smart TV 55" 4K', categoria: 'tv', preco: 2799.00 },
    { nome: 'Monitor Ultrawide 29"', categoria: 'monitor', preco: 1250.00 },
    { nome: 'Teclado Mecânico RGB', categoria: 'periferico', preco: 350.00 },
    { nome: 'Mouse Sem Fio Logitech', categoria: 'periferico', preco: 120.00 },
    { nome: 'Câmera DSLR Canon', categoria: 'fotografia', preco: 4200.00 },
    { nome: 'Drone DJI Mini 3', categoria: 'fotografia', preco: 3800.00 },
    { nome: 'Smartwatch Apple Watch', categoria: 'wearable', preco: 2500.00 },
    { nome: 'Kindle Paperwhite', categoria: 'e-reader', preco: 650.00 },
  ];

  await knex('produto').insert(produtos);
}

export async function down(knex) {
  await knex('produto').del();
}
