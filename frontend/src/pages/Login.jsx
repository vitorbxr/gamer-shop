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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Tentando fazer login com:', email);
      const result = await login(email, password);
      console.log('Resultado do login:', result);

      if (result.success) {
        console.log('Login bem-sucedido, redirecionando para:', redirectPath);
        toast({
          title: 'Login realizado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate(redirectPath);
      } else {
        console.error('Erro no login:', result.error);
        setError(result.error || 'Erro ao fazer login. Tente novamente.');
        toast({
          title: 'Erro ao fazer login',
          description: result.error || 'Verifique suas credenciais e tente novamente',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        // Mantém o erro visível por mais tempo
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      const errorMessage = error.response?.data?.message || 
                          'Erro ao conectar com o servidor. Tente novamente mais tarde.';
      setError(errorMessage);
      toast({
        title: 'Erro no servidor',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Mantém o erro visível por mais tempo
      await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      setIsLoading(false);
    }
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

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  isDisabled={isLoading}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    isDisabled={isLoading}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                      isDisabled={isLoading}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
                loadingText="Entrando..."
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