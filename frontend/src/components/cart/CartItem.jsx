// src/components/cart/CartItem.jsx
import React from 'react';
import {
  Box,
  Image,
  Text,
  IconButton,
  HStack,
  VStack,
  useToast,
  Link,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import { getImageUrl } from '../../utils/imageUrl';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const toast = useToast();

  const handleQuantityChange = async (newQuantity) => {
    try {
      if (newQuantity < 1) {
        return;
      }
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar quantidade',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    toast({
      title: 'Item removido',
      description: 'O item foi removido do carrinho',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      p={4}
      mb={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      shadow="sm"
    >
      <HStack spacing={4} align="start">
        <Image
          src={getImageUrl(item.image)}
          alt={item.name}
          boxSize="100px"
          objectFit="cover"
          borderRadius="md"
          fallback={
            <Image
              src="/placeholder-product.png"
              alt="Placeholder"
              boxSize="100px"
              objectFit="cover"
              borderRadius="md"
            />
          }
        />
        
        <VStack align="start" flex={1} spacing={1}>
          <Link
            as={RouterLink}
            to={`/product/${item.id}`}
            fontWeight="bold"
            fontSize="lg"
            _hover={{ textDecoration: 'none', color: 'blue.500' }}
          >
            {item.name}
          </Link>
          <Text color="gray.600">
            {formatPrice(item.price)}
          </Text>
        </VStack>

        <VStack align="end" spacing={2}>
          <HStack>
            <IconButton
              icon={<MinusIcon />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              isDisabled={item.quantity <= 1}
              aria-label="Diminuir quantidade"
            />
            <Text fontWeight="bold" w="40px" textAlign="center">
              {item.quantity}
            </Text>
            <IconButton
              icon={<AddIcon />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              aria-label="Aumentar quantidade"
            />
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              onClick={handleRemove}
              aria-label="Remover item"
            />
          </HStack>
          <Text fontWeight="bold">
            Total: {formatPrice(item.price * item.quantity)}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default CartItem;