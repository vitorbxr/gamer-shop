// src/pages/ProductList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  SimpleGrid,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  HStack,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import { productService } from '../services/productService';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('');

  const toast = useToast();
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.response?.data?.error || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];

    // Aplicar busca
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar filtros de categoria
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Aplicar filtros de marca
    if (selectedBrands.length > 0) {
      result = result.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Aplicar filtro de preço
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Aplicar ordenação
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

            {/* Contador de Resultados */}
            <Text>
              {filteredProducts.length} produtos encontrados
            </Text>

            {/* Grid de Produtos */}
            {isLoading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <Spinner size="xl" />
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>
            )}

            {!isLoading && filteredProducts.length === 0 && (
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