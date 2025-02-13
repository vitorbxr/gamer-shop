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

  const isFavorite = isInWishlist(product.id);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
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
      {/* Botão de Favoritos */}
      <Tooltip label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
        <IconButton
          icon={isFavorite ? <StarIcon fill="red.500" /> : <StarIcon />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={isFavorite ? "red" : "gray"}
          variant="ghost"
          onClick={handleToggleWishlist}
          aria-label="Favoritar produto"
          zIndex={2}
        />
      </Tooltip>

      <Box position="relative" height="200px"> {/* Container com altura fixa */}
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          width="100%"
          height="100%"
          objectFit="contain" // Isso fará a imagem caber inteira sem cortar
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
            colorScheme="blue"
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