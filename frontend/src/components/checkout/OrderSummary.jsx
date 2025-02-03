// src/components/checkout/OrderSummary.jsx
import React from 'react';
import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  Divider,
  Grid,
  GridItem,
  Image,
  HStack,
  Badge
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format.js';

function OrderSummary({ deliveryData, paymentData, cartItems, total, onConfirm }) {
  const shipping = 25.00; // Valor fixo do frete
  const finalTotal = total + shipping;

  const formatAddress = (data) => {
    return `${data.street}, ${data.number}${data.complement ? ` - ${data.complement}` : ''}
    ${data.neighborhood} - ${data.city}/${data.state}
    CEP: ${data.cep}`;
  };

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'credit':
        return `Cartão de Crédito - Final ${paymentData.cardNumber.slice(-4)}`;
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return method;
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Endereço de Entrega</Heading>
          <Text>{deliveryData.receiver}</Text>
          <Text whiteSpace="pre-line">{formatAddress(deliveryData)}</Text>
        </VStack>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Forma de Pagamento</Heading>
          <Text>{formatPaymentMethod(paymentData.paymentMethod)}</Text>
          {paymentData.paymentMethod === 'credit' && (
            <Text>
              {paymentData.installments}x {formatPrice(finalTotal / parseInt(paymentData.installments))}
            </Text>
          )}
        </VStack>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Itens do Pedido</Heading>
          <VStack spacing={4} align="stretch">
            {cartItems.map((item) => (
              <Grid
                key={item.id}
                templateColumns="100px 1fr auto"
                gap={4}
                alignItems="center"
              >
                <Image
                  src={item.images?.[0] || "/placeholder-image.jpg"}
                  alt={item.name}
                  borderRadius="md"
                  objectFit="cover"
                  boxSize="100px"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text>Quantidade: {item.quantity}</Text>
                </VStack>
                <Text fontWeight="bold">
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </Grid>
            ))}
          </VStack>
        </VStack>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" p={6}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Resumo de Valores</Heading>
          
          <HStack justify="space-between">
            <Text>Subtotal</Text>
            <Text>{formatPrice(total)}</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text>Frete</Text>
            <Text>{formatPrice(shipping)}</Text>
          </HStack>
          
          <Divider />
          
          <HStack justify="space-between" fontWeight="bold">
            <Text>Total</Text>
            <Text fontSize="xl">{formatPrice(finalTotal)}</Text>
          </HStack>

          <Button
            colorScheme="green"
            size="lg"
            onClick={onConfirm}
          >
            Confirmar Pedido
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
}

export default OrderSummary;