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
  Stack,
  Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import { productService } from '../services/productService';
import { getImageUrl } from '../utils/imageUrl';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const toast = useToast();
  const limit = 12;

  // Carregar produtos iniciais e filtros
  useEffect(() => {
    loadFilters();
    loadProducts();
  }, []);

  // Recarregar produtos quando os filtros mudarem
  useEffect(() => {
    loadProducts();
  }, [selectedCategories, selectedBrands, priceRange, sortBy, currentPage, searchTerm]);

  // Função para carregar categorias e marcas
  const loadFilters = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        productService.getCategories(),
        productService.getBrands()
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Erro ao carregar filtros:', error);
      toast({
        title: 'Erro ao carregar filtros',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Função para carregar produtos com filtros atuais
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      
      // Preparar parâmetros de filtro
      const params = {
        search: searchTerm,
        sort: sortBy,
      };
      
      // Adicionar filtros de categoria
      if (selectedCategories.length > 0) {
        params.category = selectedCategories.join(',');
      }
      
      // Adicionar filtros de marca
      if (selectedBrands.length > 0) {
        params.brand = selectedBrands.join(',');
      }
      
      // Adicionar filtros de preço
      if (priceRange[0] > 0 || priceRange[1] < 5000) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }
      
      console.log('Buscando produtos com parâmetros:', params);
      
      const data = await productService.getAll(currentPage, limit, params);
      
      const productsWithUrls = data.products.map(product => ({
        ...product,
        image: getImageUrl(product.image)
      }));
      
      setProducts(productsWithUrls);
      setTotalProducts(data.pagination.total);
      setTotalPages(data.pagination.pages);
      
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro ao carregar produtos',
        description: error.response?.data?.error || 'Falha ao buscar produtos',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para o campo de busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler para o formulário de busca
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset para a primeira página ao buscar
  };

  // Handler para o botão de busca
  const handleSearchClick = () => {
    setCurrentPage(1); // Reset para a primeira página ao buscar
  };

  // Handler para mudança de categoria
  const handleCategoryChange = (categoryId, isChecked) => {
    setSelectedCategories(prev => {
      if (isChecked) {
        return [...prev, categoryId];
      } else {
        return prev.filter(id => id !== categoryId);
      }
    });
    setCurrentPage(1); // Reset para a primeira página ao filtrar
  };

  // Handler para mudança de marca
  const handleBrandChange = (brandId, isChecked) => {
    setSelectedBrands(prev => {
      if (isChecked) {
        return [...prev, brandId];
      } else {
        return prev.filter(id => id !== brandId);
      }
    });
    setCurrentPage(1); // Reset para a primeira página ao filtrar
  };

  // Handler para mudança de preço
  const handlePriceChange = (range) => {
    setPriceRange(range);
    setCurrentPage(1); // Reset para a primeira página ao filtrar
  };

  // Handler para ordenação
  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset para a primeira página ao ordenar
  };

  // Handler para mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handler para limpar todos os filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    setSortBy('');
    setCurrentPage(1);
  };

  // Verificar se algum filtro está ativo
  const isFilterActive = selectedCategories.length > 0 || 
                        selectedBrands.length > 0 || 
                        priceRange[0] > 0 || 
                        priceRange[1] < 5000 ||
                        searchTerm !== '';

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
        <FilterSidebar
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />

        <Box>
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
              <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
                <InputGroup>
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Buscar"
                      icon={<SearchIcon />}
                      onClick={handleSearchClick}
                    />
                  </InputRightElement>
                </InputGroup>
              </form>

              <Select
                width="200px"
                value={sortBy}
                onChange={handleSort}
              >
                <option value="">Ordenar por</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome</option>
              </Select>
            </HStack>

            <HStack justify="space-between">
              <Text>
                {totalProducts} produtos encontrados
                {searchTerm && ` para "${searchTerm}"`}
              </Text>
              
              {isFilterActive && (
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  variant="outline" 
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </HStack>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <Spinner size="xl" />
              </Box>
            ) : (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </SimpleGrid>

                {totalPages > 1 && (
                  <Stack direction="row" spacing={2} justify="center" mt={6}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <IconButton
                        key={i + 1}
                        aria-label={`Page ${i + 1}`}
                        onClick={() => handlePageChange(i + 1)}
                        colorScheme={currentPage === i + 1 ? "blue" : "gray"}
                      >
                        {i + 1}
                      </IconButton>
                    ))}
                  </Stack>
                )}
              </>
            )}

            {!isLoading && products.length === 0 && (
              <Box textAlign="center" py={8}>
                <Text>Nenhum produto encontrado com os filtros selecionados.</Text>
                <Button 
                  mt={4} 
                  colorScheme="blue" 
                  onClick={handleClearFilters}
                >
                  Limpar Filtros
                </Button>
              </Box>
            )}
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
}

export default ProductList;