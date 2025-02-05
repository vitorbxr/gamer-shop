// src/pages/admin/Users.jsx
import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  VStack,
  Badge,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiSearch, FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import UserFormModal from '../../components/admin/UserFormModal';

// Dados mockados para teste
const mockUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'USER',
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2024-02-02',
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@example.com',
    role: 'USER',
    status: 'inactive',
    createdAt: '2024-02-03',
  },
];
function Users() {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedUser(null);
    onOpen();
  };

  const handleDelete = (userId) => {
    console.log('Deletar usuário:', userId);
    // Implementar lógica de confirmação e deleção
  };

  const getRoleBadge = (role) => {
    return (
      <Badge
        colorScheme={role === 'ADMIN' ? 'purple' : 'blue'}
        variant="subtle"
        px={2}
      >
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <Badge
        colorScheme={status === 'active' ? 'green' : 'red'}
        variant="subtle"
        px={2}
      >
        {status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    );
  };
  return (
    <AdminLayout>
      <Box p={4}>
        <HStack mb={6} justify="space-between">
          <Heading size="lg">Usuários</Heading>
          <Button leftIcon={<FiUserPlus />} colorScheme="blue" onClick={handleCreate}>
            Novo Usuário
          </Button>
        </HStack>

        <Box mb={6}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Tipo</Th>
              <Th>Status</Th>
              <Th>Data de Cadastro</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{getRoleBadge(user.role)}</Td>
                <Td>{getStatusBadge(user.status)}</Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiEdit2 />}
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash2 />}
                      colorScheme="red"
                      onClick={() => handleDelete(user.id)}
                    >
                      Excluir
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <UserFormModal 
          isOpen={isOpen} 
          onClose={onClose}
          user={selectedUser}
        />
      </Box>
    </AdminLayout>
  );
}

export default Users;