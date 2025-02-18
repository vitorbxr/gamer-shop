// src/components/ratings/RatingsList.jsx
import React from 'react';
import {
  VStack,
  Box,
  Text,
  Avatar,
  HStack,
  Divider,
  Badge,
} from '@chakra-ui/react';
import Rating from './Rating';

function RatingsList({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Text color="gray.500">
          Este produto ainda não possui avaliações.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {reviews.map((review, index) => (
        <Box key={review.id}>
          <HStack spacing={4} mb={2}>
            <Avatar size="sm" name={review.user.name} />
            <Box flex="1">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold">{review.user.name}</Text>
                  <Rating rating={review.rating} showCount={false} size="sm" />
                </Box>
                {review.isVerified && (
                  <Badge colorScheme="green">Compra verificada</Badge>
                )}
              </HStack>
            </Box>
          </HStack>
          {review.title && (
            <Text fontWeight="bold" mt={2}>{review.title}</Text>
          )}
          <Text mt={2}>{review.comment}</Text>
          <Text fontSize="sm" color="gray.600" mt={2}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
          {index < reviews.length - 1 && <Divider mt={4} />}
        </Box>
      ))}
    </VStack>
  );
}

export default RatingsList;