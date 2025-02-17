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
  Image,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format';

const OrderSummary = ({ items, total, deliveryData, paymentData, onConfirm, isSubmitting }) => {
  const shippingCost = deliveryData?.shippingMethod === 'CTT_EXPRESS' ? 10.00 : 5.00;
  
  // Busca informações do cupom do localStorage
  const appliedCoupon = localStorage.getItem('appliedCoupon');
  const couponData = appliedCoupon ? JSON.parse(appliedCoupon) : null;
  const discount = couponData ? couponData.discount : 0;
  
  const finalTotal = total + shippingCost - discount;

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'CREDIT_CARD':
        return `Cartão de Crédito - Final ${paymentData.cardNumber.slice(-4)}`;
      case 'MBWAY':
        return 'MB WAY';
      case 'MULTIBANCO':
        return 'Multibanco';
      default:
        return method;
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Alert status="info" mb={4}>
        <AlertIcon />
        Por favor, confirme os detalhes do seu pedido antes de finalizar.
      </Alert>

      {/* Endereço de Entrega */}
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Heading size="md" mb={4}>Endereço de Entrega</Heading>
        <Text><strong>Nome:</strong> {deliveryData.name}</Text>
        <Text><strong>Endereço:</strong> {deliveryData.street}, {deliveryData.number}</Text>
        {deliveryData.complement && (
          <Text><strong>Complemento:</strong> {deliveryData.complement}</Text>
        )}
        <Text><strong>Cidade:</strong> {deliveryData.city}</Text>
        <Text><strong>Distrito:</strong> {deliveryData.district}</Text>
        <Text><strong>Código Postal:</strong> {deliveryData.postalCode}</Text>
        <Text><strong>Telefone:</strong> {deliveryData.phone}</Text>
      </Box>

      {/* Método de Pagamento */}
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Heading size="md" mb={4}>Método de Pagamento</Heading>
        <Text>{formatPaymentMethod(paymentData.paymentMethod)}</Text>
      </Box>

      {/* Itens do Pedido */}
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Heading size="md" mb={4}>Itens do Pedido</Heading>
        <VStack spacing={4} align="stretch">
          {items.map((item) => (
            <Grid
              key={item.id}
              templateColumns="100px 1fr auto"
              gap={4}
              alignItems="center"
            >
              <Image
                src={item.image}
                alt={item.name}
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box>
                <Text fontWeight="bold">{item.name}</Text>
                <Text>Quantidade: {item.quantity}</Text>
              </Box>
              <Text fontWeight="bold">{formatPrice(item.price * item.quantity)}</Text>
            </Grid>
          ))}
        </VStack>
      </Box>

      {/* Resumo dos Valores */}
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Heading size="md" mb={4}>Resumo de Valores</Heading>
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text>Subtotal</Text>
            <Text>{formatPrice(total)}</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text>Frete</Text>
            <Text>{formatPrice(shippingCost)}</Text>
          </HStack>

          {couponData && (
            <HStack justify="space-between" color="green.600">
              <Text>Desconto ({couponData.code})</Text>
              <Text>- {formatPrice(discount)}</Text>
            </HStack>
          )}
          
          <Divider my={2} />
          
          <HStack justify="space-between" fontWeight="bold">
            <Text>Total</Text>
            <Text fontSize="xl">{formatPrice(finalTotal)}</Text>
          </HStack>
        </VStack>
      </Box>

      <Button
        colorScheme="green"
        size="lg"
        onClick={onConfirm}
        isLoading={isSubmitting}
        loadingText="Processando..."
      >
        Confirmar e Finalizar Pedido
      </Button>
    </VStack>
  );
};

export default OrderSummary;