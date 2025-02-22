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
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format.js';
import { useAuth } from '../contexts/AuthContext';

function Wishlist() {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast({
        title: "Produto adicionado ao carrinho",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

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
        
        {!isAuthenticated && (
          <Alert status="info" mb={4}>
            <AlertIcon />
            Seus favoritos são temporários. Para salvar permanentemente, faça login.
          </Alert>
        )}

        <Grid gap={6}>
          {wishlist.map((product) => (
            <Box
              key={product.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              shadow="sm"
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
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
                  fallback={
                    <Box 
                      boxSize="150px" 
                      bg="gray.200" 
                      borderRadius="md" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                    >
                      <Text color="gray.500">Imagem indisponível</Text>
                    </Box>
                  }
                />

                <VStack align="start" spacing={2}>
                  <Link to={`/product/${product.id}`}>
                    <Heading size="md" _hover={{ color: 'blue.500' }}>{product.name}</Heading>
                  </Link>
                  <Text fontSize="xl" fontWeight="bold" color="green.500">
                    {formatPrice(product.price)}
                  </Text>
                  {product.stock > 0 ? (
                    <Text color="green.500">Em estoque ({product.stock} unidades)</Text>
                  ) : (
                    <Text color="red.500">Fora de estoque</Text>
                  )}
                </VStack>

                <VStack spacing={4}>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remover dos favoritos"
                  />
                  <Button
                    colorScheme="green"
                    isDisabled={!product.stock || product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                    width="full"
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