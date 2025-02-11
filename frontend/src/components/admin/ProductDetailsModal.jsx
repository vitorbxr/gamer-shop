import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Box,
  Text,
  Image,
  Badge,
  Divider
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format';
import TextToList from '../TextToList';

function ProductDetailsModal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes do Produto</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Imagem e Informações Básicas */}
            <HStack spacing={4} align="start">
              <Image
                src={product.image}
                alt={product.name}
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/150"
              />
              <Box flex={1}>
                <Text fontSize="xl" fontWeight="bold">{product.name}</Text>
                <HStack mt={2}>
                  <Badge colorScheme={product.isActive ? "green" : "red"}>
                    {product.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge colorScheme={product.stock > 0 ? "blue" : "orange"}>
                    {product.stock > 0 ? "Em Estoque" : "Sem Estoque"}
                  </Badge>
                </HStack>
                <Text fontSize="2xl" color="blue.600" mt={2}>
                  {formatPrice(product.price)}
                </Text>
              </Box>
            </HStack>

            <Divider />

            {/* Descrição */}
            <Box>
              <Text fontWeight="bold" mb={2}>Descrição</Text>
              <Text>{product.description}</Text>
            </Box>

            <Divider />

            {/* Categoria e Marca */}
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">Categoria</Text>
                <Text>{product.category?.name}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Marca</Text>
                <Text>{product.brand?.name}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Estoque</Text>
                <Text>{product.stock} unidades</Text>
              </Box>
            </HStack>

            <Divider />

            {/* Especificações */}
            <Box>
              <Text fontWeight="bold" mb={2}>Especificações</Text>
              <TextToList text={product.specifications} />
            </Box>

            <Divider />

            {/* Características */}
            <Box>
              <Text fontWeight="bold" mb={2}>Características</Text>
              <TextToList text={product.features} />
            </Box>

            <Divider />

            {/* Datas */}
            <HStack justify="space-between" fontSize="sm" color="gray.600">
              <Text>Criado em: {new Date(product.createdAt).toLocaleDateString()}</Text>
              <Text>Atualizado em: {new Date(product.updatedAt).toLocaleDateString()}</Text>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ProductDetailsModal;