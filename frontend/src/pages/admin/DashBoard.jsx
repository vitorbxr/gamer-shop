// frontend/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
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
  useToast
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPrice } from '../../utils/format';
import api from '../../services/api';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [overviewData, topProductsData, salesByPeriod] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/top-products'),
        api.get('/dashboard/sales-by-period')
      ]);

      setOverview(overviewData.data);
      setTopProducts(topProductsData.data);
      setSalesData(salesByPeriod.data.map(sale => ({
        ...sale,
        date: new Date(sale.createdAt).toLocaleDateString()
      })));
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Stat as={Card}>
            <CardBody>
              <StatLabel>Total de Vendas</StatLabel>
              <StatNumber>{formatPrice(overview?.totalSales || 0)}</StatNumber>
              <StatHelpText>{overview?.totalOrders} pedidos</StatHelpText>
            </CardBody>
          </Stat>

          <Stat as={Card}>
            <CardBody>
              <StatLabel>Vendas Hoje</StatLabel>
              <StatNumber>{overview?.todayOrders || 0}</StatNumber>
              <StatHelpText>pedidos</StatHelpText>
            </CardBody>
          </Stat>

          <Stat as={Card}>
            <CardBody>
              <StatLabel>Produtos Cadastrados</StatLabel>
              <StatNumber>{overview?.totalProducts || 0}</StatNumber>
              <StatHelpText>{overview?.lowStockProducts} com estoque baixo</StatHelpText>
            </CardBody>
          </Stat>

          <Stat as={Card}>
            <CardBody>
              <StatLabel>Ticket Médio</StatLabel>
              <StatNumber>
                {formatPrice(overview?.totalSales / overview?.totalOrders || 0)}
              </StatNumber>
            </CardBody>
          </Stat>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Vendas dos Últimos 30 Dias</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(value)} />
                    <Line type="monotone" dataKey="totalAmount" stroke="#3182ce" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Produtos Mais Vendidos</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th isNumeric>Qtd. Vendida</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topProducts.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.product?.name || 'Produto não encontrado'}</Td>
                      <Td isNumeric>{item.quantity || 0}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </AdminLayout>
  );
}

export default Dashboard;