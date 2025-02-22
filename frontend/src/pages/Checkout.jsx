// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepNumber,
  StepDescription,
  StepSeparator,
  useSteps,
  Heading,
  VStack,
  Button,
  HStack,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import DeliveryForm from '../components/checkout/DeliveryForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderSummary from '../components/checkout/OrderSummary';

const steps = [
  { title: 'Endereço', description: 'Endereço de entrega' },
  { title: 'Pagamento', description: 'Forma de pagamento' },
  { title: 'Confirmação', description: 'Revise seu pedido' }
];

function Checkout() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length
  });

  const [deliveryData, setDeliveryData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem('@GamerShop:token');
    if (!token) {
      navigate('/login?redirect=/checkout');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const handleDeliverySubmit = (data) => {
    console.log('Dados de entrega:', data);
    setDeliveryData(data);
    setActiveStep(1);
  };

  const handlePaymentSubmit = (data) => {
    console.log('Dados de pagamento:', data);
    setPaymentData(data);
    setActiveStep(2);
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log('Iniciando processo de confirmação do pedido');
      
      // Busca dados do cupom do localStorage
      const appliedCoupon = localStorage.getItem('appliedCoupon');
      const couponData = appliedCoupon ? JSON.parse(appliedCoupon) : null;
      
      // Calcula o valor do frete
      const shippingCost = deliveryData.shippingMethod === 'CTT_EXPRESS' ? 10.00 : 5.00;
      
      // Calcula o total com desconto
      const discount = couponData ? couponData.discount : 0;
      const finalTotal = total + shippingCost - discount;

      // Prepara os dados do pedido
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping: {
          ...deliveryData,
          cost: shippingCost
        },
        payment: {
          method: paymentData.paymentMethod,
          amount: finalTotal,
          currency: 'EUR'
        }
      };

      // Adiciona informações específicas de acordo com o método de pagamento
      if (paymentData.paymentMethod === 'CREDIT_CARD') {
        orderData.payment.cardNumber = paymentData.cardNumber;
      } else if (paymentData.paymentMethod === 'MBWAY') {
        orderData.payment.phoneNumber = paymentData.phoneNumber;
      }

      // Adiciona dados do cupom se existir
      if (couponData) {
        orderData.couponId = couponData.id;
        orderData.discountAmount = couponData.discount;
      }

      console.log('Enviando dados do pedido:', orderData);

      const response = await orderService.create(orderData);

      console.log('Resposta da criação do pedido:', response);

      // Mostra mensagem de sucesso
      toast({
        title: 'Pedido realizado com sucesso!',
        description: 'Você receberá um email de confirmação em breve.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Limpa o carrinho e o cupom
      clearCart();
      localStorage.removeItem('appliedCoupon');

      // Prepara dados para a página de sucesso
      const successData = {
        orderId: response.orderId,
        total: finalTotal,
        paymentMethod: paymentData.paymentMethod
      };

      // Adiciona dados específicos para Multibanco se necessário
      if (paymentData.paymentMethod === 'MULTIBANCO' && response.entity && response.reference) {
        successData.entity = response.entity;
        successData.reference = response.reference;
      }

      // Redireciona para a página de sucesso
      navigate('/orderSuccess', { 
        state: { orderData: successData },
        replace: true 
      });

    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast({
        title: 'Erro ao finalizar pedido',
        description: error.response?.data?.message || 'Ocorreu um erro ao processar seu pedido.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
        <Button mt={4} onClick={() => navigate('/cart')}>
          Voltar ao Carrinho
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="warning">
          <AlertIcon />
          Seu carrinho está vazio. Adicione produtos antes de prosseguir com o checkout.
        </Alert>
        <Button mt={4} onClick={() => navigate('/products')}>
          Ver Produtos
        </Button>
      </Container>
    );
  }

  const renderStepContent = () => {
    try {
      switch (activeStep) {
        case 0:
          return (
            <DeliveryForm 
              onSubmit={handleDeliverySubmit}
              initialData={deliveryData}
            />
          );
        case 1:
          return (
            <PaymentForm 
              onSubmit={handlePaymentSubmit}
              initialData={paymentData}
              total={total}
            />
          );
        case 2:
          return (
            <OrderSummary
              deliveryData={deliveryData}
              paymentData={paymentData}
              items={items}
              total={total}
              onConfirm={handleConfirmOrder}
              isSubmitting={isSubmitting}
            />
          );
        default:
          return null;
      }
    } catch (error) {
      console.error('Erro ao renderizar conteúdo:', error);
      setError('Ocorreu um erro ao carregar o formulário. Por favor, tente novamente.');
      return null;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Finalizar Compra</Heading>

        <Stepper index={activeStep} mb={8}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepNumber />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink={0}>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          {renderStepContent()}
        </Box>

        <HStack justify="space-between">
          {activeStep > 0 && (
            <Button 
              onClick={() => setActiveStep(prev => prev - 1)}
              variant="outline"
              isDisabled={isSubmitting}
            >
              Voltar
            </Button>
          )}
          {activeStep === 0 && (
            <Button
              variant="outline"
              onClick={() => navigate('/cart')}
              isDisabled={isSubmitting}
            >
              Voltar ao Carrinho
            </Button>
          )}
        </HStack>
      </VStack>
    </Container>
  );
}

export default Checkout;