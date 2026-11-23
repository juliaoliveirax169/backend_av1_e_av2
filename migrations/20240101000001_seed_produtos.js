export async function up(knex) {
  const produtos = [
    { 
      nome: 'Smartphone Galaxy S23', 
      categoria: 'smartphone', 
      preco: 3499.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=17QsHFFEABid60sKwXYIyxAX9INhIyqLi' 
    },
    { 
      nome: 'iPhone 15 Pro Max', 
      categoria: 'smartphone', 
      preco: 8999.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1pLTAZ_EQrRbrDyvFn4Vo10-hZLHQdtuP' 
    },
        { 
      nome: 'Headset Gamer HyperX', 
      categoria: 'audio', 
      preco: 450.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1qQ-uskr9sSnOCMeF4qugzsQnGVn-FFXU' 
    },
    { 
      nome: 'Headset Gamer HyperX', 
      categoria: 'audio', 
      preco: 450.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1pLTAZ_EQrRbrDyvFn4Vo10-hZLHQdtuP' // <-- Lembre-se de trocar por um link único se quiser
    },
    { 
      nome: 'Smart TV 55" 4K', 
      categoria: 'tv', 
      preco: 2799.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1f_n9Jmt_SWRvqpf6jumBqznhQtJEpTd' 
    },
    { 
      nome: 'Monitor Ultrawide 29"', 
      categoria: 'monitor', 
      preco: 1250.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1WZzuIUTMSbGT7JdI3_7ky88Z8vy4ikU4' 
    },
    { 
      nome: 'Teclado Mecânico RGB', 
      categoria: 'periferico', 
      preco: 350.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1voLNvM3h577GTRfnyQH_GdVRM7gcmPK1' 
    },
    { 
      nome: 'Mouse Sem Fio Logitech', 
      categoria: 'periferico', 
      preco: 120.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=19sMGEeERSEIabqaCvN9-poCb0-zTZYsI' 
    },
    { 
      nome: 'Câmera DSLR Canon', 
      categoria: 'fotografia', 
      preco: 4200.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1IZ6cYlLQZB0jgPsikiV0FtLfZdqKX55c' 
    },
    { 
      nome: 'Drone DJI Mini 3', 
      categoria: 'fotografia', 
      preco: 3800.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1sdpbFGqhBs6PL5b4G07hhv_xdzMGnY10' 
    },
    { 
      nome: 'Smartwatch Apple Watch', 
      categoria: 'wearable', 
      preco: 2500.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1lWQ0I8YV06yZnKpF8d3v1hx-r4Rm52b' 
    },
    { 
      nome: 'Kindle Paperwhite', 
      categoria: 'e-reader', 
      preco: 650.00, 
      imagem_url: 'https://drive.google.com/uc?export=view&id=1bhnktjAufZh1DJuQsvLVPfSpYHKQ6nRJ' 
    }
  ];

  await knex('produto').insert(produtos);
}

export async function down(knex) {
  await knex('produto').del();
}
