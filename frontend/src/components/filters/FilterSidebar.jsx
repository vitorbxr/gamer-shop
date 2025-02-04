// src/components/filters/FilterSidebar.jsx
import React from 'react';
import {
  VStack,
  Box,
  Heading,
  Checkbox,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format.js';

const categories = [
  { id: 'mouse', name: 'Mouse' },
  { id: 'keyboard', name: 'Teclado' },
  { id: 'headset', name: 'Headset' },
  { id: 'monitor', name: 'Monitor' },
  { id: 'gpu', name: 'Placa de Vídeo' },
  { id: 'cpu', name: 'Processador' },
  { id: 'ram', name: 'Memória RAM' },
  { id: 'storage', name: 'Armazenamento' }
];

const brands = [
  'Razer',
  'Logitech',
  'Corsair',
  'HyperX',
  'ASUS',
  'AMD',
  'NVIDIA',
  'Intel'
];

function FilterSidebar({
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearFilters,
  maxPrice = 5000
}) {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={onClearFilters}
          >
            Limpar Filtros
          </Button>
        </Box>

        <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
          {/* Categorias */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  Categorias
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <VStack align="start" spacing={2}>
                {categories.map(category => (
                  <Checkbox
                    key={category.id}
                    isChecked={selectedCategories.includes(category.id)}
                    onChange={(e) => onCategoryChange(category.id, e.target.checked)}
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Marcas */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  Marcas
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <VStack align="start" spacing={2}>
                {brands.map(brand => (
                  <Checkbox
                    key={brand}
                    isChecked={selectedBrands.includes(brand)}
                    onChange={(e) => onBrandChange(brand, e.target.checked)}
                  >
                    {brand}
                  </Checkbox>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Faixa de Preço */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  Faixa de Preço
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <VStack align="stretch" spacing={4}>
                <RangeSlider
                  defaultValue={priceRange}
                  min={0}
                  max={maxPrice}
                  step={100}
                  onChange={onPriceChange}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text>
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
}

export default FilterSidebar;