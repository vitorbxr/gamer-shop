import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Image,
  VStack,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  useNumberInput,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Divider,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import Rating from '../components/ratings/Rating';
import RatingsList from '../components/ratings/RatingsList';
import RatingForm from '../components/ratings/RatingForm';
import TextToList from '../components/TextToList';

// Dados mockados de avaliações para teste
const mockReviews = [
  {
    id: 1,
    userId: 1,
    userName: "João Silva",
    rating: 5,
    comment: "Excelente produto! Superou minhas expectativas.",
    date: "2024-02-01T10:00:00Z"
  },
  {
    id: 2,
    userId: 2,
    userName: "Maria Santos",
    rating: 4,
    comment: "Muito bom, mas poderia ser um pouco mais barato.",
    date: "2024-01-28T15:30:00Z"
  }
];

function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState(mockReviews);
  const toast = useToast();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, value } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 20,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  // Dados mockados do produto
  const product = {
    id: parseInt(id),
    name: "Mouse Gamer RGB Pro X",
    price: 1299.99,
    description: "Mouse gamer profissional com sensor óptico de alta precisão, iluminação RGB personalizável e design ergonômico para máximo desempenho em jogos.",
    images: [
      "/placeholder-image.jpg",
      "/placeholder-image.jpg",
      "/placeholder-image.jpg"
    ],
    specifications: "Sensor óptico de 16.000 DPI\nBotões programáveis\nSwitch mecânico durável\nMemória integrada para perfis\nPeso ajustável",
    features: "RGB Chroma com 16.8 milhões de cores\nPolling rate de 1000Hz\nCabo trançado de 2.1m\nCompatível com software de personalização",
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    warranty: "12 meses de garantia",
    averageRating: 4.5,
    totalRatings: reviews.length
  };

  const handleAddToCart = () => {
    const quantity = parseInt(value);
    addToCart(product, quantity);
    toast({
      title: "Produto adicionado ao carrinho",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleRatingSubmit = async (newReview) => {
    // Aqui você faria a chamada para a API
    // Por enquanto, apenas adicionamos ao estado local
    setReviews(prev => [...prev, { ...newReview, id: prev.length + 1 }]);
  };

  const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
        {/* Galeria de Imagens */}
        <VStack spacing={4}>
          <Box 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            bg="white"
            borderColor="gray.200"
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width="100%"
              height="400px"
              objectFit="cover"
            />
          </Box>
          <HStack spacing={4}>
            {product.images.map((image, index) => (
              <Box
                key={index}
                borderWidth="2px"
                borderRadius="md"
                borderColor={selectedImage === index ? "blue.500" : "gray.200"}
                overflow="hidden"
                cursor="pointer"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} - imagem ${index + 1}`}
                  width="80px"
                  height="80px"
                  objectFit="cover"
                />
              </Box>
            ))}
          </HStack>
        </VStack>

        {/* Informações do Produto */}
        <VStack align="stretch" spacing={6}>
          <Box>
            <HStack spacing={2} mb={2}>
              {product.isNew && <Badge colorScheme="green">Novo</Badge>}
              {product.inStock ? (
                <Badge colorScheme="blue">Em Estoque</Badge>
              ) : (
                <Badge colorScheme="red">Fora de Estoque</Badge>
              )}
            </HStack>

            <HStack justify="space-between" align="start">
              <Heading size="lg" mb={2}>{product.name}</Heading>
              <Tooltip 
                label={isInWishlist(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <IconButton
                  icon={isInWishlist(product.id) ? <StarIcon fill="red.500" /> : <StarIcon />}
                  colorScheme={isInWishlist(product.id) ? "red" : "gray"}
                  variant="ghost"
                  onClick={() => {
                    if (isInWishlist(product.id)) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  aria-label="Favoritar produto"
                />
              </Tooltip>
            </HStack>
            
            <HStack spacing={4} mb={4}>
              <Rating rating={averageRating} totalRatings={reviews.length} />
            </HStack>

            <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
              {formatPrice(product.price)}
            </Text>
          </Box>
          <Text>{product.description}</Text>

          {/* Seletor de Quantidade e Botão de Compra */}
          {product.inStock && (
            <HStack spacing={4}>
              <HStack maxW="320px">
                <Button {...dec}>-</Button>
                <Input {...input} readOnly textAlign="center" />
                <Button {...inc}>+</Button>
              </HStack>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleAddToCart}
                flex={1}
              >
                Adicionar ao Carrinho
              </Button>
            </HStack>
          )}

          {/* Abas de Informações */}
          <Tabs>
            <TabList>
              <Tab>Especificações</Tab>
              <Tab>Características</Tab>
              <Tab>Avaliações</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box bg="gray.50" p={4} borderRadius="md">
                  <TextToList 
                    text={product.specifications} 
                    className="space-y-2"
                  />
                </Box>
              </TabPanel>

              <TabPanel>
                <Box bg="gray.50" p={4} borderRadius="md">
                  <TextToList 
                    text={product.features} 
                    className="space-y-2"
                  />
                </Box>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" mb={4}>Adicionar Avaliação</Heading>
                    <RatingForm 
                      productId={product.id} 
                      onRatingSubmit={handleRatingSubmit} 
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="md" mb={4}>Avaliações dos Clientes</Heading>
                    <RatingsList reviews={reviews} />
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Grid>
    </Container>
  );
}

export default ProductDetail;