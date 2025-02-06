// src/pages/admin/Products.jsx
import React, { useState, useEffect } from 'react';
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
  InputGroup,
  InputLeftElement,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  useDisclosure,
  Image,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical, 
  FiPlus 
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductFormModal from '../../components/admin/ProductFormModal';
import { formatPrice } from '../../utils/format.js';
import { productService } from '../../services/productService';

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const toast = useToast();
  const { 
    isOpen: isFormOpen, 
    onOpen: onFormOpen, 
    onClose: onFormClose 
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.response?.data?.error || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (productData) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.id, productData);
        toast({
          title: "Produto atualizado",
          status: "success",
          duration: 2000,
        });
      } else {
        await productService.create(productData);
        toast({
          title: "Produto criado",
          status: "success",
          duration: 2000,
        });
      }
      loadProducts();
      onFormClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: error.response?.data?.error || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleDelete = async (product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      await productService.delete(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast({
        title: "Produto excluído",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onDeleteClose();
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        description: error.response?.data?.error || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await productService.update(productId, { isActive: !currentStatus });
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, isActive: !currentStatus } : p
      ));
      toast({
        title: `Produto ${currentStatus ? 'desativado' : 'ativado'}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: error.response?.data?.error || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <AdminLayout>
      <Box p={4}>
        <HStack mb={6} justify="space-between">
          <Heading size="lg">Produtos</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleNewProduct}
          >
            Novo Produto
          </Button>
        </HStack>

        <Box mb={6}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <Spinner size="xl" />
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th>Categoria</Th>
                  <Th>Marca</Th>
                  <Th isNumeric>Preço</Th>
                  <Th isNumeric>Estoque</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>
                      <HStack>
                        <Image
                          src={product.image}
                          alt={product.name}
                          boxSize="40px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <Box>
                          <Text fontWeight="medium">{product.name}</Text>
                          <Text fontSize="sm" color="gray.500">
                            ID: {product.id}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>{product.category}</Td>
                    <Td>{product.brand}</Td>
                    <Td isNumeric>{formatPrice(product.price)}</Td>
                    <Td isNumeric>
                      <Badge
                        colorScheme={product.stock > 0 ? "green" : "red"}
                      >
                        {product.stock}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={product.isActive ? "green" : "red"}
                      >
                        {product.isActive ? "Ativo" : "Inativo"}
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
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </MenuItem>
                          <MenuItem
                            icon={product.isActive ? <FiTrash2 /> : <FiPlus />}
                            onClick={() => handleToggleStatus(product.id, product.isActive)}
                          >
                            {product.isActive ? "Desativar" : "Ativar"}
                          </MenuItem>
                          <MenuItem 
                            icon={<FiTrash2 />}
                            color="red.500"
                            onClick={() => handleDelete(product)}
                          >
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        <ProductFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
          product={selectedProduct}
          onSave={handleSave}
        />

        <AlertDialog
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          leastDestructiveRef={undefined}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>
                Excluir Produto
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onDeleteClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" ml={3} onClick={confirmDelete}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </AdminLayout>
  );
}

export default Products;