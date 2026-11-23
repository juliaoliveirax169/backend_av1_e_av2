export async function up(knex) {
  const produtos = [
    { nome: 'Smartphone Galaxy S23', 
     categoria: 'smartphone', 
     preco: 3499.00 ,
      imagem_url: 'https://drive.google.com/file/d/17QsHFFEABid60sKWXIyxAX9INhIyqLiq/view?usp=sharing'
    },
    { nome: 'iPhone 15 Pro Max', 
     categoria: 'smartphone', 
     preco: 8999.00 ,
     imagem_url: 'https://drive.google.com/file/d/1pLTAZ_ECqRbrDyvFn4Vo10-hZLHQdtuP/view?usp=sharing'
    },
    { nome: 'Fone Bluetooth JBL',
     categoria: 'audio',
     preco: 299.90 ,
     imagem_url: 'https://drive.google.com/file/d/1k4oESlqGMw1nT7T5DnjFvq1qrVjekVWj/view?usp=sharing'
    },
    { nome: 'Headset Gamer HyperX', 
     categoria: 'audio', 
     preco: 450.00 ,
     imagem_url: 'https://drive.google.com/file/d/1pLTAZ_ECqRbrDyvFn4Vo10-hZLHQdtuP/view?usp=sharing'
    },
    { nome: 'Smart TV 55" 4K',
     categoria: 'tv',
     preco: 2799.00 ,
     imagem_url: 'https://drive.google.com/file/d/1f_n9Jmt_SHVRqpGfj6umBqznhQtJEpTd/view?usp=sharing'
    },
    { nome: 'Monitor Ultrawide 29"',
     categoria: 'monitor',
     preco: 1250.00 ,
     imagem_url: 'https://drive.google.com/file/d/1WVzuiUTMSbGT7Jdl3_7ky88Z8vy4lkU4/view?usp=sharing'
    },
    { nome: 'Teclado Mecânico RGB',
     categoria: 'periferico',
     preco: 350.00 , 
     imagem_url: 'https://drive.google.com/file/d/1vOLnMV3h577GTRfnyQH_GdVRM7gcmPkl/view?usp=sharing'
    },
    { nome: 'Mouse Sem Fio Logitech',
     categoria: 'periferico', 
     preco: 120.00 ,
     imagem_url: 'https://drive.google.com/file/d/19sMGEeERSElabqaCvN9-poCbO-zTZYsI/view?usp=sharing'
    },
    { nome: 'Câmera DSLR Canon', 
     categoria: 'fotografia', 
     preco: 4200.00 ,
     imagem_url: 'https://drive.google.com/file/d/1IZ6cYlLQZBOjGpsikiV0FtLfZdgKX55c/view?usp=sharing'
    },
    { nome: 'Drone DJI Mini 3',
     categoria: 'fotografia',
     preco: 3800.00 ,
     imagem_url: 'https://drive.google.com/file/d/1sdpbFGghBs6PL5b4G07hhv_xdzMGnY1O/view?usp=sharing'
    },
    { nome: 'Smartwatch Apple Watch',
     categoria: 'wearable', 
     preco: 2500.00 ,
     imagem_url: 'https://drive.google.com/file/d/11WQG0I8YV06yZnKpF8d3vlhX-r4Rm52b/view?usp=sharing'
    },
    { nome: 'Kindle Paperwhite', 
     categoria: 'e-reader', 
     preco: 650.00 ,
     imagem_url: 'https://drive.google.com/file/d/1bhntkjAufZhlDJuQsvLVPfSpYHKQ6nRJ/view?usp=sharing'
    },
  ];

  await knex('produto').insert(produtos);
}

export async function down(knex) {
  await knex('produto').del();
}
