// src/components/admin/OrderActions.jsx
import React, { useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import { ViewIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import api from '../../services/api';

const OrderActions = ({ order, onView, onRefresh }) => {
  const toast = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelRef = React.useRef();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/orders/${order.id}`);
      
      toast({
        title: 'Pedido excluído com sucesso',
        status: 'success',
        duration: 3000,
      });
      
      setIsDeleteDialogOpen(false);
      onRefresh?.();
    } catch (error) {
      toast({
        title: 'Erro ao excluir pedido',
        description: error.response?.data?.message || 'Ocorreu um erro ao excluir o pedido',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Opções do pedido"
          icon={<InfoIcon />}
          variant="outline"
          size="sm"
        />
        <MenuList>
          <MenuItem icon={<ViewIcon />} onClick={onView}>
            Visualizar Detalhes
          </MenuItem>
          <MenuItem icon={<DeleteIcon />} onClick={() => setIsDeleteDialogOpen(true)} color="red.500">
            Excluir Pedido
          </MenuItem>
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Pedido
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)} isDisabled={isDeleting}>
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3}
                isLoading={isDeleting}
                loadingText="Excluindo"
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default OrderActions;