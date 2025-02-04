// src/components/ratings/RatingsList.jsx
import React from 'react';
import {
  VStack,
  Box,
  Text,
  Avatar,
  HStack,
  Divider,
} from '@chakra-ui/react';
import Rating from './Rating';

function RatingsList({ reviews }) {
  return (
    <VStack spacing={4} align="stretch">
      {reviews.map((review, index) => (
        <Box key={review.id}>
          <HStack spacing={4} mb={2}>
            <Avatar size="sm" name={review.userName} />
            <Box>
              <Text fontWeight="bold">{review.userName}</Text>
              <Rating rating={review.rating} showCount={false} size="sm" />
            </Box>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            {new Date(review.date).toLocaleDateString()}
          </Text>
          <Text mt={2}>{review.comment}</Text>
          {index < reviews.length - 1 && <Divider mt={4} />}
        </Box>
      ))}
    </VStack>
  );
}

export default RatingsList;