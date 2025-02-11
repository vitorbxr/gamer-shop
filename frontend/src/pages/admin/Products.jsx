// src/pages/admin/Products.jsx
import React, { useState, useEffect } from 'react';
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
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/format';

function Products() {
  // Estados principais para controle dos produtos
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para controle da interface
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Hooks do Chakra UI para controle de modais e notificações
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

  // Carrega os produtos quando o componente é montado
  useEffect(() => {
    loadProducts();
  }, []);

  // Função principal para carregar produtos da API
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getAll();
      
      // Garantimos que products seja sempre um array
      setProducts(Array.isArray(data.products) ? data.products : []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos. Por favor, tente novamente.');
      setProducts([]);
      setPagination({ total: 0, pages: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para salvar ou atualizar um produto
  const handleSave = async (productData) => {
    try {
      if (selectedProduct) {
        // Atualização de produto existente
        await productService.update(selectedProduct.id, productData);
        toast({
          title: "Produto atualizado com sucesso",
          status: "success",
          duration: 2000,
        });
      } else {
        // Criação de novo produto
        await productService.create(productData);
        toast({
          title: "Produto criado com sucesso",
          status: "success",
          duration: 2000,
        });
      }
      await loadProducts(); // Recarrega a lista após salvar
      onFormClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Funções de manipulação da interface
  const handleEdit = (product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      await productService.delete(productToDelete.id);
      toast({
        title: "Produto excluído com sucesso",
        status: "success",
        duration: 2000,
      });
      await loadProducts();
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    } finally {
      onDeleteClose();
    }
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await productService.update(productId, { isActive: !currentStatus });
      await loadProducts();
      toast({
        title: `Produto ${currentStatus ? 'desativado' : 'ativado'} com sucesso`,
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Erro desconhecido",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Filtragem de produtos baseada na busca
  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <AdminLayout>
      <Box p={4}>
        {/* Exibe mensagens de erro se houver */}
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Cabeçalho com título e botão de novo produto */}
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

        {/* Campo de busca */}
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

        {/* Área principal de conteúdo */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={10}>
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
                          src={product.image || "/placeholder-image.jpg"}
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
                    <Td>{product.category?.name}</Td>
                    <Td>{product.brand?.name}</Td>
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

        {/* Modal de formulário de produto */}
        <ProductFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
          product={selectedProduct}
          onSave={handleSave}
        />

        {/* Diálogo de confirmação de exclusão */}
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