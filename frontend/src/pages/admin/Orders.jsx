// src/pages/admin/Orders.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Text,
  Heading,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import OrderActions from '../../components/admin/OrderActions';
import { formatPrice, formatDate } from '../../utils/format';
import api from '../../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar pedidos',
        description: error.response?.data?.message || 'Ocorreu um erro ao carregar os pedidos',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: 'Erro ao carregar detalhes do pedido',
        description: error.response?.data?.message || 'Ocorreu um erro ao carregar os detalhes do pedido',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Se o status for SHIPPED, abrir modal para código de rastreio
    if (newStatus === 'SHIPPED') {
      setPendingStatusChange({ orderId, status: newStatus });
      setIsTrackingModalOpen(true);
      return;
    }

    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      await loadOrders();
      toast({
        title: "Status atualizado",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.response?.data?.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleConfirmShipping = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Código de rastreio obrigatório",
        description: "Por favor, insira o código de rastreio para marcar como enviado.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true); // Ativa o estado de loading
      
      // Atualiza o código de rastreio e o status
      await api.post(`/orders/${pendingStatusChange.orderId}/tracking`, {
        trackingNumber
      });

      await loadOrders();
      
      toast({
        title: "Pedido enviado",
        description: "Código de rastreio adicionado e status atualizado.",
        status: "success",
        duration: 3000,
      });
      
      // Fecha o modal e limpa os estados
      setIsTrackingModalOpen(false);
      setTrackingNumber('');
      setPendingStatusChange(null);
    } catch (error) {
      toast({
        title: "Erro ao atualizar pedido",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar o pedido",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false); // Desativa o estado de loading
    }
  };

  const refreshOrderData = async () => {
    await loadOrders();
    if (selectedOrder) {
      try {
        const response = await api.get(`/orders/${selectedOrder.id}`);
        setSelectedOrder(response.data);
      } catch (error) {
        console.error('Erro ao atualizar dados do pedido:', error);
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'yellow',
      'PROCESSING': 'blue',
      'AWAITING_PAYMENT': 'orange',
      'PAID': 'green',
      'SHIPPED': 'purple',
      'DELIVERED': 'green',
      'CANCELLED': 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': 'Pendente',
      'PROCESSING': 'Processando',
      'AWAITING_PAYMENT': 'Aguardando Pagamento',
      'PAID': 'Pago',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box p={8} textAlign="center">
          <Spinner size="xl" />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={8}>
        <Heading size="lg" mb={6}>Gerenciar Pedidos</Heading>
        
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Pedido</Th>
              <Th>Data</Th>
              <Th>Cliente</Th>
              <Th>Status</Th>
              <Th isNumeric>Total</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>#{order.id}</Td>
                <Td>{formatDate(order.createdAt)}</Td>
                <Td>
                  <Text>{order.user?.name}</Text>
                  <Text fontSize="sm" color="gray.500">{order.user?.email}</Text>
                </Td>
                <Td>
                  <Box>
                    <Badge colorScheme={getStatusColor(order.status)} mb={2}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <Select
                      size="sm"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="PROCESSING">Processando</option>
                      <option value="AWAITING_PAYMENT">Aguardando Pagamento</option>
                      <option value="PAID">Pago</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregue</option>
                      <option value="CANCELLED">Cancelado</option>
                    </Select>
                  </Box>
                </Td>
                <Td isNumeric>{formatPrice(order.totalAmount)}</Td>
                <Td>
                  <OrderActions 
                    order={order}
                    onView={() => handleViewOrder(order.id)}
                    onRefresh={refreshOrderData}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Modal de Código de Rastreio */}
        <Modal 
          isOpen={isTrackingModalOpen} 
          onClose={() => {
            if (!isSubmitting) {
              setIsTrackingModalOpen(false);
              setPendingStatusChange(null);
              setTrackingNumber('');
            }
          }}
          closeOnOverlayClick={!isSubmitting}
          closeOnEsc={!isSubmitting}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adicionar Código de Rastreio</ModalHeader>
            {!isSubmitting && <ModalCloseButton />}
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Código de Rastreio CTT</FormLabel>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Digite o código de rastreio"
                  isDisabled={isSubmitting}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme="blue" 
                mr={3} 
                onClick={handleConfirmShipping}
                isLoading={isSubmitting}
                loadingText="Processando"
                isDisabled={isSubmitting || !trackingNumber.trim()}
              >
                Confirmar
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  if (!isSubmitting) {
                    setIsTrackingModalOpen(false);
                    setPendingStatusChange(null);
                    setTrackingNumber('');
                  }
                }}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de Detalhes do Pedido */}
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onRefresh={refreshOrderData}
        />
      </Box>
    </AdminLayout>
  );
}

export default Orders;