import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Text,
  Heading,
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
  Button,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { formatPrice, formatDate } from '../../utils/format';
import api from '../../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

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

  const handleStatusChange = async (orderId, newStatus) => {
    // Se o status for SHIPPED, abrir modal para código de rastreio
    if (newStatus === 'SHIPPED') {
      setPendingStatusChange({ orderId, status: newStatus });
      setIsTrackingModalOpen(true);
      return;
    }

    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      loadOrders();
      toast({
        title: 'Status atualizado',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.response?.data?.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleConfirmShipping = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: 'Código de rastreio obrigatório',
        description: 'Por favor, insira o código de rastreio para marcar como enviado.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      // Primeiro atualiza o código de rastreio
      await api.post(`/orders/${pendingStatusChange.orderId}/tracking`, {
        trackingNumber: trackingNumber
      });

      // Depois atualiza o status
      await api.patch(`/orders/${pendingStatusChange.orderId}/status`, {
        status: pendingStatusChange.status
      });

      loadOrders();
      setIsTrackingModalOpen(false);
      setTrackingNumber('');
      setPendingStatusChange(null);

      toast({
        title: 'Pedido atualizado',
        description: 'Status e código de rastreio atualizados com sucesso.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar pedido',
        description: error.response?.data?.message || 'Ocorreu um erro ao atualizar o pedido',
        status: 'error',
        duration: 3000,
      });
    }
  };

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
                  <IconButton
                    icon={<ViewIcon />}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                    aria-label="Ver detalhes"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          onUpdateStatus={handleStatusChange}
        />

        {/* Modal para código de rastreio */}
        <Modal 
          isOpen={isTrackingModalOpen} 
          onClose={() => {
            setIsTrackingModalOpen(false);
            setPendingStatusChange(null);
            setTrackingNumber('');
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adicionar Código de Rastreio</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Código de Rastreio CTT</FormLabel>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Digite o código de rastreio"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleConfirmShipping}>
                Confirmar
              </Button>
              <Button variant="ghost" onClick={() => {
                setIsTrackingModalOpen(false);
                setPendingStatusChange(null);
                setTrackingNumber('');
              }}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AdminLayout>
  );
}

export default Orders;