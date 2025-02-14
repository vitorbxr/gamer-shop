import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartSummary = ({ onCheckout, isCheckoutPage = false }) => {
  const { items, total, formatPrice } = useCart();
  const navigate = useNavigate();
  
  // Valores fixos para frete (você pode tornar isso dinâmico depois)
  const shippingMethods = {
    CTT_NORMAL: {
      label: 'CTT Normal',
      price: 5.00
    },
    CTT_EXPRESS: {
      label: 'CTT Expresso',
      price: 10.00
    }
  };

  // Por padrão, usa o método mais barato
  const shipping = shippingMethods.CTT_NORMAL.price;
  const finalTotal = total + shipping;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg="white"
      shadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Resumo do Pedido
        </Text>

        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text color="gray.600">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</Text>
            <Text>{formatPrice(total)}</Text>
          </HStack>

          <HStack justify="space-between">
            <Text color="gray.600">Frete</Text>
            <Text>{formatPrice(shipping)}</Text>
          </HStack>

          {/* Adicionar linha para desconto quando implementarmos cupons */}
          {/* {discount > 0 && (
            <HStack justify="space-between" color="green.500">
              <Text>Desconto</Text>
              <Text>- {formatPrice(discount)}</Text>
            </HStack>
          )} */}

          <Divider my={2} />

          <HStack justify="space-between" fontWeight="bold">
            <Text>Total</Text>
            <Text fontSize="xl">{formatPrice(finalTotal)}</Text>
          </HStack>
        </VStack>

        {!isCheckoutPage && (
          <Button
            colorScheme="blue"
            size="lg"
            width="100%"
            onClick={handleCheckout}
            isDisabled={items.length === 0}
          >
            Finalizar Compra
          </Button>
        )}

        {items.length === 0 && (
          <Text color="gray.500" textAlign="center">
            Seu carrinho está vazio
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default CartSummary;