// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  Text, 
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

function Home() {
  // Estados para controlar produtos e loading
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega os produtos quando o componente monta
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  // Função para carregar produtos em destaque
  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getFeatured();
      setFeaturedProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Não foi possível carregar os produtos em destaque');
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

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <Spinner size="xl" />
          </Box>
        ) : featuredProducts.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text>Nenhum produto em destaque encontrado.</Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Home;