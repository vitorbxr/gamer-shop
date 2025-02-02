// src/pages/ProductList.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  VStack,
  Heading,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Container,
  SimpleGrid,
  Select,
  HStack
} from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';

function ProductList() {
  // Dados mockados para teste
  const mockProducts = [
    {
      id: 1,
      name: "Mouse Gamer RGB PRO",
      price: 299.99,
      image: "/placeholder-product.jpg",
      isNew: true,
      inStock: true,
      category: "mouse"
    },
    {
      id: 2,
      name: "Teclado Mecânico RGB",
      price: 499.99,
      image: "/placeholder-product.jpg",
      isNew: false,
      inStock: true,
      category: "teclado"
    },
    {
      id: 3,
      name: "Headset Gamer 7.1",
      price: 399.99,
      image: "/placeholder-product.jpg",
      isNew: true,
      inStock: false,
      category: "audio"
    },
    {
      id: 4,
      name: "Mouse Pad XL RGB",
      price: 159.99,
      image: "/placeholder-product.jpg",
      isNew: false,
      inStock: true,
      category: "acessorios"
    }
  ];

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
        {/* Filtros */}
        <VStack align="stretch" spacing={6}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Filtros</Heading>
            
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text mb={2}>Categorias</Text>
                <VStack align="start">
                  <Checkbox>Mouse</Checkbox>
                  <Checkbox>Teclado</Checkbox>
                  <Checkbox>Headset</Checkbox>
                  <Checkbox>Acessórios</Checkbox>
                </VStack>
              </Box>

              <Box>
                <Text mb={2}>Preço</Text>
                <RangeSlider
                  defaultValue={[0, 1000]}
                  min={0}
                  max={1000}
                  step={50}
                  onChange={setPriceRange}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text mt={2}>
                  R$ {priceRange[0]} - R$ {priceRange[1]}
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>

        {/* Lista de Produtos */}
        <Box>
          <HStack justify="space-between" mb={6}>
            <Heading size="lg">Produtos</Heading>
            <Select 
              width="200px" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome</option>
            </Select>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {mockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </Box>
      </Grid>
    </Container>
  );
}

export default ProductList;