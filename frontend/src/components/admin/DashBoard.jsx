// src/pages/admin/Dashboard.jsx
import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Icon,
  Flex,
} from '@chakra-ui/react';
import {
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiUsers,
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

// Dados mockados para teste
const stats = [
  {
    label: 'Total de Vendas',
    value: 'R$ 45.678,00',
    change: '+23%',
    icon: FiDollarSign,
    color: 'green.500',
  },
  {
    label: 'Pedidos',
    value: '156',
    change: '+12%',
    icon: FiShoppingCart,
    color: 'blue.500',
  },
  {
    label: 'Produtos',
    value: '89',
    change: '+7%',
    icon: FiPackage,
    color: 'purple.500',
  },
  {
    label: 'Clientes',
    value: '2.345',
    change: '+18%',
    icon: FiUsers,
    color: 'orange.500',
  },
];

function StatCard({ label, value, change, icon, color }) {
  return (
    <Card>
      <CardBody>
        <Flex justify="space-between" align="center">
          <Box>
            <StatLabel color="gray.500">{label}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
            <StatHelpText color={change.startsWith('+') ? 'green.500' : 'red.500'}>
              {change} em relação ao mês anterior
            </StatHelpText>
          </Box>
          <Icon as={icon} w={10} h={10} color={color} />
        </Flex>
      </CardBody>
    </Card>
  );
}

function Dashboard() {
  return (
    <AdminLayout>
      <Box>
        <Heading size="lg" mb={6}>Dashboard</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </SimpleGrid>

        {/* Aqui você pode adicionar mais componentes como gráficos,
            tabelas de pedidos recentes, etc. */}
      </Box>
    </AdminLayout>
  );
}

export default Dashboard;