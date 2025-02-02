// src/pages/ProductDetail.jsx
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  // Dados mockados para teste
  const product = {
    id: 1,
    name: "Mouse Gamer RGB PRO",
    price: 299.99,
    description: "Mouse gamer profissional com iluminação RGB personalizada, sensor óptico de alta precisão e design ergonômico para máximo conforto durante longas sessões de jogo.",
    specifications: {
      dpi: "16000 DPI",
      buttons: "8 botões programáveis",
      rgb: "RGB Chroma com 16.8 milhões de cores",
      connection: "USB 2.0 de alta velocidade",
      weight: "95g"
    },
    features: [
      "Sensor óptico de última geração",
      "Switches mecânicos duráveis",
      "Perfis de memória integrada",
      "Software de personalização avançado"
    ],
    images: [
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
      "/placeholder-product.jpg"
    ],
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    rating: 4.5,
    reviews: 128
  };

  const handleAddToCart = () => {
    toast({
      title: "Produto adicionado",
      description: `${quantity} unidade(s) de ${product.name} adicionada(s) ao carrinho`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
        {/* Imagem do Produto */}
        <Box>
          <Image
            src={product.images[0]}
            alt={product.name}
            borderRadius="lg"
            fallbackSrc="https://via.placeholder.com/500x500"
          />
          <HStack mt={4} spacing={4} overflowX="auto" py={2}>
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} - imagem ${index + 1}`}
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
                fallbackSrc="https://via.placeholder.com/100x100"
              />
            ))}
          </HStack>
        </Box>

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
            
            <Heading size="lg" mb={2}>{product.name}</Heading>
            <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
              R$ {product.price.toFixed(2)}
            </Text>
          </Box>

          <Text>{product.description}</Text>

          {product.inStock && (
            <HStack>
              <NumberInput
                defaultValue={1}
                min={1}
                max={product.stockQuantity}
                onChange={(value) => setQuantity(parseInt(value))}
                w="100px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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

          <Tabs>
            <TabList>
              <Tab>Especificações</Tab>
              <Tab>Características</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack align="stretch" spacing={2}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <HStack key={key} justify="space-between">
                      <Text fontWeight="bold" textTransform="capitalize">
                        {key}:
                      </Text>
                      <Text>{value}</Text>
                    </HStack>
                  ))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack align="stretch" spacing={2}>
                  {product.features.map((feature, index) => (
                    <Text key={index}>• {feature}</Text>
                  ))}
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