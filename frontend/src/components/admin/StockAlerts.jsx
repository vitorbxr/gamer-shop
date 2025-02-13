// frontend/src/components/admin/StockAlerts.jsx
import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Alert,
  AlertIcon,
  VStack
} from '@chakra-ui/react';

const StockAlerts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Alert status="success">
        <AlertIcon />
        Todos os produtos estão com estoque adequado.
      </Alert>
    );
  }

  const outOfStock = products.filter(p => p.status === 'outOfStock');
  const lowStock = products.filter(p => p.status === 'lowStock');

  return (
    <VStack spacing={4} align="stretch">
      {outOfStock.length > 0 && (
        <Alert status="error">
          <AlertIcon />
          {outOfStock.length} produto(s) sem estoque!
        </Alert>
      )}
      
      {lowStock.length > 0 && (
        <Alert status="warning">
          <AlertIcon />
          {lowStock.length} produto(s) com estoque baixo.
        </Alert>
      )}

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Produto</Th>
              <Th>Categoria</Th>
              <Th>Marca</Th>
              <Th isNumeric>Estoque</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.category}</Td>
                <Td>{product.brand}</Td>
                <Td isNumeric>{product.stock}</Td>
                <Td>
                  <Badge 
                    colorScheme={product.status === 'outOfStock' ? 'red' : 'yellow'}
                  >
                    {product.alert}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default StockAlerts;