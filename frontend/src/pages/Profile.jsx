// src/pages/Profile.jsx
import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Avatar,
  Divider,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Cabeçalho do Perfil */}
        <Box textAlign="center">
          <Avatar size="2xl" name={user.name} mb={4} />
          <Heading size="lg">{user.name}</Heading>
          <Text color="gray.600">{user.email}</Text>
        </Box>

        <Divider />

        {/* Informações do Perfil */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Informações Pessoais</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Box>
                  <Text fontWeight="bold">Nome</Text>
                  <Text>{user.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email</Text>
                  <Text>{user.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Membro desde</Text>
                  <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Atividades Recentes</Heading>
            </CardHeader>
            <CardBody>
              <Text color="gray.600">
                Nenhuma atividade recente para mostrar.
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

export default Profile;