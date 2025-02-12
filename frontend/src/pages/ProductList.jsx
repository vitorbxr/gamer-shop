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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import { productService } from '../services/productService';
import { cacheService } from '../services/cacheService';
import { getImageUrl } from '../utils/imageUrl';

const getCacheKey = (filters) => {
  return `gamerShop:products:${JSON.stringify(filters)}`;
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 5000,
    sort: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1
  });

  const toast = useToast();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const cacheKey = getCacheKey(filters);
      const cachedData = cacheService.get(cacheKey);

      if (cachedData) {
        const productsWithUrls = cachedData.products.map(product => ({
          ...product,
          image: getImageUrl(product.image)
        }));
        setProducts(productsWithUrls);
        setPagination(cachedData.pagination);
        return;
      }

      const data = await productService.getAll(
        filters.page,
        filters.limit,
        {
          search: filters.search,
          category: filters.categories.length ? filters.categories.join(',') : undefined,
          brand: filters.brands.length ? filters.brands.join(',') : undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort
        }
      );

      const productsWithFullUrls = data.products.map(product => ({
        ...product,
        image: getImageUrl(product.image)
      }));
      
      setProducts(productsWithFullUrls);
      setPagination(data.pagination);
      cacheService.set(cacheKey, {
        ...data,
        products: productsWithFullUrls,
        pagination: data.pagination
      });
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

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (categoryId, isChecked) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      categories: isChecked 
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId)
    }));
  };

  const handleBrandChange = (brandId, isChecked) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      brands: isChecked
        ? [...prev.brands, brandId]
        : prev.brands.filter(id => id !== brandId)
    }));
  };

  const handlePriceChange = (range) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      minPrice: range[0],
      maxPrice: range[1]
    }));
  };

  const handleSort = (value) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      sort: value
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 5000,
      sort: ''
    });
    cacheService.clear();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
        <FilterSidebar
          selectedCategories={filters.categories}
          selectedBrands={filters.brands}
          priceRange={[filters.minPrice, filters.maxPrice]}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />

        <Box>
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
              <form onSubmit={handleSearch} style={{ flex: 1 }}>
                <InputGroup>
                  <Input
                    placeholder="Buscar produtos..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
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
                value={filters.sort}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Ordenar por</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome</option>
              </Select>
            </HStack>

            <Text>
              {pagination.total} produtos encontrados
            </Text>

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

                {pagination.pages > 1 && (
                  <Stack direction="row" spacing={2} justify="center" mt={6}>
                    {Array.from({ length: pagination.pages }, (_, i) => (
                      <IconButton
                        key={i + 1}
                        aria-label={`Page ${i + 1}`}
                        onClick={() => handlePageChange(i + 1)}
                        colorScheme={pagination.currentPage === i + 1 ? "blue" : "gray"}
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
              </Box>
            )}
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
}

export default ProductList;