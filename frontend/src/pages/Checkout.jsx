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
  Button,
  HStack,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
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
  
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const handleDeliverySubmit = (data) => {
    setDeliveryData(data);
    setActiveStep(1);
  };

  const handlePaymentSubmit = (data) => {
    setPaymentData(data);
    setActiveStep(2);
  };

  const handleConfirmOrder = async () => {
    try {
      // Aqui iremos implementar a chamada para a API
      // para criar o pedido quando tivermos o backend
      
      toast({
        title: 'Pedido realizado com sucesso!',
        description: 'Você receberá um email com os detalhes.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      clearCart();
      navigate('/orders');
    } catch (error) {
      toast({
        title: 'Erro ao finalizar pedido',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
          />
        );
      case 2:
        return (
          <OrderSummary
            deliveryData={deliveryData}
            paymentData={paymentData}
            cartItems={cartItems}
            total={getCartTotal()}
            onConfirm={handleConfirmOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Finalizar Compra</Heading>

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

      {renderStepContent()}

      <HStack mt={8} justify="space-between">
        {activeStep > 0 && (
          <Button onClick={() => setActiveStep(activeStep - 1)}>
            Voltar
          </Button>
        )}
      </HStack>
    </Container>
  );
}

export default Checkout;