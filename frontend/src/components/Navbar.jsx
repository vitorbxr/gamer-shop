// src/components/Navbar.jsx
import React from 'react';
import {
  Box,
  Flex,
  Button,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      bg="white"
      px={4}
      position="fixed"
      width="100%"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold" fontSize="xl" color="brand.primary">
          <Link to="/">GamerShop</Link>
        </Box>

        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Link to="/"><Button variant="ghost">Home</Button></Link>
          <Link to="/products"><Button variant="ghost">Produtos</Button></Link>
        </HStack>

        <Flex alignItems="center" flex={1} mx={8}>
          <InputGroup>
            <Input
              placeholder="Buscar produtos..."
              bg="gray.100"
            />
            <InputRightElement>
              <IconButton
                icon={<SearchIcon />}
                variant="ghost"
                aria-label="Buscar"
              />
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Stack direction="row" spacing={4} alignItems="center">
          <Box position="relative">
            <Link to="/cart">
              <Button variant="ghost">
                🛒
                {itemCount > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-1"
                    right="-1"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </Box>
          
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
              >
                <HStack spacing={2}>
                  <Avatar size="sm" name={user.name} />
                  <Text>{user.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">Meu Perfil</MenuItem>
                <MenuItem as={Link} to="/orders">Meus Pedidos</MenuItem>
                {user.role === 'ADMIN' && (
                  <MenuItem as={Link} to="/admin">Painel Admin</MenuItem>
                )}
                <MenuItem onClick={handleLogout} color="red.500">
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/login">
              <Button variant="outline" colorScheme="blue">
                Login
              </Button>
            </Link>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}