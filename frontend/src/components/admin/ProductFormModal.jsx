// src/components/admin/ProductFormModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormHelperText,
  useToast,
} from '@chakra-ui/react';

const categories = [
  { id: 'mouse', name: 'Mouse' },
  { id: 'keyboard', name: 'Teclado' },
  { id: 'headset', name: 'Headset' },
  { id: 'monitor', name: 'Monitor' },
  { id: 'gpu', name: 'Placa de Vídeo' },
  { id: 'cpu', name: 'Processador' },
  { id: 'ram', name: 'Memória RAM' },
  { id: 'storage', name: 'Armazenamento' }
];

const brands = [
  'Razer',
  'Logitech',
  'Corsair',
  'HyperX',
  'ASUS',
  'AMD',
  'NVIDIA',
  'Intel'
];

function ProductFormModal({ isOpen, onClose, product = null, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: 0,
    isActive: true,
    specifications: '',
    features: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock || 0,
        isActive: product.isActive !== false,
        specifications: product.specifications?.join('\n') || '',
        features: product.features?.join('\n') || '',
        image: product.image || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: 0,
        isActive: true,
        specifications: '',
        features: '',
        image: ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.name || !formData.price || !formData.category || !formData.brand) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      // Formatação dos dados
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        specifications: formData.specifications.split('\n').filter(Boolean),
        features: formData.features.split('\n').filter(Boolean)
      };

      await onSave(processedData);
      
      toast({
        title: `Produto ${product ? 'atualizado' : 'criado'} com sucesso!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar produto',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} width="full">
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Preço</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.price}
                    onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                  >
                    <NumberInputField name="price" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} width="full">
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Marca</FormLabel>
                  <Select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma marca</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} width="full">
                <FormControl>
                  <FormLabel>Estoque</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.stock}
                    onChange={(value) => setFormData(prev => ({ ...prev, stock: value }))}
                  >
                    <NumberInputField name="stock" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Switch
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleSwitchChange}
                  />
                  <FormHelperText>
                    Produto {formData.isActive ? 'ativo' : 'inativo'}
                  </FormHelperText>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>URL da Imagem</FormLabel>
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Especificações</FormLabel>
                <Textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Uma especificação por linha"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Características</FormLabel>
                <Textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Uma característica por linha"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default ProductFormModal;