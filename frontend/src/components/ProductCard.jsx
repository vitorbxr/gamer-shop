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
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';

function ProductCard({ product }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log('Add to cart clicked');
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        borderColor={borderColor}
        bg={cardBg}
        transition="transform 0.2s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg'
        }}
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
              color={textColor}
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
    </Link>
  );
}

export default ProductCard;