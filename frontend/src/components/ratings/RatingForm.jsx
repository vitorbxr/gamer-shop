// src/components/ratings/RatingForm.jsx
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Textarea,
  Button,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

function RatingForm({ productId, onRatingSubmit }) {
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
      await onRatingSubmit({
        rating,
        comment,
        productId,
        userId: user.id,
        userName: user.name,
        date: new Date().toISOString(),
      });

      setRating(0);
      setComment('');
      
      toast({
        title: "Avaliação enviada",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <HStack spacing={2}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Icon
              key={value}
              as={StarIcon}
              w={6}
              h={6}
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

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!user}
        >
          Enviar Avaliação
        </Button>
      </VStack>
    </form>
  );
}

export default RatingForm;