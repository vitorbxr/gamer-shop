// src/pages/Home.jsx
import React from 'react';
import { Box, Container, Heading, SimpleGrid, Image, Text } from '@chakra-ui/react';

function Home() {
  // Dados mockados para banner e produtos em destaque
  const featuredProducts = [
    {
      id: 1,
      name: "Mouse Gamer RGB",
      price: "R$ 199,99",
      image: "/placeholder-product.jpg"
    },
    {
      id: 2,
      name: "Teclado Mecânico",
      price: "R$ 299,99",
      image: "/placeholder-product.jpg"
    },
    {
      id: 3,
      name: "Headset 7.1",
      price: "R$ 259,99",
      image: "/placeholder-product.jpg"
    },
    {
      id: 4,
      name: "Mousepad XL",
      price: "R$ 89,99",
      image: "/placeholder-product.jpg"
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
            <Box 
              key={product.id}
              bg="brand.card"
              p={4}
              borderRadius="lg"
              _hover={{
                transform: 'translateY(-5px)',
                transition: 'all 0.2s'
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                borderRadius="md"
                mb={4}
                fallbackSrc="https://via.placeholder.com/300x300"
              />
              <Text fontWeight="bold" color="brand.text">{product.name}</Text>
              <Text color="brand.primary">{product.price}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Home;