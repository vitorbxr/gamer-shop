// src/components/ProductCard.jsx
import React from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../contexts/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Previne a navegação
    addToCart(product, 1);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor="gray.200"
      bg="white"
      transition="transform 0.2s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg'
      }}
      onClick={handleClick}
      cursor="pointer"
    >
      <Image
        src={product.image}
        alt={product.name}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p="6">
        <HStack spacing={2} mb={2}>
          {product.isNew && (
            <Badge colorScheme="green">Novo</Badge>
          )}
          {product.inStock ? (
            <Badge colorScheme="blue">Em Estoque</Badge>
          ) : (
            <Badge colorScheme="red">Fora de Estoque</Badge>
          )}
        </HStack>

        <VStack align="start" spacing={2}>
          <Text
            fontWeight="semibold"
            fontSize="lg"
            lineHeight="tight"
            isTruncated
          >
            {product.name}
          </Text>

          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color="brand.primary"
          >
            {formatPrice(product.price)}
          </Text>

          <Button
            width="full"
            colorScheme="blue"
            isDisabled={!product.inStock}
            onClick={handleAddToCart}
          >
            Adicionar ao Carrinho
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default ProductCard;