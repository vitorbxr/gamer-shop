// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  Badge,
  Stack,
} from '@chakra-ui/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPrice } from '../../utils/format';
import api from '../../services/api';

function Dashboard() {
  const [data, setData] = useState({
    overview: null,
    salesByPeriod: [],
    orderStatus: [],
    topProducts: [],
    salesByCategory: [],
    paymentMetrics: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [
        overview,
        salesByPeriod,
        orderStatus,
        topProducts,
        salesByCategory,
        paymentMetrics
      ] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/sales-by-period'),
        api.get('/dashboard/order-status'),
        api.get('/dashboard/top-products'),
        api.get('/dashboard/sales-by-category'),
        api.get('/dashboard/payment-metrics')
      ]);

      setData({
        overview: overview.data,
        salesByPeriod: salesByPeriod.data,
        orderStatus: orderStatus.data,
        topProducts: topProducts.data,
        salesByCategory: salesByCategory.data,
        paymentMetrics: paymentMetrics.data
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        status: "error",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <Spinner size="xl" />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={4}>
        {/* Estatísticas Principais */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Vendas do Mês</StatLabel>
                <StatNumber>{formatPrice(data.overview?.sales.currentMonth || 0)}</StatNumber>
                <StatHelpText>
                  <StatArrow 
                    type={data.overview?.sales.growth > 0 ? 'increase' : 'decrease'} 
                  />
                  {data.overview?.sales.growth.toFixed(1)}% em relação ao mês anterior
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pedidos Hoje</StatLabel>
                <StatNumber>{data.overview?.orders.today || 0}</StatNumber>
                <StatHelpText>
                  {data.overview?.orders.awaitingShipment || 0} aguardando envio
                </StatHelpText>
                <StatHelpText>
                  {data.overview?.orders.awaitingPayment || 0} aguardando pagamento
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Produtos</StatLabel>
                <StatNumber>{data.overview?.products.total || 0}</StatNumber>
                <StatHelpText>
                  {data.overview?.products.lowStock || 0} com estoque baixo
                </StatHelpText>
                <StatHelpText>
                  {data.overview?.products.inactive || 0} inativos
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          {/* Gráfico de Vendas */}
          <Card>
            <CardHeader>
              <Heading size="md">Vendas dos Últimos 30 Dias</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesByPeriod}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip 
                      formatter={(value) => formatPrice(value)}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalAmount" 
                      stroke="#3182ce"
                      name="Vendas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          {/* Status dos Pedidos */}
          <Card>
            <CardHeader>
              <Heading size="md">Status dos Pedidos</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.orderStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({name, percent}) => 
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {data.orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Alertas de Estoque */}
        {data.overview?.products.lowStock > 0 ? (
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Alertas de Estoque</Heading>
            </CardHeader>
            <CardBody>
              <Alert status="warning">
                <AlertIcon />
                <AlertTitle>
                  {data.overview.products.lowStock} produtos com estoque baixo
                </AlertTitle>
              </Alert>
            </CardBody>
          </Card>
        ) : (
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Alertas de Estoque</Heading>
            </CardHeader>
            <CardBody>
              <Alert status="success">
                <AlertIcon />
                <AlertTitle>
                  Todos os produtos estão com estoque adequado
                </AlertTitle>
              </Alert>
            </CardBody>
          </Card>
        )}

        {/* Produtos Mais Vendidos */}
        <Card mb={6}>
          <CardHeader>
            <Heading size="md">Produtos Mais Vendidos</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th isNumeric>Qtd. Vendida</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.topProducts.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.product?.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>
                      {formatPrice(item.quantity * (item.product?.price || 0))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Vendas por Categoria e Métricas de Pagamento */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Vendas por Categoria</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.salesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({name, percent}) => 
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {data.salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Métricas de Pagamento</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                {/* Por Método */}
                <Box>
                  <Text fontWeight="medium" mb={2}>Por Método de Pagamento</Text>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Método</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.paymentMetrics?.byMethod.map((method, index) => (
                        <Tr key={index}>
                          <Td>{method.name}</Td>
                          <Td isNumeric>{formatPrice(method.total)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                {/* Por Status */}
                <Box>
                  <Text fontWeight="medium" mb={2}>Por Status</Text>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Status</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.paymentMetrics?.byStatus.map((status, index) => (
                        <Tr key={index}>
                          <Td>
                            <Badge colorScheme={status.color}>{status.name}</Badge>
                          </Td>
                          <Td isNumeric>{formatPrice(status.total)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </AdminLayout>
  );
}

export default Dashboard;