// src/pages/Wishlist.jsx
import React from 'react';
import {
  Container,
  VStack,
  Grid,
  Heading,
  Box,
  Image,
  Text,
  Button,
  HStack,
  Icon,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format.js';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const toast = useToast();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast({
      title: "Produto adicionado ao carrinho",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  if (wishlist.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Lista de Desejos</Heading>
          <Alert status="info">
            <AlertIcon />
            Sua lista de desejos está vazia.
          </Alert>
          <Link to="/products">
            <Button colorScheme="blue">
              Explorar Produtos
            </Button>
          </Link>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Lista de Desejos</Heading>

        <Grid gap={6}>
          {wishlist.map((product) => (
            <Box
              key={product.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
            >
              <Grid
                templateColumns={{ base: "1fr", sm: "150px 1fr auto" }}
                gap={4}
                alignItems="center"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  borderRadius="md"
                  objectFit="cover"
                  boxSize="150px"
                />

                <VStack align="start" spacing={2}>
                  <Link to={`/product/${product.id}`}>
                    <Heading size="md">{product.name}</Heading>
                  </Link>
                  <Text fontSize="xl" fontWeight="bold" color="brand.primary">
                    {formatPrice(product.price)}
                  </Text>
                  {product.inStock ? (
                    <Text color="green.500">Em estoque</Text>
                  ) : (
                    <Text color="red.500">Fora de estoque</Text>
                  )}
                </VStack>

                <VStack spacing={4}>
                  <Button
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remover
                  </Button>
                  <Button
                    colorScheme="blue"
                    isDisabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </VStack>
              </Grid>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Container>
  );
}

export default Wishlist;