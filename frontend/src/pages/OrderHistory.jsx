// src/pages/OrderHistory.jsx
import React from 'react';
import {
  Container,
  VStack,
  Box,
  Heading,
  Text,
  Grid,
  Badge,
  Image,
  HStack,
  Button,
  Divider,
} from '@chakra-ui/react';
import { formatPrice } from '../utils/format.js';

// Dados mockados para teste
const mockOrders = [
  {
    id: 1,
    date: "2024-02-01T10:00:00Z",
    status: "delivered",
    total: 2499.98,
    items: [
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
        price: 1199.99,
        quantity: 1,
        image: "/placeholder-image.jpg"
      }
    ],
    shipping: {
      address: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    payment: {
      method: "credit",
      installments: 6
    }
  },
  // Adicione mais pedidos mockados aqui
];

const getStatusColor = (status) => {
  const statusMap = {
    pending: "yellow",
    processing: "blue",
    shipped: "purple",
    delivered: "green",
    cancelled: "red"
  };
  return statusMap[status] || "gray";
};

const getStatusText = (status) => {
  const statusMap = {
    pending: "Pendente",
    processing: "Em processamento",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado"
  };
  return statusMap[status] || status;
};

function OrderHistory() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Meus Pedidos</Heading>

        {mockOrders.map((order) => (
          <Box
            key={order.id}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
          >
            <VStack spacing={6} align="stretch">
              {/* Cabeçalho do Pedido */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
                <Box>
                  <Text color="gray.500">Pedido</Text>
                  <Text fontWeight="bold">#{order.id}</Text>
                </Box>
                <Box>
                  <Text color="gray.500">Data</Text>
                  <Text fontWeight="bold">
                    {new Date(order.date).toLocaleDateString()}
                  </Text>
                </Box>
                <Box>
                  <Text color="gray.500">Status</Text>
                  <Badge colorScheme={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </Box>
                <Box>
                  <Text color="gray.500">Total</Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {formatPrice(order.total)}
                  </Text>
                </Box>
              </Grid>

              <Divider />

              {/* Itens do Pedido */}
              <VStack spacing={4} align="stretch">
                {order.items.map((item) => (
                  <Grid
                    key={item.id}
                    templateColumns={{ base: "1fr", md: "100px 1fr auto" }}
                    gap={4}
                    alignItems="center"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      borderRadius="md"
                      objectFit="cover"
                      boxSize="100px"
                    />
                    <Box>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text color="gray.500">
                        Quantidade: {item.quantity}
                      </Text>
                    </Box>
                    <Text fontWeight="bold">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Grid>
                ))}
              </VStack>

              <Divider />

              {/* Detalhes de Entrega e Pagamento */}
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <Box>
                  <Text fontWeight="bold" mb={2}>Endereço de Entrega</Text>
                  <Text>{order.shipping.address}</Text>
                  <Text>{order.shipping.city} - {order.shipping.state}</Text>
                  <Text>CEP: {order.shipping.zipCode}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Pagamento</Text>
                  <Text>
                    {order.payment.method === 'credit' 
                      ? `Cartão de Crédito - ${order.payment.installments}x sem juros`
                      : order.payment.method === 'pix'
                      ? 'PIX'
                      : 'Boleto Bancário'
                    }
                  </Text>
                </Box>
              </Grid>

              <HStack justify="flex-end">
                <Button colorScheme="blue" variant="outline">
                  Ver Detalhes
                </Button>
                {order.status === 'delivered' && (
                  <Button colorScheme="green">
                    Avaliar Produtos
                  </Button>
                )}
              </HStack>
            </VStack>
          </Box>
        ))}

        {mockOrders.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text>Nenhum pedido encontrado.</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default OrderHistory;