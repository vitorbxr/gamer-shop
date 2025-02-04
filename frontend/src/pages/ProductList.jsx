// src/pages/ProductList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/filters/FilterSidebar';

// Dados mockados para teste
const mockProducts = [
  {
    id: 1,
    name: "Mouse Gamer RGB Pro",
    price: 299.99,
    category: "mouse",
    brand: "Razer",
    image: "/placeholder-image.jpg",
    isNew: true,
    inStock: true
  },
  {
    id: 2,
    name: "Teclado Mecânico RGB",
    price: 499.99,
    category: "keyboard",
    brand: "Corsair",
    image: "/placeholder-image.jpg",
    isNew: false,
    inStock: true
  },
  // Adicione mais produtos mockados aqui
];

function ProductList() {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('');

  const toast = useToast();

  // Aplica todos os filtros
  useEffect(() => {
    let result = [...products];

    // Filtro de busca
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de categorias
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Filtro de marcas
    if (selectedBrands.length > 0) {
      result = result.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Filtro de preço
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Ordenação
    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // A busca já está sendo aplicada pelo useEffect
  };

  const handleCategoryChange = (categoryId, isChecked) => {
    setSelectedCategories(prev =>
      isChecked
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  };

  const handleBrandChange = (brand, isChecked) => {
    setSelectedBrands(prev =>
      isChecked
        ? [...prev, brand]
        : prev.filter(b => b !== brand)
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    setSortBy('');

    toast({
      title: "Filtros limpos",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
        {/* Filtros */}
        <FilterSidebar
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onPriceChange={setPriceRange}
          onClearFilters={handleClearFilters}
        />

        {/* Lista de Produtos */}
        <Box>
          <VStack spacing={6} align="stretch">
            {/* Barra de Busca e Ordenação */}
            <HStack spacing={4}>
              <form onSubmit={handleSearch} style={{ flex: 1 }}>
                <InputGroup>
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Buscar"
                      icon={<SearchIcon />}
                      type="submit"
                    />
                  </InputRightElement>
                </InputGroup>
              </form>

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

            {/* Resultados */}
            <Text>
              {filteredProducts.length} produtos encontrados
            </Text>

            {/* Grid de Produtos */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </SimpleGrid>

            {filteredProducts.length === 0 && (
              <Box textAlign="center" py={8}>
                <Text>Nenhum produto encontrado com os filtros selecionados.</Text>
              </Box>
            )}
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
}

export default ProductList;