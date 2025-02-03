// src/components/checkout/PaymentForm.jsx
import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Grid,
  GridItem,
  Select,
  useToast
} from '@chakra-ui/react';

function PaymentForm({ onSubmit, initialData }) {
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || 'credit');
  const [formData, setFormData] = useState(initialData || {
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    installments: '1'
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'credit') {
      // Validação básica para cartão de crédito
      const requiredFields = ['cardNumber', 'cardName', 'expiryMonth', 'expiryYear', 'cvv'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos do cartão.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validações específicas
      if (formData.cardNumber.length < 16) {
        toast({
          title: "Número do cartão inválido",
          description: "Digite um número de cartão válido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    onSubmit({ ...formData, paymentMethod });
  };

  // Gera os próximos 10 anos para o select de validade do cartão
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Meses para o select de validade do cartão
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>Método de Pagamento</FormLabel>
          <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Radio value="credit">Cartão de Crédito</Radio>
              <Radio value="pix">PIX</Radio>
              <Radio value="boleto">Boleto</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {paymentMethod === 'credit' && (
          <Box>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Número do Cartão</FormLabel>
                <Input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={16}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Nome no Cartão</FormLabel>
                <Input
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Nome como está no cartão"
                />
              </FormControl>

              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 6, md: 3 }}>
                  <FormControl isRequired>
                    <FormLabel>Mês</FormLabel>
                    <Select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      placeholder="MM"
                    >
                      {months.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 6, md: 3 }}>
                  <FormControl isRequired>
                    <FormLabel>Ano</FormLabel>
                    <Select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      placeholder="AAAA"
                    >
                      {years.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 6, md: 3 }}>
                  <FormControl isRequired>
                    <FormLabel>CVV</FormLabel>
                    <Input
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="000"
                      maxLength={4}
                      type="password"
                    />
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 6, md: 3 }}>
                  <FormControl isRequired>
                    <FormLabel>Parcelas</FormLabel>
                    <Select
                      name="installments"
                      value={formData.installments}
                      onChange={handleChange}
                    >
                      <option value="1">1x sem juros</option>
                      <option value="2">2x sem juros</option>
                      <option value="3">3x sem juros</option>
                      <option value="4">4x sem juros</option>
                      <option value="5">5x sem juros</option>
                      <option value="6">6x sem juros</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>
            </VStack>
          </Box>
        )}

        {paymentMethod === 'pix' && (
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <VStack spacing={4} align="center">
              <Box bg="gray.100" p={8} borderRadius="md">
                {/* Aqui seria exibido o QR Code do PIX */}
                🔲 QR Code PIX
              </Box>
              <Button onClick={() => navigator.clipboard.writeText('chave-pix-exemplo')}>
                Copiar Código PIX
              </Button>
            </VStack>
          </Box>
        )}

        {paymentMethod === 'boleto' && (
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <VStack spacing={4} align="center">
              <Text>
                O boleto será gerado após a confirmação do pedido.
              </Text>
            </VStack>
          </Box>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
        >
          Continuar para Confirmação
        </Button>
      </VStack>
    </form>
  );
}

export default PaymentForm;