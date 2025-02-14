import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.shipping.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Teclados' } }),
    prisma.category.create({ data: { name: 'Mouses' } }),
    prisma.category.create({ data: { name: 'Headsets' } }),
    prisma.category.create({ data: { name: 'Monitores' } }),
    prisma.category.create({ data: { name: 'Cadeiras Gaming' } }),
    prisma.category.create({ data: { name: 'Controlos' } }),
    prisma.category.create({ data: { name: 'Streaming' } }),
    prisma.category.create({ data: { name: 'Componentes PC' } })
  ]);

  // Criar marcas
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Razer' } }),
    prisma.brand.create({ data: { name: 'Logitech' } }),
    prisma.brand.create({ data: { name: 'Corsair' } }),
    prisma.brand.create({ data: { name: 'SteelSeries' } }),
    prisma.brand.create({ data: { name: 'HyperX' } }),
    prisma.brand.create({ data: { name: 'ASUS' } }),
    prisma.brand.create({ data: { name: 'MSI' } }),
    prisma.brand.create({ data: { name: 'Trust Gaming' } })
  ]);

  // Criar produtos
  const products = [
    {
      name: 'Teclado Mecânico RGB Pro',
      description: 'Teclado mecânico profissional com switches Cherry MX Red e iluminação RGB personalizável',
      price: 149.99,
      stock: 50,
      isActive: true,
      image: '/images/products/teclado-mecanico.jpg',
      specifications: JSON.stringify({
        switches: 'Cherry MX Red',
        layout: 'PT-PT',
        conexao: 'USB-C destacável',
        retroiluminacao: 'RGB 16.8M cores'
      }),
      features: JSON.stringify([
        'Switches Cherry MX Red',
        'Layout Português',
        'Iluminação RGB personalizável',
        'Estrutura em alumínio',
        'Apoio de pulso destacável'
      ]),
      categoryId: categories[0].id,
      brandId: brands[0].id
    },
    {
      name: 'Mouse Gaming Ultra Precision',
      description: 'Mouse gaming de alta precisão com sensor óptico avançado e design ergonômico',
      price: 79.99,
      stock: 75,
      isActive: true,
      image: '/images/products/mouse-gaming.jpg',
      specifications: JSON.stringify({
        sensor: 'Óptico 16000 DPI',
        botoes: '6 programáveis',
        peso: '95g ajustável',
        conexao: 'USB / Wireless'
      }),
      features: JSON.stringify([
        'Sensor óptico de alta precisão',
        'DPI ajustável até 16000',
        'RGB personalizável',
        'Bateria de longa duração',
        'Design ergonômico'
      ]),
      categoryId: categories[1].id,
      brandId: brands[1].id
    },
    {
      name: 'Headset 7.1 Pro Gaming',
      description: 'Headset profissional com som surround 7.1 e microfone destacável',
      price: 129.99,
      stock: 30,
      isActive: true,
      image: '/images/products/headset-gaming.jpg',
      specifications: JSON.stringify({
        audio: 'Surround 7.1',
        drivers: '50mm com neodímio',
        microfone: 'Destacável com cancelamento de ruído',
        conexao: 'USB / 3.5mm'
      }),
      features: JSON.stringify([
        'Som surround 7.1',
        'Microfone destacável',
        'Almofadas memory foam',
        'Controles no cabo',
        'Compatível com PC/PS5/Xbox'
      ]),
      categoryId: categories[2].id,
      brandId: brands[2].id
    },
    {
      name: 'Monitor Gaming 165Hz IPS',
      description: 'Monitor gaming IPS de 27" com 165Hz e tempo de resposta de 1ms',
      price: 349.99,
      stock: 20,
      isActive: true,
      image: '/images/products/monitor-gaming.jpg',
      specifications: JSON.stringify({
        painel: 'IPS',
        tamanho: '27 polegadas',
        resolucao: '2560x1440',
        refreshRate: '165Hz',
        tempoResposta: '1ms'
      }),
      features: JSON.stringify([
        'Painel IPS QHD',
        'Taxa de atualização 165Hz',
        'Tempo de resposta 1ms',
        'AMD FreeSync Premium',
        'Ajuste de altura e rotação'
      ]),
      categoryId: categories[3].id,
      brandId: brands[5].id
    },
    {
      name: 'Cadeira Gaming Ergonômica',
      description: 'Cadeira gaming profissional com suporte lombar ajustável e apoio 4D',
      price: 299.99,
      stock: 15,
      isActive: true,
      image: '/images/products/cadeira-gaming.jpg',
      specifications: JSON.stringify({
        material: 'Couro sintético premium',
        estrutura: 'Aço reforçado',
        peso: 'Suporta até 150kg',
        ajustes: 'Braços 4D, altura e reclinação'
      }),
      features: JSON.stringify([
        'Suporte lombar ajustável',
        'Braços 4D',
        'Reclinação até 180°',
        'Almofadas inclusas',
        'Base em alumínio'
      ]),
      categoryId: categories[4].id,
      brandId: brands[6].id
    },
    {
      name: 'Webcam Streaming 4K',
      description: 'Webcam profissional 4K com microfone duplo e correção de luz',
      price: 199.99,
      stock: 25,
      isActive: true,
      image: '/images/products/webcam-4k.jpg',
      specifications: JSON.stringify({
        resolucao: '4K Ultra HD',
        fps: '60fps em 1080p',
        microfone: 'Duplo com cancelamento de ruído',
        conexao: 'USB 3.0'
      }),
      features: JSON.stringify([
        'Resolução 4K',
        'Microfone duplo',
        'Correção automática de luz',
        'Campo de visão ajustável',
        'Clipe universal incluído'
      ]),
      categoryId: categories[6].id,
      brandId: brands[1].id
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: '$2b$10$s4XxOc6r9R6nXnJ5JidqPe5VJ9cX8PSot2QaQEX9bwbO8hAr6Zyta', // admin123
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  console.log('Dados iniciais criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });