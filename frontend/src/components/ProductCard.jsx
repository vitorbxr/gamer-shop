// src/components/ProductCard.jsx
import React from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '@chakra-ui/icons';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl } from '../utils/imageUrl';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const toast = useToast();

  const isFavorite = isInWishlist(product.id);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Previne a navegação para a página do produto
    try {
      await addToCart(product, 1);
      toast({
        title: "Produto adicionado ao carrinho",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation(); // Previne a navegação para a página do produto
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast({
        title: "Produto removido dos favoritos",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Produto adicionado aos favoritos",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor="gray.200"
      bg="white"
      transition="transform 0.2s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg'
      }}
      onClick={handleClick}
      cursor="pointer"
      position="relative"
    >
      <Tooltip label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
        <IconButton
          icon={<StarIcon color={isFavorite ? "yellow.400" : "gray.300"} />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={isFavorite ? "yellow" : "gray"}
          variant="ghost"
          onClick={handleToggleWishlist}
          aria-label="Favoritar produto"
          zIndex={2}
        />
      </Tooltip>

      <Box position="relative" height="200px">
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          width="100%"
          height="100%"
          objectFit="contain"
          fallback={
            <Image
              src="/placeholder-product.png"
              alt="Placeholder"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          }
        />
      </Box>

      <Box p="6">
        <HStack spacing={2} mb={2}>
          {product.isNew && (
            <Badge colorScheme="green">Novo</Badge>
          )}
          {product.stock > 0 ? (
            <Badge colorScheme="blue">Em Estoque ({product.stock})</Badge>
          ) : (
            <Badge colorScheme="red">Fora de Estoque</Badge>
          )}
        </HStack>

        <VStack align="start" spacing={2}>
          <Text
            fontWeight="semibold"
            fontSize="lg"
            lineHeight="tight"
            isTruncated
          >
            {product.name}
          </Text>

          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color="brand.primary"
          >
            {formatPrice(product.price)}
          </Text>

          <Button
            width="full"
            colorScheme="green"
            isDisabled={!(product.stock > 0)}
            onClick={handleAddToCart}
          >
            Adicionar ao Carrinho
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default ProductCard;