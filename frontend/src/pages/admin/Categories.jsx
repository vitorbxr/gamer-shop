// src/pages/admin/Categories.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Input,
  IconButton,
  useToast,
  useDisclosure,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  VStack,
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical 
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

// Dados mockados para teste
const mockCategories = [
  {
    id: 1,
    name: "Mouse",
    slug: "mouse",
    description: "Mouses gamers e profissionais",
    isActive: true,
    productCount: 12
  },
  {
    id: 2,
    name: "Teclado",
    slug: "keyboard",
    description: "Teclados mecânicos e membrana",
    isActive: true,
    productCount: 8
  },
  {
    id: 3,
    name: "Headset",
    slug: "headset",
    description: "Headsets e fones de ouvido",
    isActive: false,
    productCount: 5
  }
];

function CategoryFormModal({ isOpen, onClose, category = null, onSave }) {
  const [formData, setFormData] = useState(category || {
    name: '',
    description: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name) {
        throw new Error('Nome da categoria é obrigatório');
      }

      await onSave({
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      });

      toast({
        title: `Categoria ${category ? 'atualizada' : 'criada'} com sucesso!`,
        status: 'success',
        duration: 2000
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar categoria',
        description: error.message,
        status: 'error',
        duration: 2000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Ativa</FormLabel>
                <Switch
                  name="isActive"
                  isChecked={formData.isActive}
                  onChange={(e) => handleChange({
                    target: {
                      name: 'isActive',
                      type: 'checkbox',
                      checked: e.target.checked
                    }
                  })}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();
  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();

  const handleSave = async (categoryData) => {
    if (selectedCategory) {
      // Atualizar categoria existente
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...categoryData, id: cat.id, productCount: cat.productCount }
          : cat
      ));
    } else {
      // Criar nova categoria
      const newCategory = {
        ...categoryData,
        id: categories.length + 1,
        productCount: 0
      };
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    onFormOpen();
  };

  const handleDelete = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category.productCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Esta categoria possui produtos vinculados",
        status: "error",
        duration: 2000
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast({
      title: "Categoria excluída",
      status: "success",
      duration: 2000
    });
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    onFormOpen();
  };

  const handleToggleStatus = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  return (
    <AdminLayout>
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Categorias</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleNewCategory}
          >
            Nova Categoria
          </Button>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Produtos</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map((category) => (
                <Tr key={category.id}>
                  <Td fontWeight="medium">{category.name}</Td>
                  <Td>{category.description}</Td>
                  <Td isNumeric>{category.productCount}</Td>
                  <Td>
                    <Badge
                      colorScheme={category.isActive ? "green" : "red"}
                    >
                      {category.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<FiEdit2 />}
                          onClick={() => handleEdit(category)}
                        >
                          Editar
                        </MenuItem>
                        <MenuItem
                          icon={category.isActive ? <FiTrash2 /> : <FiPlus />}
                          onClick={() => handleToggleStatus(category.id)}
                        >
                          {category.isActive ? "Desativar" : "Ativar"}
                        </MenuItem>
                        {category.productCount === 0 && (
                          <MenuItem 
                            icon={<FiTrash2 />}
                            color="red.500"
                            onClick={() => handleDelete(category.id)}
                          >
                            Excluir
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <CategoryFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
          category={selectedCategory}
          onSave={handleSave}
        />
      </Box>
    </AdminLayout>
  );
}

export default Categories;