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

function ProductCard({ product }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
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
      <Link to={`/product/${product.id}`}>
        <Image
          src={product.image}
          alt={product.name}
          height="200px"
          width="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/300x200"
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

            <Text fontSize="xl" fontWeight="bold" color="brand.primary">
              R$ {product.price.toFixed(2)}
            </Text>

            <Button
              width="full"
              colorScheme="blue"
              isDisabled={!product.inStock}
            >
              Adicionar ao Carrinho
            </Button>
          </VStack>
        </Box>
      </Link>
    </Box>
  );
}

export default ProductCard;