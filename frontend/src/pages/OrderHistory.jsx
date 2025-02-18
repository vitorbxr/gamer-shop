// src/pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
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
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';
import api from '../services/api';
import RatingForm from '../components/ratings/RatingForm';
import { getImageUrl } from '../utils/imageUrl';
import { useAuth } from '../contexts/AuthContext';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, checkTokenExpiration } = useAuth();

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated || !checkTokenExpiration()) {
        navigate('/login');
        return;
      }
      await loadOrders();
    };

    init();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/user');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: 'Erro ao carregar pedidos',
        description: error.response?.data?.message || 'Ocorreu um erro ao carregar seus pedidos',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleReviewProduct = (orderId, product) => {
    setSelectedProduct({
      orderId,
      productId: product.id,
      name: product.name
    });
    onOpen();
  };

  const handleReviewSubmitted = () => {
    onClose();
    loadOrders();
    toast({
      title: 'Avaliação enviada',
      status: 'success',
      duration: 3000,
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      PENDING: "yellow",
      PROCESSING: "blue",
      AWAITING_PAYMENT: "orange",
      PAID: "green",
      SHIPPED: "purple",
      DELIVERED: "green",
      CANCELLED: "red"
    };
    return statusMap[status] || "gray";
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Pendente",
      PROCESSING: "Em processamento",
      AWAITING_PAYMENT: "Aguardando pagamento",
      PAID: "Pago",
      SHIPPED: "Enviado",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado"
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Meus Pedidos</Heading>
          <Alert status="info">
            <AlertIcon />
            Você ainda não tem pedidos.
          </Alert>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Meus Pedidos</Heading>

        {orders.map((order) => (
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
                    {new Date(order.createdAt).toLocaleDateString()}
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
                    {formatPrice(order.totalAmount)}
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
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      borderRadius="md"
                      objectFit="cover"
                      boxSize="100px"
                      fallback={<Image src="/placeholder-product.png" alt="Placeholder" />}
                    />
                    <Box>
                      <Text fontWeight="bold">{item.product.name}</Text>
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
                  <Text>{order.shipping?.address}</Text>
                  <Text>{order.shipping?.city} - {order.shipping?.district}</Text>
                  <Text>CEP: {order.shipping?.postalCode}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Pagamento</Text>
                  <Text>
                    {order.payment?.method === 'CREDIT_CARD' 
                      ? `Cartão de Crédito - Final ${order.payment?.lastDigits}`
                      : order.payment?.method === 'MULTIBANCO'
                      ? 'Multibanco'
                      : order.payment?.method
                    }
                  </Text>
                </Box>
              </Grid>

              <HStack justify="flex-end">
                <Button 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => handleViewDetails(order.id)}
                >
                  Ver Detalhes
                </Button>
                {order.status === 'DELIVERED' && order.items.map((item) => (
                  <Tooltip 
                    key={item.id}
                    hasArrow
                    label={item.reviewed ? "Você já avaliou este produto" : "Avaliar este produto"}
                    isDisabled={!item.reviewed}
                    shouldWrapChildren
                  >
                    <Button 
                      colorScheme={item.reviewed ? "gray" : "green"}
                      isDisabled={item.reviewed}
                      onClick={() => !item.reviewed && handleReviewProduct(order.id, item.product)}
                      _disabled={{
                        opacity: 0.7,
                        cursor: 'not-allowed'
                      }}
                    >
                      {item.reviewed ? "Produto Avaliado" : "Avaliar Produto"}
                    </Button>
                  </Tooltip>
                ))}
              </HStack>
            </VStack>
          </Box>
        ))}
      </VStack>

      {/* Modal de Avaliação */}
      {selectedProduct && (
        <RatingForm
          isOpen={isOpen}
          onClose={onClose}
          productId={selectedProduct.productId}
          orderId={selectedProduct.orderId}
          productName={selectedProduct.name}
          onSuccess={handleReviewSubmitted}
        />
      )}
    </Container>
  );
}

export default OrderHistory;