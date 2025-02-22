// src/components/admin/OrderDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Divider,
  Button,
  Image,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format.js';
import api from '../../services/api';

function OrderDetailsModal({ isOpen, onClose, order, onRefresh }) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedShipping, setEditedShipping] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para determinar a cor do status
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

  // Função para obter o texto do status
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

  useEffect(() => {
    if (order?.shipping) {
      setEditedShipping({
        address: order.shipping.address || '',
        city: order.shipping.city || '',
        postalCode: order.shipping.postalCode || '',
        trackingCode: order.shipping.trackingCode || ''
      });
    }
  }, [order]);

  const handleShippingUpdate = async () => {
    try {
      setLoading(true);
      
      await api.patch(`/orders/${order.id}`, {
        shipping: {
          address: editedShipping.address,
          city: editedShipping.city,
          postalCode: editedShipping.postalCode,
          trackingCode: editedShipping.trackingCode
        }
      });

      toast({
        title: "Dados atualizados com sucesso",
        status: "success",
        duration: 2000,
      });

      await onRefresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast({
        title: "Erro ao atualizar dados",
        description: error.response?.data?.message || "Ocorreu um erro ao salvar as alterações",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!order || !editedShipping) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>
          <Box display="flex" alignItems="center" gap={3}>
            <Text>Pedido #{order.id}</Text>
            <Badge 
              colorScheme={getStatusColor(order.status)}
            >
              {getStatusLabel(order.status)}
            </Badge>
          </Box>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Informações do Cliente */}
            <Box>
              <Text fontWeight="bold" mb={2}>Cliente</Text>
              <Text>{order.user.name}</Text>
              <Text>{order.user.email}</Text>
            </Box>

            <Divider />

            {/* Endereço de Entrega e Rastreio */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">Endereço de Entrega</Text>
                <Button 
                  size="sm" 
                  colorScheme="blue"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
              </HStack>

              {isEditing ? (
                <VStack spacing={3}>
                  <FormControl>
                    <FormLabel>Endereço</FormLabel>
                    <Input
                      value={editedShipping.address}
                      onChange={(e) => setEditedShipping(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cidade</FormLabel>
                    <Input
                      value={editedShipping.city}
                      onChange={(e) => setEditedShipping(prev => ({
                        ...prev,
                        city: e.target.value
                      }))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Código Postal</FormLabel>
                    <Input
                      value={editedShipping.postalCode}
                      onChange={(e) => setEditedShipping(prev => ({
                        ...prev,
                        postalCode: e.target.value
                      }))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Código de Rastreio</FormLabel>
                    <Input
                      value={editedShipping.trackingCode}
                      onChange={(e) => setEditedShipping(prev => ({
                        ...prev,
                        trackingCode: e.target.value
                      }))}
                      placeholder="Digite o código de rastreio"
                    />
                  </FormControl>

                  <Button 
                    colorScheme="blue" 
                    onClick={handleShippingUpdate}
                    isLoading={loading}
                    width="100%"
                  >
                    Salvar Alterações
                  </Button>
                </VStack>
              ) : (
                <>
                  <Text>{editedShipping.address}</Text>
                  <Text>{editedShipping.city}</Text>
                  <Text>CEP: {editedShipping.postalCode}</Text>
                  
                  <Box mt={4}>
                    <Text fontWeight="bold">Código de Rastreio:</Text>
                    <Text>{editedShipping.trackingCode || "Ainda não possui código de rastreio"}</Text>
                  </Box>
                </>
              )}
            </Box>

            <Divider />

            {/* Itens do Pedido */}
            <Box>
              <Text fontWeight="bold" mb={3}>Itens do Pedido</Text>
              <VStack spacing={4} align="stretch">
                {order.items.map((item) => (
                  <HStack key={item.id} spacing={4}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Box flex={1}>
                      <Text fontWeight="medium">{item.product.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Quantidade: {item.quantity}
                      </Text>
                    </Box>
                    <Text fontWeight="medium">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Resumo dos Valores */}
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text>Subtotal</Text>
                <Text>{formatPrice(order.totalAmount)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Frete</Text>
                <Text>{formatPrice(order.shipping.cost)}</Text>
              </HStack>
              {order.discountAmount > 0 && (
                <HStack justify="space-between" color="green.500">
                  <Text>Desconto</Text>
                  <Text>- {formatPrice(order.discountAmount)}</Text>
                </HStack>
              )}
              <Divider />
              <HStack justify="space-between" fontWeight="bold">
                <Text>Total</Text>
                <Text>{formatPrice(order.totalAmount + order.shipping.cost - (order.discountAmount || 0))}</Text>
              </HStack>
            </VStack>

            <Divider />

            {/* Informações de Pagamento */}
            <Box>
              <Text fontWeight="bold" mb={2}>Pagamento</Text>
              <Text>
                Método: {order.payment.method === 'CREDIT_CARD' ? 'Cartão de Crédito' :
                         order.payment.method === 'DEBIT_CARD' ? 'Cartão de Débito' :
                         order.payment.method === 'MBWAY' ? 'MB Way' : 
                         'Multibanco'}
                {order.payment.installments && ` - ${order.payment.installments}x`}
              </Text>
              <Badge 
                colorScheme={order.payment.status === 'COMPLETED' ? 'green' : 'yellow'}
              >
                {order.payment.status === 'COMPLETED' ? 'Pago' : 'Pendente'}
              </Badge>
              {order.payment.method === 'MULTIBANCO' && (
                <Box mt={2}>
                  <Text>Entidade: {order.payment.entity}</Text>
                  <Text>Referência: {order.payment.reference}</Text>
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default OrderDetailsModal;