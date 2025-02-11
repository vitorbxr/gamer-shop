// src/pages/Cart.jsx
import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Divider,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format.js';

function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    getCartTotal 
  } = useCart();
  
  const navigate = useNavigate();
  const toast = useToast();

  const shipping = cartItems.length > 0 ? 25.00 : 0;
  const subtotal = getCartTotal();
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Carrinho de Compras</Heading>
          <Alert status="info">
            <AlertIcon />
            Seu carrinho está vazio
          </Alert>
          <Link to="/products">
            <Button colorScheme="blue">
              Continuar Comprando
            </Button>
          </Link>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Carrinho de Compras</Heading>

        {/* Lista de Produtos */}
        <Box>
          {cartItems.map((item) => (
            <Box
              key={item.id}
              p={4}
              mb={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
            >
              <HStack spacing={4} align="start">
                <Image
                  src={item.images?.[0] || "/placeholder-image.jpg"}
                  alt={item.name}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                
                <VStack align="start" flex={1} spacing={1}>
                  <Link to={`/product/${item.id}`}>
                    <Text fontWeight="bold" fontSize="lg">
                      {item.name}
                    </Text>
                  </Link>
                  <Text color="brand.primary" fontWeight="bold">
                    {formatPrice(item.price)}
                  </Text>
                </VStack>

                <VStack align="end" spacing={2}>
                  <HStack>
                    <IconButton
                      icon={<MinusIcon />}
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      isDisabled={item.quantity <= 1}
                    />
                    <Text fontWeight="bold" w="40px" textAlign="center">
                      {item.quantity}
                    </Text>
                    <IconButton
                      icon={<AddIcon />}
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                    />
                  </HStack>
                  <Text fontWeight="bold">
                    Total: {formatPrice(item.price * item.quantity)}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </Box>

        {/* Resumo do Pedido */}
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md">Resumo do Pedido</Heading>
            
            <HStack justify="space-between">
              <Text>Subtotal</Text>
              <Text>{formatPrice(subtotal)}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text>Frete</Text>
              <Text>{formatPrice(shipping)}</Text>
            </HStack>

            <Divider />
            
            <HStack justify="space-between" fontWeight="bold">
              <Text>Total</Text>
              <Text fontSize="xl">{formatPrice(total)}</Text>
            </HStack>

            <VStack spacing={2}>
              <Button
                colorScheme="blue"
                size="lg"
                width="100%"
                onClick={handleCheckout}
              >
                Finalizar Compra
              </Button>

              <Link to="/products" style={{ width: '100%' }}>
                <Button variant="outline" width="100%">
                  Continuar Comprando
                </Button>
              </Link>

              <Button
                variant="ghost"
                colorScheme="red"
                size="sm"
                width="100%"
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default Cart;