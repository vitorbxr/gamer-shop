// src/components/checkout/DeliveryForm.jsx
import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  GridItem,
  Select,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Stack,
  Text,
  useToast,
  Box,
} from '@chakra-ui/react';
import { formatPostalCode, isValidPostalCode } from '../../utils/format';

const distritos = [
  'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco',
  'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa',
  'Portalegre', 'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo',
  'Vila Real', 'Viseu'
];

const shippingOptions = [
  { id: 'CTT_NORMAL', label: 'CTT Normal (2-3 dias úteis)', price: 5.00 },
  { id: 'CTT_EXPRESS', label: 'CTT Expresso (1-2 dias úteis)', price: 10.00 }
];

const defaultFormData = {
  name: '',
  postalCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  phone: '',
  shippingMethod: 'CTT_NORMAL'
};

function DeliveryForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...(initialData || {})
  });

  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!isValidPostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Código postal inválido';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }

    if (!formData.district) {
      newErrors.district = 'Distrito é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        postalCode: formatPostalCode(formData.postalCode)
      });
    } else {
      toast({
        title: 'Erro no formulário',
        description: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'postalCode') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPostalCode(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl isRequired isInvalid={errors.name}>
          <FormLabel>Nome Completo</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome de quem vai receber"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isRequired isInvalid={errors.postalCode}>
              <FormLabel>Código Postal</FormLabel>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="1234-567"
                maxLength={8}
              />
              <FormErrorMessage>{errors.postalCode}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 8 }}>
            <FormControl isRequired isInvalid={errors.phone}>
              <FormLabel>Telefone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="912345678"
                maxLength={9}
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <FormControl isRequired isInvalid={errors.street}>
              <FormLabel>Rua</FormLabel>
              <Input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Nome da rua"
              />
              <FormErrorMessage>{errors.street}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isRequired isInvalid={errors.number}>
              <FormLabel>Número</FormLabel>
              <Input
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Número"
              />
              <FormErrorMessage>{errors.number}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <FormControl>
          <FormLabel>Complemento</FormLabel>
          <Input
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            placeholder="Apartamento, Bloco, etc."
          />
        </FormControl>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired isInvalid={errors.district}>
              <FormLabel>Distrito</FormLabel>
              <Select
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Selecione o distrito"
              >
                {distritos.map(distrito => (
                  <option key={distrito} value={distrito}>
                    {distrito}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.district}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired isInvalid={errors.city}>
              <FormLabel>Cidade</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Cidade"
              />
              <FormErrorMessage>{errors.city}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Box borderWidth="1px" borderRadius="lg" p={4}>
          <FormControl isRequired>
            <FormLabel>Método de Envio</FormLabel>
            <RadioGroup
              value={formData.shippingMethod}
              onChange={(value) => setFormData(prev => ({ ...prev, shippingMethod: value }))}
            >
              <Stack>
                {shippingOptions.map(option => (
                  <Radio key={option.id} value={option.id}>
                    <Text>
                      {option.label} - {new Intl.NumberFormat('pt-PT', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(option.price)}
                    </Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
        >
          Continuar para Pagamento
        </Button>
      </VStack>
    </form>
  );
}

export default DeliveryForm;