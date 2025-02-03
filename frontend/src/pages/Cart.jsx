// src/pages/Cart.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Input,
  useColorModeValue,
  IconButton,
  Divider,
  useToast
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';

function Cart() {
  const toast = useToast();
  const [cupom, setCupom] = useState('');
  
  // Dados mockados do carrinho
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Mouse Gamer RGB Pro X",
      price: 1299.99,
      quantity: 1,
      image: "/placeholder-image.jpg"
    },
    {
      id: 2,
      name: "Teclado Mecânico RGB",
      price: 499.99,
      quantity: 2,
      image: "/placeholder-image.jpg"
    }
  ]);

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Produto removido",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 25.00 : 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const applyCupom = () => {
    toast({
      title: "Cupom inválido",
      description: "Este cupom não existe ou está expirado",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Carrinho de Compras</Heading>

      {cartItems.length === 0 ? (
        <VStack spacing={4} align="stretch">
          <Text>Seu carrinho está vazio</Text>
          <Link to="/products">
            <Button colorScheme="blue">Continuar Comprando</Button>
          </Link>
        </VStack>
      ) : (
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Lista de Produtos */}
          <VStack align="stretch" spacing={4}>
            {cartItems.map((item) => (
              <Box 
                key={item.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                bg={bgColor}
                borderColor={borderColor}
              >
                <Grid templateColumns={{ base: "1fr", sm: "100px 1fr auto" }} gap={4} alignItems="center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    borderRadius="md"
                    objectFit="cover"
                    boxSize="100px"
                  />
                  
                  <VStack align="start" spacing={1}>
                    <Link to={`/product/${item.id}`}>
                      <Text fontWeight="bold" fontSize="lg">{item.name}</Text>
                    </Link>
                    <Text color="brand.primary">
                      {formatPrice(item.price)}
                    </Text>
                  </VStack>

                  <VStack align="end" spacing={2}>
                    <HStack>
                      <IconButton
                        icon={<DeleteIcon />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover item"
                      />
                      <HStack maxW="120px">
                        <Button 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Text fontWeight="bold" w="40px" textAlign="center">
                          {item.quantity}
                        </Text>
                        <Button 
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </HStack>
                    </HStack>
                    <Text fontWeight="bold">
                      Total: {formatPrice(item.price * item.quantity)}
                    </Text>
                  </VStack>
                </Grid>
              </Box>
            ))}
          </VStack>
{/* Resumo do Pedido */}
<Box 
            p={6} 
            borderWidth="1px" 
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
            height="fit-content"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Resumo do Pedido</Heading>
              
              <HStack justify="space-between">
                <Text>Subtotal</Text>
                <Text>{formatPrice(subtotal)}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text>Frete</Text>
                <Text>{formatPrice(shipping)}</Text>
              </HStack>

              {discount > 0 && (
                <HStack justify="space-between" color="green.500">
                  <Text>Desconto</Text>
                  <Text>- {formatPrice(discount)}</Text>
                </HStack>
              )}

              <Divider />
              
              <HStack justify="space-between" fontWeight="bold">
                <Text>Total</Text>
                <Text fontSize="xl">{formatPrice(total)}</Text>
              </HStack>

              <VStack spacing={2}>
                <HStack>
                  <Input
                    placeholder="Cupom de desconto"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                  />
                  <Button onClick={applyCupom}>Aplicar</Button>
                </HStack>
              </VStack>

              <Button colorScheme="blue" size="lg">
                Finalizar Compra
              </Button>

              <Link to="/products">
                <Button variant="outline" width="100%">
                  Continuar Comprando
                </Button>
              </Link>
            </VStack>
          </Box>
        </Grid>
      )}
    </Container>
  );
}

export default Cart;