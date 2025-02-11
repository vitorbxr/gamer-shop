// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } else {
      toast({
        title: 'Erro ao fazer login',
        description: result.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Stack spacing={4}>
          <Heading textAlign="center" mb={4}>Login</Heading>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </Stack>
          </form>

          <Text mt={4} textAlign="center">
            Ainda não tem uma conta?{' '}
            <Link to="/register" style={{ color: 'blue' }}>
              Cadastre-se
            </Link>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
}

export default Login;