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
import StockAlerts from '../../components/admin/StockAlerts';
import { formatPrice } from '../../utils/format';
import api from '../../services/api';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [
        overviewData, 
        topProductsData, 
        salesByPeriod, 
        orderStatusData,
        categoryData,
        lowStockData
      ] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/top-products'),
        api.get('/dashboard/sales-by-period'),
        api.get('/dashboard/order-status'),
        api.get('/dashboard/sales-by-category'),
        api.get('/dashboard/low-stock')
      ]);
  
      setOverview(overviewData.data);
      setTopProducts(topProductsData.data);
      setSalesData(salesByPeriod.data.map(sale => ({
        ...sale,
        date: new Date(sale.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        })
      })));
      setOrderStatus(orderStatusData.data);
      setCategoryData(categoryData.data);
      setLowStockProducts(lowStockData.data);
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
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => value}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatPrice(value)}
                  />
                  <Tooltip 
                    formatter={(value) => formatPrice(value)}
                    labelFormatter={(label) => `Data: ${label}`}
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

          <Card>
            <CardHeader>
              <Heading size="md">Status dos Pedidos</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card gridColumn={{ base: 'auto', lg: 'span 2' }}> {/* Este Card ocupará duas colunas */}
            <CardHeader>
              <Heading size="md">Alertas de Estoque</Heading>
            </CardHeader>
            <CardBody>
              <StockAlerts products={lowStockProducts} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Vendas por Categoria</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({name, percent}) => 
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip 
                      formatter={(value) => `${value} unidades`}
                      labelFormatter={(label) => `Categoria: ${label}`}
                    />
                  </PieChart>
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
                      <Td>{item.product?.name}</Td>
                      <Td isNumeric>{item.quantity}</Td>
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