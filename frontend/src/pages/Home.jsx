// src/pages/Home.jsx
import React from 'react';
import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';

function Home() {
  // Dados mockados para produtos em destaque
  const featuredProducts = [
    {
      id: 1,
      name: "Mouse Gamer RGB",
      price: 199.99,
      image: "/placeholder-product.jpg",
      isNew: true,
      inStock: true
    },
    {
      id: 2,
      name: "Teclado Mecânico",
      price: 299.99,
      image: "/placeholder-product.jpg",
      isNew: false,
      inStock: true
    },
    {
      id: 3,
      name: "Headset 7.1",
      price: 259.99,
      image: "/placeholder-product.jpg",
      isNew: true,
      inStock: true
    },
    {
      id: 4,
      name: "Mousepad XL",
      price: 89.99,
      image: "/placeholder-product.jpg",
      isNew: false,
      inStock: true
    }
  ];

  return (
    <Box>
      {/* Banner Principal */}
      <Box 
        bg="brand.background" 
        h="400px" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        mb={8}
      >
        <Heading color="brand.primary">
          Bem-vindo à GamerShop
        </Heading>
      </Box>

      {/* Produtos em Destaque */}
      <Container maxW="container.xl" py={8}>
        <Heading size="lg" mb={6} color="brand.text">
          Produtos em Destaque
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Home;