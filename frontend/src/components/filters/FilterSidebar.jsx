// frontend/src/components/filters/FilterSidebar.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Button,
} from '@chakra-ui/react';
import { productService } from '../../services/productService';

function FilterSidebar({ 
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearFilters
}) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadFilters();
  }, []);

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
    }
  };

  return (
    <Box w="100%">
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="sm" mb={4}>Categorias</Heading>
          <VStack align="stretch">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                isChecked={selectedCategories.includes(category.id)}
                onChange={(e) => onCategoryChange(category.id, e.target.checked)}
              >
                {category.name}
              </Checkbox>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>Marcas</Heading>
          <VStack align="stretch">
            {brands.map((brand) => (
              <Checkbox
                key={brand.id}
                isChecked={selectedBrands.includes(brand.id)}
                onChange={(e) => onBrandChange(brand.id, e.target.checked)}
              >
                {brand.name}
              </Checkbox>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={4}>Preço</Heading>
          <RangeSlider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onChange={onPriceChange}
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

        <Button onClick={onClearFilters} variant="outline">
          Limpar Filtros
        </Button>
      </VStack>
    </Box>
  );
}

export default FilterSidebar;