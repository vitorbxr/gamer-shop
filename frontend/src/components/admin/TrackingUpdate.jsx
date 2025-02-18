import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { orderService } from '../../services/orderService';

const TrackingUpdate = ({ orderId, currentTrackingNumber, onUpdate }) => {
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um código de rastreio válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.updateTrackingNumber(orderId, trackingNumber);
      
      toast({
        title: 'Sucesso',
        description: 'Código de rastreio atualizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (onUpdate) {
        onUpdate(trackingNumber);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao atualizar código de rastreio',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Alert status="info" mb={4}>
        <AlertIcon />
        O status do pedido será automaticamente atualizado para "Enviado" ao adicionar um código de rastreio.
      </Alert>

      <FormControl isRequired>
        <FormLabel>Código de Rastreio CTT</FormLabel>
        <Input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Digite o código de rastreio"
          maxLength={13}
          pattern="[A-Za-z0-9]+"
        />
      </FormControl>

      <Button
        mt={4}
        colorScheme="blue"
        type="submit"
        isLoading={isSubmitting}
        loadingText="Atualizando..."
        width="full"
      >
        {currentTrackingNumber ? 'Atualizar Rastreio' : 'Adicionar Rastreio'}
      </Button>
    </Box>
  );
};

export default TrackingUpdate;