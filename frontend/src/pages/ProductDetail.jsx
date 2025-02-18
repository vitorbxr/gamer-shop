// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
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
  Spinner,
  Center,
  Alert,
  AlertIcon
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
import { useProduct } from '../hooks/useProduct';
import { getImageUrl } from '../utils/imageUrl';
import api from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const toast = useToast();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps, value } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: product?.stock || 20,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  // Carrega as avaliações do produto
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await api.get(`/reviews/product/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      loadReviews();
    }
  }, [id]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Erro ao carregar produto
        </Alert>
      </Container>
    );
  }

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

  const handleReviewSubmit = async (newReview) => {
    try {
      const response = await api.get(`/reviews/product/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Erro ao atualizar avaliações:', error);
    }
  };

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
              src={getImageUrl(product.image)}
              alt={product.name}
              width="100%"
              height="400px"
              objectFit="contain"
              fallback={<Image src="/placeholder-product.png" alt="Placeholder" />}
            />
          </Box>
          {product.images && product.images.length > 0 && (
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
                    src={getImageUrl(image.thumbnail || image)}
                    alt={`${product.name} - imagem ${index + 1}`}
                    width="80px"
                    height="80px"
                    objectFit="cover"
                    fallback={<Image src="/placeholder-product.png" alt="Placeholder" />}
                  />
                </Box>
              ))}
            </HStack>
          )}
        </VStack>

        {/* Informações do Produto */}
        <VStack align="stretch" spacing={6}>
          <Box>
            <HStack spacing={2} mb={2}>
              {product.isNew && <Badge colorScheme="green">Novo</Badge>}
              {product.stock > 0 ? (
                <Badge colorScheme="blue">Em Estoque ({product.stock} unidades)</Badge>
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
              <Rating 
                rating={product.avgRating || 0} 
                totalRatings={product.totalReviews || 0} 
              />
            </HStack>

            <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
              {formatPrice(product.price)}
            </Text>
          </Box>
          <Text>{product.description}</Text>

          {/* Seletor de Quantidade e Botão de Compra */}
          {product.stock > 0 && (
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
                    <Heading size="md" mb={4}>Avaliações dos Clientes</Heading>
                    {reviewsLoading ? (
                      <Center py={8}>
                        <Spinner />
                      </Center>
                    ) : reviews.length > 0 ? (
                      <RatingsList reviews={reviews} />
                    ) : (
                      <Alert status="info">
                        <AlertIcon />
                        Este produto ainda não possui avaliações.
                      </Alert>
                    )}
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