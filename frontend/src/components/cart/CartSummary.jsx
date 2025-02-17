// src/components/cart/CartSummary.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Alert,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';

const CartSummary = ({ onCheckout, isCheckoutPage = false }) => {
  const { items, total, formatPrice } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Estados para o cupom
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState('');
  
  // Valores fixos para frete (pode ser dinamizado depois)
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
  
  // Calcula o desconto se houver cupom aplicado
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  
  // Calcula o total final considerando desconto
  const finalTotal = total + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Por favor, insira um código de cupom');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: total
      });

      if (response.data.valid) {
        const couponData = response.data.coupon;
        setAppliedCoupon(couponData);
        
        // Salva no localStorage
        localStorage.setItem('appliedCoupon', JSON.stringify(couponData));
        console.log('Cupom salvo no localStorage:', couponData);
        
        toast({
          title: 'Cupom aplicado!',
          description: `Desconto de ${formatPrice(couponData.discount)} aplicado ao pedido`,
          status: 'success',
          duration: 3000,
        });
        setCouponCode('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao validar cupom');
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon'); // Remove do localStorage se houver erro
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setError('');
  };

  const handleCheckout = () => {
    // Passa o cupom aplicado para o checkout
    if (onCheckout) {
      onCheckout(appliedCoupon);
    } else {
      // Se estiver navegando para o checkout, salva o cupom no localStorage
      if (appliedCoupon) {
        localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
      }
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
          
          {/* Campo de Cupom */}
          {!appliedCoupon && (
            <VStack align="stretch" spacing={2}>
              <InputGroup size="md">
                <Input
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  isDisabled={isLoading}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleApplyCoupon}
                    isLoading={isLoading}
                    
                  >
                    Aplicar
                  </Button>
                </InputRightElement>
              </InputGroup>
              {error && (
                <Alert status="error" size="sm">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </VStack>
          )}
          
          {/* Cupom Aplicado */}
          {appliedCoupon && (
            <HStack justify="space-between" bg="green.50" p={2} borderRadius="md">
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">Cupom: {appliedCoupon.code}</Text>
                <Text color="green.600" fontSize="sm">
                  {appliedCoupon.type === 'PERCENTAGE' 
                    ? `${appliedCoupon.value}% de desconto`
                    : `${formatPrice(appliedCoupon.value)} de desconto`}
                </Text>
              </VStack>
              <CloseButton size="sm" onClick={removeCoupon} />
            </HStack>
          )}

          {appliedCoupon && (
            <HStack justify="space-between" color="green.600">
              <Text>Desconto</Text>
              <Text>- {formatPrice(discount)}</Text>
            </HStack>
          )}

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