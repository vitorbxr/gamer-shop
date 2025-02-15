// src/pages/Checkout.jsx
import React, { useState } from 'react';
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
  
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

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
      // Prepara os dados do pedido
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping: {
          ...deliveryData,
          cost: deliveryData.shippingMethod === 'CTT_EXPRESS' ? 10.00 : 5.00
        },
        payment: {
          method: paymentData.paymentMethod,
          amount: total + (deliveryData.shippingMethod === 'CTT_EXPRESS' ? 10.00 : 5.00),
          currency: 'EUR',
          ...paymentData
        }
      };

      // Usa o orderService ao invés de chamar a API diretamente
      const response = await orderService.create(orderData);

      // Prepara dados para a página de sucesso
      const successData = {
        orderId: response.orderId,
        total: orderData.payment.amount,
        paymentMethod: paymentData.paymentMethod
      };

      // Adiciona dados específicos para Multibanco se necessário
      if (paymentData.paymentMethod === 'MULTIBANCO') {
        successData.entity = response.entity;
        successData.reference = response.reference;
      }

      // Limpa o carrinho
      clearCart();

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