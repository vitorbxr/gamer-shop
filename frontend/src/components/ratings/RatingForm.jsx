// src/components/ratings/RatingForm.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Textarea,
  Button,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

function RatingForm({ isOpen, onClose, productId, orderId, productName, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para avaliar o produto",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Selecione uma quantidade de estrelas",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/reviews', {
        productId,
        orderId,
        rating,
        comment
      });

      toast({
        title: "Avaliação enviada",
        status: "success",
        duration: 3000,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.response?.data?.message || "Ocorreu um erro ao enviar a avaliação",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Avaliar {productName}</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <HStack spacing={2} justify="center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Icon
                    key={value}
                    as={StarIcon}
                    w={8}
                    h={8}
                    cursor="pointer"
                    color={(hoveredRating || rating) >= value ? "yellow.400" : "gray.300"}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(value)}
                  />
                ))}
              </HStack>

              <Textarea
                placeholder="Escreva sua avaliação..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                resize="vertical"
                minH="100px"
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Enviar Avaliação
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default RatingForm;