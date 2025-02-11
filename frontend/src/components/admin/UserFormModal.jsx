// src/components/admin/UserFormModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Switch,
  useToast,
  FormHelperText,
} from '@chakra-ui/react';

function UserFormModal({ isOpen, onClose, user = null, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    isActive: true,
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'USER',
        isActive: user.isActive !== false,
        password: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'USER',
        isActive: true,
        password: '',
      });
    }
  }, [user]);

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
      if (!formData.name || !formData.email) {
        throw new Error('Nome e email são obrigatórios');
      }

      if (!user && !formData.password) {
        throw new Error('Senha é obrigatória para novos usuários');
      }

      const dataToSave = { ...formData };
      if (user && !dataToSave.password) {
        delete dataToSave.password;
      }

      await onSave?.(dataToSave);
      
      toast({
        title: `Usuário ${user ? 'atualizado' : 'criado'} com sucesso!`,
        status: 'success',
        duration: 3000,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar usuário',
        description: error.message,
        status: 'error',
        duration: 3000,
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
            {user ? 'Editar Usuário' : 'Novo Usuário'}
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

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired={!user}>
                <FormLabel>{user ? 'Nova Senha' : 'Senha'}</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={user ? "Deixe em branco para manter a senha atual" : ""}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de Usuário</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </Select>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Ativo</FormLabel>
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

export default UserFormModal;