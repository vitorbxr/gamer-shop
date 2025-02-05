// src/components/admin/OrderDetailsModal.jsx
import React from 'react';
import {
 Modal,
 ModalOverlay,
 ModalContent,
 ModalHeader,
 ModalBody,
 ModalCloseButton,
 VStack,
 HStack,
 Box,
 Text,
 Divider,
 Badge,
 Image,
 Select,
 Button,
 useToast,
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format.js';

const statusOptions = [
 { value: 'pending', label: 'Pendente', color: 'yellow' },
 { value: 'processing', label: 'Em processamento', color: 'blue' },
 { value: 'shipped', label: 'Enviado', color: 'purple' },
 { value: 'delivered', label: 'Entregue', color: 'green' },
 { value: 'cancelled', label: 'Cancelado', color: 'red' },
];

function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus }) {
 const toast = useToast();

 const getStatusColor = (status) => {
   return statusOptions.find(opt => opt.value === status)?.color || 'gray';
 };

 const getStatusLabel = (status) => {
   return statusOptions.find(opt => opt.value === status)?.label || status;
 };

 const handleStatusChange = (newStatus) => {
   onUpdateStatus(order.id, newStatus);
   toast({
     title: "Status atualizado",
     status: "success",
     duration: 2000,
   });
 };

 if (!order) return null;

 return (
   <Modal isOpen={isOpen} onClose={onClose} size="xl">
     <ModalOverlay />
     <ModalContent>
       <ModalHeader>Pedido #{order.id}</ModalHeader>
       <ModalCloseButton />

       <ModalBody pb={6}>
         <VStack spacing={6} align="stretch">
           {/* Status e Atualização */}
           <Box>
             <HStack justify="space-between" mb={2}>
               <Text fontWeight="bold">Status atual:</Text>
               <Badge colorScheme={getStatusColor(order.status)}>
                 {getStatusLabel(order.status)}
               </Badge>
             </HStack>
             <HStack>
               <Select
                 value={order.status}
                 onChange={(e) => handleStatusChange(e.target.value)}
               >
                 {statusOptions.map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </Select>
               <Button
                 colorScheme="blue"
                 onClick={() => handleStatusChange(order.status)}
               >
                 Atualizar
               </Button>
             </HStack>
           </Box>

           <Divider />

           {/* Informações do Cliente */}
           <Box>
             <Text fontWeight="bold" mb={2}>Cliente</Text>
             <Text>{order.customer.name}</Text>
             <Text>{order.customer.email}</Text>
           </Box>

           <Divider />

           {/* Endereço de Entrega */}
           <Box>
             <Text fontWeight="bold" mb={2}>Endereço de Entrega</Text>
             <Text>{order.shipping.address}</Text>
             <Text>
               {order.shipping.city} - {order.shipping.state}
             </Text>
             <Text>CEP: {order.shipping.zipCode}</Text>
           </Box>

           <Divider />

           {/* Itens do Pedido */}
           <Box>
             <Text fontWeight="bold" mb={3}>Itens do Pedido</Text>
             <VStack spacing={4} align="stretch">
               {order.items.map((item) => (
                 <HStack key={item.id} spacing={4}>
                   <Image
                     src={item.image}
                     alt={item.name}
                     boxSize="50px"
                     objectFit="cover"
                     borderRadius="md"
                   />
                   <Box flex={1}>
                     <Text fontWeight="medium">{item.name}</Text>
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
               <Text>{formatPrice(order.subtotal)}</Text>
             </HStack>
             <HStack justify="space-between">
               <Text>Frete</Text>
               <Text>{formatPrice(order.shipping.cost)}</Text>
             </HStack>
             {order.discount > 0 && (
               <HStack justify="space-between" color="green.500">
                 <Text>Desconto</Text>
                 <Text>- {formatPrice(order.discount)}</Text>
               </HStack>
             )}
             <Divider />
             <HStack justify="space-between" fontWeight="bold">
               <Text>Total</Text>
               <Text>{formatPrice(order.total)}</Text>
             </HStack>
           </VStack>

           <Divider />

           {/* Informações de Pagamento */}
           <Box>
             <Text fontWeight="bold" mb={2}>Pagamento</Text>
             <Text>
               {order.payment.method === 'credit' 
                 ? `Cartão de Crédito - ${order.payment.installments}x` 
                 : order.payment.method === 'pix'
                 ? 'PIX'
                 : 'Boleto Bancário'}
             </Text>
             <Badge colorScheme={order.payment.status === 'paid' ? 'green' : 'yellow'}>
               {order.payment.status === 'paid' ? 'Pago' : 'Pendente'}
             </Badge>
           </Box>
         </VStack>
       </ModalBody>
     </ModalContent>
   </Modal>
 );
}

export default OrderDetailsModal;