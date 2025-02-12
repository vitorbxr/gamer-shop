// src/components/ImageUpload.jsx
import React, { useRef, useState } from 'react';
import {
  Box,
  Image,
  Input,
  Button,
  VStack,
  IconButton,
  useToast,
  Center,
  Text
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

const ImageUpload = ({ 
  initialImage = '', 
  onImageChange,
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [preview, setPreview] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();
  const toast = useToast();

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione apenas imagens.',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 5MB.',
        status: 'error',
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = '';
      return;
    }

    setIsLoading(true);

    try {
      const result = await onImageChange(file);
      setPreview(result);
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: error.message || 'Não foi possível fazer upload da imagem.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (preview) {
        setIsLoading(true);
        await onImageChange(null);
        setPreview(null);
      }
    } catch (error) {
      toast({
        title: 'Erro ao remover imagem',
        description: error.message || 'Não foi possível remover a imagem.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        display="none"
      />

      {!preview ? (
        <Center
          borderWidth={2}
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="md"
          p={6}
          cursor="pointer"
          onClick={() => inputRef.current.click()}
          _hover={{ borderColor: 'blue.500' }}
          height="200px" // Altura fixa para área de drop
        >
          <VStack spacing={2}>
            <AddIcon w={8} h={8} color="gray.400" />
            <Text color="gray.500">Clique para adicionar uma imagem</Text>
            <Text fontSize="sm" color="gray.400">
              PNG, JPG ou WEBP até 5MB
            </Text>
          </VStack>
        </Center>
      ) : (
        <Box 
          position="relative" 
          height="200px" // Altura fixa para o preview
          borderRadius="md"
          overflow="hidden"
          borderWidth={1}
          borderColor="gray.200"
        >
          <Image
            src={preview}
            alt="Preview"
            width="100%"
            height="100%"
            objectFit="contain" // Mantém a proporção da imagem
            bg="gray.50" // Fundo claro para imagens com transparência
          />
          <IconButton
            icon={<DeleteIcon />}
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            onClick={handleRemoveImage}
            isLoading={isLoading}
            aria-label="Remover imagem"
            size="sm"
            opacity={0.8}
            _hover={{ opacity: 1 }}
          />
        </Box>
      )}
    </VStack>
  );
};

export default ImageUpload;