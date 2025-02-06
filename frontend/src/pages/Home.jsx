// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid, Text, Spinner } from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getFeatured();
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <Spinner size="xl" />
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default Home;