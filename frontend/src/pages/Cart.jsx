// src/pages/Cart.jsx
import React from 'react';
import {
  Container,
  Grid,
  GridItem,
  VStack,
  Heading,
  Button,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

function Cart() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const handleClearCart = () => {
    clearCart();
    toast({
      title: 'Carrinho limpo',
      description: 'Todos os itens foram removidos do carrinho',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCheckout = async () => {
    // Aqui podemos adicionar validações antes de ir para o checkout
    // Por exemplo, verificar estoque
    navigate('/checkout');
  };

  if (items.length === 0) {
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
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        {/* Lista de Produtos */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Carrinho de Compras</Heading>
            
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Botões de Ação */}
            <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
              <Link to="/products">
                <Button width="100%" variant="outline">
                  Continuar Comprando
                </Button>
              </Link>
              <Button
                width="100%"
                colorScheme="red"
                variant="ghost"
                onClick={handleClearCart}
              >
                Limpar Carrinho
              </Button>
            </Grid>
          </VStack>
        </GridItem>

        {/* Resumo do Carrinho */}
        <GridItem>
          <CartSummary onCheckout={handleCheckout} />
        </GridItem>
      </Grid>
    </Container>
  );
}

export default Cart;