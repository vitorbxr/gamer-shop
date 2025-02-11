// src/components/admin/AdminLayout.jsx
import React from 'react';
import {
 Box,
 Flex,
 VStack,
 Heading,
 Text,
 Icon,
 Link as ChakraLink,
 Divider,
 useColorModeValue,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
 FiHome,
 FiBox,
 FiList,
 FiShoppingBag,
 FiUsers,
 FiSettings,
} from 'react-icons/fi';

const menuItems = [
 { icon: FiHome, label: 'Dashboard', path: '/admin' },
 { icon: FiBox, label: 'Produtos', path: '/admin/products' },
 { icon: FiList, label: 'Categorias', path: '/admin/categories' },
 { icon: FiShoppingBag, label: 'Pedidos', path: '/admin/orders' },
 { icon: FiUsers, label: 'Usuários', path: '/admin/users' },
 { icon: FiSettings, label: 'Configurações', path: '/admin/settings' },
];

function AdminLayout({ children }) {
 const location = useLocation();
 const bgColor = useColorModeValue('white', 'gray.800');
 const borderColor = useColorModeValue('gray.200', 'gray.700');

 return (
   <Flex minH="calc(100vh - 64px)">
     {/* Sidebar */}
     <Box
       w="250px"
       bg={bgColor}
       borderRight="1px"
       borderColor={borderColor}
       py={6}
       position="fixed"
       h="calc(100vh - 64px)"
       overflowY="auto"
     >
       <VStack spacing={1} align="stretch">
         <Box px={4} mb={6}>
           <Heading size="md" mb={2}>Painel Admin</Heading>
           <Text fontSize="sm" color="gray.500">Gerenciamento da loja</Text>
         </Box>

         <Divider mb={4} />

         {menuItems.map((item) => (
           <ChakraLink
             key={item.path}
             as={Link}
             to={item.path}
             px={4}
             py={3}
             display="flex"
             alignItems="center"
             bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
             color={location.pathname === item.path ? 'blue.500' : 'inherit'}
             _hover={{
               bg: 'blue.50',
               color: 'blue.500',
               textDecoration: 'none',
             }}
           >
             <Icon as={item.icon} mr={3} />
             <Text>{item.label}</Text>
           </ChakraLink>
         ))}
       </VStack>
     </Box>

     {/* Conteúdo Principal */}
     <Box ml="250px" p={8} w="full" bg="gray.50">
       {children}
     </Box>
   </Flex>
 );
}

export default AdminLayout;