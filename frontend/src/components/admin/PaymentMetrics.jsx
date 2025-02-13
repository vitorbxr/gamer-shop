// frontend/src/components/admin/PaymentMetrics.jsx
import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Text,
  Progress,
  Badge
} from '@chakra-ui/react';
import { formatPrice } from '../../utils/format';

const PaymentMetrics = ({ data }) => {
  if (!data) return null;

  const { byMethod, byStatus } = data;
  const totalAmount = byStatus.reduce((sum, item) => sum + item.total, 0);
  const totalTransactions = byStatus.reduce((sum, item) => sum + item.count, 0);

  return (
    <VStack spacing={6} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Métodos de Pagamento */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Métodos de Pagamento
          </Text>
          <VStack spacing={4} align="stretch">
            {byMethod.map((method) => (
              <Box key={method.method}>
                <HStack justify="space-between" mb={2}>
                  <Text>{method.name}</Text>
                  <Text fontWeight="bold">
                    {((method.count / totalTransactions) * 100).toFixed(1)}%
                  </Text>
                </HStack>
                <Progress
                  value={(method.count / totalTransactions) * 100}
                  colorScheme="blue"
                  size="sm"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {method.count} transações - {formatPrice(method.total)}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Status de Pagamento */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Status de Pagamento
          </Text>
          <VStack spacing={4} align="stretch">
            {byStatus.map((status) => (
              <Box key={status.status}>
                <HStack justify="space-between" mb={2}>
                  <Badge colorScheme={status.color}>
                    {status.name}
                  </Badge>
                  <Text fontWeight="bold">
                    {((status.count / totalTransactions) * 100).toFixed(1)}%
                  </Text>
                </HStack>
                <Progress
                  value={(status.count / totalTransactions) * 100}
                  colorScheme={status.color}
                  size="sm"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {status.count} transações - {formatPrice(status.total)}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Estatísticas Gerais */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <StatLabel>Total de Transações</StatLabel>
          <StatNumber>{totalTransactions}</StatNumber>
        </Stat>
        <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <StatLabel>Volume Total</StatLabel>
          <StatNumber>{formatPrice(totalAmount)}</StatNumber>
        </Stat>
        <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <StatLabel>Ticket Médio</StatLabel>
          <StatNumber>{formatPrice(totalAmount / totalTransactions)}</StatNumber>
        </Stat>
      </SimpleGrid>
    </VStack>
  );
};

export default PaymentMetrics;