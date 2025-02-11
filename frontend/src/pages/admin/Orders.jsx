// src/pages/admin/Orders.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiMoreVertical, 
  FiEye,
  FiFileText,
  FiTrash2,
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { formatPrice } from '../../utils/format.js';

// Dados mockados para teste
const mockOrders = [
  {
    id: 1,
    customer: {
      id: 1,
      name: "João Silva",
      email: "joao@email.com"
    },
    date: "2024-02-01T10:00:00Z",
    status: "pending",
    total: 799.98,
    payment: {
      method: "credit",
      installments: 3,
      status: "paid"
    },
    items: [
      {
        id: 1,
        name: "Mouse Gamer RGB Pro X",
        price: 299.99,
        quantity: 1,
        image: "/placeholder-image.jpg"
      },
      {
        id: 2,
        name: "Teclado Mecânico RGB",
        price: 499.99,
        quantity: 1,
        image: "/placeholder-image.jpg"
      }
    ],
    shipping: {
      address: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      cost: 25.00
    },
    subtotal: 774.98,
    discount: 0
  },
  {
    id: 2,
    customer: {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com"
    },
    date: "2024-02-02T15:30:00Z",
    status: "delivered",
    total: 1524.99,
    payment: {
      method: "pix",
      status: "paid"
    },
    items: [
      {
        id: 3,
        name: "Headset 7.1 Surround",
        price: 1499.99,
        quantity: 1,
        image: "/placeholder-image.jpg"
      }
    ],
    shipping: {
      address: "Avenida Principal, 456",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "20000-000",
      cost: 25.00
    },
    subtotal: 1499.99,
    discount: 0
  }
];

const statusOptions = [
  { value: 'pending', label: 'Pendente', color: 'yellow' },
  { value: 'processing', label: 'Em processamento', color: 'blue' },
  { value: 'shipped', label: 'Enviado', color: 'purple' },
  { value: 'delivered', label: 'Entregue', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' },
];
function Orders() {
    const [orders, setOrders] = useState(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
  
    const getStatusColor = (status) => {
      return statusOptions.find(opt => opt.value === status)?.color || 'gray';
    };
  
    const getStatusLabel = (status) => {
      return statusOptions.find(opt => opt.value === status)?.label || status;
    };
  
    const handleViewOrder = (order) => {
      setSelectedOrder(order);
      onOpen();
    };
  
    const handleUpdateStatus = (orderId, newStatus) => {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: "Status do pedido atualizado",
        status: "success",
        duration: 2000,
      });
    };
  
    const handleDeleteOrder = (orderId) => {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast({
        title: "Pedido excluído",
        status: "success",
        duration: 2000,
      });
    };
  
    const filteredOrders = orders.filter(order => {
      const matchesSearch = 
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery);
  
      const matchesStatus = !statusFilter || order.status === statusFilter;
  
      return matchesSearch && matchesStatus;
    });
    return (
        <AdminLayout>
          <Box>
            <Heading size="lg" mb={6}>Pedidos</Heading>
    
            <HStack mb={6} spacing={4}>
              <InputGroup maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por cliente ou número do pedido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
    
              <Select
                maxW="200px"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </HStack>
    
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Pedido</Th>
                    <Th>Cliente</Th>
                    <Th>Data</Th>
                    <Th>Status</Th>
                    <Th>Total</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
              {filteredOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <Text fontWeight="medium">#{order.id}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {order.payment.method === 'credit' 
                        ? `Cartão - ${order.payment.installments}x`
                        : order.payment.method === 'pix'
                        ? 'PIX'
                        : 'Boleto'}
                    </Text>
                  </Td>
                  <Td>
                    <Text>{order.customer.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {order.customer.email}
                    </Text>
                  </Td>
                  <Td>
                    {new Date(order.date).toLocaleDateString()}
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontWeight="medium">
                      {formatPrice(order.total)}
                    </Text>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<FiEye />}
                          onClick={() => handleViewOrder(order)}
                        >
                          Ver Detalhes
                        </MenuItem>
                        <MenuItem 
                          icon={<FiFileText />}
                          onClick={() => {
                            // Implementar geração de nota fiscal
                            toast({
                              title: "Funcionalidade em desenvolvimento",
                              status: "info",
                              duration: 2000,
                            });
                          }}
                        >
                          Gerar Nota
                        </MenuItem>
                        <MenuItem 
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Excluir
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {filteredOrders.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text>Nenhum pedido encontrado</Text>
          </Box>
        )}

        <OrderDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
        />
      </Box>
    </AdminLayout>
  );
}

export default Orders;