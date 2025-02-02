// src/components/Navbar.jsx
import React from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, SearchIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
      position="fixed"
      width="100%"
      top={0}
      zIndex={1000}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box fontWeight="bold" fontSize="xl" color="brand.primary">
          <Link to="/">GamerShop</Link>
        </Box>

        <Flex alignItems="center" flex={1} mx={8}>
          <InputGroup>
            <Input
              placeholder="Buscar produtos..."
              bg={useColorModeValue('white', 'gray.700')}
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

        <Stack direction={'row'} spacing={4} alignItems="center">
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          
          <Link to="/cart">
            <Button variant="ghost" aria-label="Carrinho">
              🛒
            </Button>
          </Link>
          
          <Link to="/login">
            <Button variant="outline" colorScheme="brand">
              Login
            </Button>
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
}