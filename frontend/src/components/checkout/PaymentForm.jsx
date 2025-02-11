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
  useToast,
  Text,
  Image,
  Center
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, paymentMethod });
  };

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gera os próximos 10 anos para o select
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Meses para o select
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'credit':
        return (
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
        );

      case 'pix':
        return (
          <VStack spacing={4} p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">QR Code PIX</Text>
            <Box
              width="200px"
              height="200px"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
            >
              <Text fontSize="6xl">🔲</Text>
            </Box>
            <Text>Código PIX</Text>
            <Input value="00020126580014BR.GOV.BCB.PIX0136exemplo" isReadOnly />
            <Button
              onClick={() => {
                navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136exemplo");
                toast({
                  title: "Código copiado!",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              Copiar código
            </Button>
          </VStack>
        );

      case 'boleto':
        return (
          <VStack spacing={4} p={4} borderWidth="1px" borderRadius="lg">
            <Text>
              O boleto será gerado após a confirmação do pedido.
            </Text>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg="gray.50"
              width="100%"
            >
              <Text fontWeight="bold" mb={2}>Informações importantes:</Text>
              <Text>• O boleto tem vencimento em 3 dias úteis</Text>
              <Text>• O pedido será confirmado após o pagamento</Text>
              <Text>• Você receberá o boleto por email</Text>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>Método de Pagamento</FormLabel>
          <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
            <Stack direction="row" spacing={4}>
              <Radio value="credit">Cartão de Crédito</Radio>
              <Radio value="pix">PIX</Radio>
              <Radio value="boleto">Boleto</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {renderPaymentForm()}

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
          mt={4}
        >
          Continuar
        </Button>
      </VStack>
    </form>
  );
}

export default PaymentForm;