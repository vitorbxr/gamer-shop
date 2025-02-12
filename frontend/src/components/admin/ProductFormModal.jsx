// src/components/admin/ProductFormModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  Input, Select, Textarea, VStack, Box, Text, SimpleGrid, 
  NumberInput, NumberInputField, NumberInputStepper, 
  NumberIncrementStepper, NumberDecrementStepper, Switch, 
  FormHelperText, useToast
} from '@chakra-ui/react';
import ImageUpload from '../../components/ImageUpload';
import api from '../../services/api';
import { getImageUrl } from "../../utils/imageUrl";

const categories = [
  { id: 1, name: 'Mouse' }, { id: 2, name: 'Teclado' },
  { id: 3, name: 'Headset' }, { id: 4, name: 'Monitor' },
  { id: 5, name: 'Placa de Vídeo' }, { id: 6, name: 'Processador' },
  { id: 7, name: 'Memória RAM' }, { id: 8, name: 'Armazenamento' }
];

const brands = [
  { id: 1, name: 'Razer' }, { id: 2, name: 'Logitech' },
  { id: 3, name: 'Corsair' }, { id: 4, name: 'HyperX' },
  { id: 5, name: 'ASUS' }, { id: 6, name: 'AMD' },
  { id: 7, name: 'NVIDIA' }, { id: 8, name: 'Intel' }
];

const initialFormState = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  brandId: '',
  stock: 0,
  isActive: true,
  specifications: '',
  features: '',
  image: null
};

function ProductFormModal({ isOpen, onClose, product = null, onSave }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        specifications: product.specifications || '',
        features: product.features || ''
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = async (file) => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/images/upload', formData);
        
        const imageUrl = response.data.urls.medium;
        console.log('URL da imagem:', imageUrl);
        
        handleChange({
          target: {
            name: 'image',
            value: imageUrl
          }
        });
        return getImageUrl(imageUrl);
      } else {
        // ...
      }
    } catch (error) {
      // ...
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }
    
    if (!formData.brandId) {
      newErrors.brandId = 'Marca é obrigatória';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, String(formData[key]));
        }
      });
  
      await onSave(formDataToSend);
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar produto',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label, name, component) => (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel>{label}</FormLabel>
      {component}
      {errors[name] && <Text color="red.500" fontSize="sm">{errors[name]}</Text>}
    </FormControl>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {/* Campo de Imagem */}
              <Box>
                <Text fontWeight="bold" mb={2}>Imagem do Produto</Text>
                <ImageUpload
                  initialImage={formData.image}
                  onImageChange={handleImageChange}
                />
              </Box>

              <SimpleGrid columns={2} spacing={4} width="full">
                {renderField(
                  'Nome',
                  'name',
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                )}

                {renderField(
                  'Preço',
                  'price',
                  <NumberInput
                    value={formData.price}
                    onChange={(value) => handleNumberChange('price', value)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} width="full">
                {renderField(
                  'Categoria',
                  'categoryId',
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                )}

                {renderField(
                  'Marca',
                  'brandId',
                  <Select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma marca</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Select>
                )}
              </SimpleGrid>

              {renderField(
                'Descrição',
                'description',
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              )}

              <SimpleGrid columns={2} spacing={4} width="full">
                {renderField(
                  'Estoque',
                  'stock',
                  <NumberInput
                    value={formData.stock}
                    onChange={(value) => handleNumberChange('stock', value)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Switch
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={(e) => handleChange({
                      target: {
                        name: 'isActive',
                        value: e.target.checked
                      }
                    })}
                  />
                  <FormHelperText>
                    Produto {formData.isActive ? 'ativo' : 'inativo'}
                  </FormHelperText>
                </FormControl>
              </SimpleGrid>

              {renderField(
                'Especificações',
                'specifications',
                <Textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Uma especificação por linha"
                />
              )}

              {renderField(
                'Características',
                'features',
                <Textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Uma característica por linha"
                />
              )}
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