// src/pages/OrderSuccess.jsx
import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Box,
  Alert,
  AlertIcon,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../utils/format';

function OrderSuccess() {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" py={10} px={6}>
          <Icon as={CheckCircleIcon} boxSize={'50px'} color={'green.500'} />
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Pedido Realizado com Sucesso!
          </Heading>
        </Box>

        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          bg={bgColor}
          borderRadius="lg"
          boxShadow="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <VStack spacing={3} mt={4}>
            <Text fontSize="lg">
              Obrigado pela sua compra!
            </Text>
            {orderData && (
              <>
                <Text>
                  Número do Pedido: <strong>#{orderData.orderId}</strong>
                </Text>
                <Text>
                  Valor Total: <strong>{formatPrice(orderData.total)}</strong>
                </Text>
              </>
            )}
            <Text>
              Você receberá um email com os detalhes do seu pedido em breve.
            </Text>
          </VStack>
        </Alert>

        {orderData?.paymentMethod === 'MULTIBANCO' && (
          <Box borderWidth="1px" borderRadius="lg" p={6} bg={bgColor}>
            <VStack spacing={4}>
              <Heading size="md">Dados para Pagamento Multibanco</Heading>
              <Text><strong>Entidade:</strong> {orderData.entity}</Text>
              <Text><strong>Referência:</strong> {orderData.reference}</Text>
              <Text><strong>Valor:</strong> {formatPrice(orderData.total)}</Text>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                O pagamento deve ser realizado em até 24 horas para garantir seu pedido.
              </Alert>
            </VStack>
          </Box>
        )}

        <VStack spacing={4} pt={4}>
          <Link to="/orders">
            <Button colorScheme="blue" size="lg">
              Acompanhar Meus Pedidos
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">
              Continuar Comprando
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Container>
  );
}

export default OrderSuccess;