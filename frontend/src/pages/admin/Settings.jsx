// src/pages/admin/Settings.jsx
import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Button,
  VStack,
  Grid,
  GridItem,
  Text,
  useToast,
} from '@chakra-ui/react';
import AdminLayout from '../../components/admin/AdminLayout';

function StoreSettingsPanel() {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Nome da Loja</FormLabel>
        <Input defaultValue="Minha Loja Gamer" />
      </FormControl>
      
      <FormControl>
        <FormLabel>Email de Contato</FormLabel>
        <Input defaultValue="contato@minhalojagamer.com" type="email" />
      </FormControl>

      <FormControl>
        <FormLabel>Telefone</FormLabel>
        <Input defaultValue="(11) 99999-9999" />
      </FormControl>

      <FormControl>
        <FormLabel>Moeda</FormLabel>
        <Select defaultValue="BRL">
          <option value="BRL">Real (R$)</option>
          <option value="USD">Dólar ($)</option>
          <option value="EUR">Euro (€)</option>
        </Select>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Loja Ativa</FormLabel>
        <Switch defaultChecked />
      </FormControl>
    </VStack>
  );
}

function PaymentSettingsPanel() {
  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="sm" mb={4}>PIX</Heading>
        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel mb="0">Ativar PIX</FormLabel>
          <Switch defaultChecked />
        </FormControl>
        <FormControl>
          <FormLabel>Chave PIX</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <Heading size="sm" mb={4}>Cartão de Crédito</Heading>
        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel mb="0">Ativar Cartão</FormLabel>
          <Switch defaultChecked />
        </FormControl>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel>API Key</FormLabel>
              <Input type="password" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Secret Key</FormLabel>
              <Input type="password" />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
    </VStack>
  );
}

function ShippingSettingsPanel() {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Frete Grátis</FormLabel>
        <Switch defaultChecked />
      </FormControl>

      <FormControl>
        <FormLabel>Valor Mínimo para Frete Grátis</FormLabel>
        <Input type="number" defaultValue="200" />
      </FormControl>

      <Box>
        <Heading size="sm" mb={4}>Métodos de Envio</Heading>
        
        <VStack spacing={4} align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Correios - PAC</FormLabel>
            <Switch defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Correios - SEDEX</FormLabel>
            <Switch defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Transportadora</FormLabel>
            <Switch />
          </FormControl>
        </VStack>
      </Box>
    </VStack>
  );
}

function NotificationSettingsPanel() {
  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="sm" mb={4}>Notificações por Email</Heading>
        
        <VStack spacing={4} align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Novo Pedido</FormLabel>
            <Switch defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Pedido Pago</FormLabel>
            <Switch defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Pedido Enviado</FormLabel>
            <Switch defaultChecked />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Produto com Estoque Baixo</FormLabel>
            <Switch defaultChecked />
          </FormControl>
        </VStack>
      </Box>

      <Box>
        <Heading size="sm" mb={4}>Configurações de Email</Heading>
        
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Servidor SMTP</FormLabel>
            <Input defaultValue="smtp.gmail.com" />
          </FormControl>

          <FormControl>
            <FormLabel>Porta SMTP</FormLabel>
            <Input defaultValue="587" />
          </FormControl>

          <FormControl>
            <FormLabel>Usuário SMTP</FormLabel>
            <Input type="email" />
          </FormControl>

          <FormControl>
            <FormLabel>Senha SMTP</FormLabel>
            <Input type="password" />
          </FormControl>
        </VStack>
      </Box>
    </VStack>
  );
}

function Settings() {
  const toast = useToast();

  const handleSave = () => {
    // Aqui implementaremos a lógica para salvar as configurações
    toast({
      title: "Configurações salvas",
      description: "Todas as alterações foram salvas com sucesso",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <Box mb={6}>
          <Heading size="lg">Configurações</Heading>
          <Text color="gray.600">Gerencie as configurações da sua loja</Text>
        </Box>

        <Tabs>
          <TabList>
            <Tab>Geral</Tab>
            <Tab>Pagamentos</Tab>
            <Tab>Envio</Tab>
            <Tab>Notificações</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <StoreSettingsPanel />
            </TabPanel>
            <TabPanel>
              <PaymentSettingsPanel />
            </TabPanel>
            <TabPanel>
              <ShippingSettingsPanel />
            </TabPanel>
            <TabPanel>
              <NotificationSettingsPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box mt={6} borderTopWidth={1} pt={6}>
          <Button colorScheme="blue" size="lg" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
}

export default Settings;