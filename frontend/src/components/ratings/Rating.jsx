// src/components/ratings/Rating.jsx
import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

function Rating({ rating, totalRatings, size = "md", showCount = true }) {
  const stars = Array(5).fill('').map((_, i) => (
    <Icon
      key={i}
      as={StarIcon}
      color={i < rating ? "yellow.400" : "gray.300"}
      w={size === "sm" ? 3 : size === "md" ? 4 : 5}
      h={size === "sm" ? 3 : size === "md" ? 4 : 5}
    />
  ));

  return (
    <HStack spacing={2}>
      <Box>{stars}</Box>
      {showCount && (
        <Text fontSize={size === "sm" ? "sm" : "md"} color="gray.500">
          ({totalRatings})
        </Text>
      )}
    </HStack>
  );
}

export default Rating;