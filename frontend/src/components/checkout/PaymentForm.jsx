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
  Text,
  useToast,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Code,
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format';

function PaymentForm({ onSubmit, total }) {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    phoneNumber: '' // Para MB WAY
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateCreditCard = () => {
    const newErrors = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth retorna 0-11

    // Validação do número do cartão
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }

    // Validação do nome no cartão
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Nome no cartão é obrigatório';
    }

    // Validação do mês
    const month = parseInt(formData.expiryMonth);
    if (!month || month < 1 || month > 12) {
      newErrors.expiryMonth = 'Mês inválido (1-12)';
    }

    // Validação do ano
    const year = parseInt('20' + formData.expiryYear);
    if (!year || year < currentYear || formData.expiryYear.length !== 2) {
      newErrors.expiryYear = `Ano inválido (YY formato, não pode ser menor que ${currentYear.toString().slice(-2)})`;
    }

    // Verificação se o cartão está vencido
    if (year === currentYear && month < currentMonth) {
      newErrors.expiry = 'Cartão vencido';
    }

    // Validação do CVV
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'CVV inválido';
    }

    return newErrors;
  };

  const validateMBWay = () => {
    const newErrors = {};
    
    if (!formData.phoneNumber.match(/^9\d{8}$/)) {
      newErrors.phoneNumber = 'Número de telemóvel inválido';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (paymentMethod === 'CREDIT_CARD') {
      validationErrors = validateCreditCard();
    } else if (paymentMethod === 'MBWAY') {
      validationErrors = validateMBWay();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: 'Erro na validação',
        description: 'Por favor, verifique os campos destacados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSubmit({
      paymentMethod,
      ...formData
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiryMonth') {
      // Limita o mês entre 1 e 12
      const month = parseInt(value);
      if (month > 12) return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Gera um número de referência Multibanco fictício
  const generateMultibancoRef = () => {
    const entity = '12345';
    const reference = Math.random().toString().slice(2, 11);
    return { entity, reference };
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'CREDIT_CARD':
        return (
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.cardNumber}>
              <FormLabel>Número do Cartão</FormLabel>
              <Input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setFormData(prev => ({ ...prev, cardNumber: formatted }));
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <FormErrorMessage>{errors.cardNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.cardName}>
              <FormLabel>Nome no Cartão</FormLabel>
              <Input
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="Nome como está no cartão"
              />
              <FormErrorMessage>{errors.cardName}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl isRequired isInvalid={errors.expiryMonth}>
                  <FormLabel>Mês</FormLabel>
                  <Input
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    placeholder="MM"
                    maxLength={2}
                  />
                  <FormErrorMessage>{errors.expiryMonth}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl isRequired isInvalid={errors.expiryYear}>
                  <FormLabel>Ano</FormLabel>
                  <Input
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    placeholder="YY"
                    maxLength={2}
                  />
                  <FormErrorMessage>{errors.expiryYear}</FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl isRequired isInvalid={errors.cvv}>
                  <FormLabel>CVV</FormLabel>
                  <Input
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength={4}
                    type="password"
                  />
                  <FormErrorMessage>{errors.cvv}</FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>

            {errors.expiry && (
              <Alert status="error">
                <AlertIcon />
                {errors.expiry}
              </Alert>
            )}
          </VStack>
        );

      case 'MBWAY':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={errors.phoneNumber}>
              <FormLabel>Número de Telemóvel</FormLabel>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="912345678"
                maxLength={9}
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
            <Alert status="info">
              <AlertIcon />
              <Text>
                Após confirmar, você receberá uma notificação no seu telemóvel para aprovar o pagamento.
              </Text>
            </Alert>
          </VStack>
        );

      case 'MULTIBANCO':
        const { entity, reference } = generateMultibancoRef();
        return (
          <VStack spacing={4} p={4} borderWidth="1px" borderRadius="lg">
            <Alert status="info" variant="subtle">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text>Dados para pagamento Multibanco:</Text>
                <Box>
                  <Text><strong>Entidade:</strong> <Code>{entity}</Code></Text>
                  <Text><strong>Referência:</strong> <Code>{reference}</Code></Text>
                  <Text><strong>Valor:</strong> <Code>{formatPrice(total)}</Code></Text>
                </Box>
                <Text fontSize="sm">
                  O seu pedido será processado após a confirmação do pagamento.
                  O pagamento deve ser feito em 24 horas.
                </Text>
              </VStack>
            </Alert>
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
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Radio value="CREDIT_CARD">Cartão de Crédito/Débito</Radio>
              <Radio value="MBWAY">MB WAY</Radio>
              <Radio value="MULTIBANCO">Multibanco</Radio>
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
          Finalizar Pagamento
        </Button>
      </VStack>
    </form>
  );
}

export default PaymentForm;