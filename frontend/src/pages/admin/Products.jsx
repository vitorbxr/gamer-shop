// src/pages/admin/Products.jsx
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

// Dados mockados para teste
const mockProducts = [
  {
    id: 1,
    name: "Mouse Gamer RGB Pro X",
    price: 299.99,
    category: "mouse",
    brand: "Razer",
    stock: 15,
    image: "/placeholder-image.jpg",
    isActive: true,
    description: "Mouse gamer profissional com sensor óptico de alta precisão",
    specifications: [
      "Sensor óptico de 16.000 DPI",
      "8 botões programáveis"
    ],
    features: [
      "RGB Chroma",
      "Polling rate de 1000Hz"
    ]
  },
  {
    id: 2,
    name: "Teclado Mecânico RGB",
    price: 499.99,
    category: "keyboard",
    brand: "Corsair",
    stock: 8,
    image: "/placeholder-image.jpg",
    isActive: true,
    description: "Teclado mecânico com switches Cherry MX",
    specifications: [
      "Switches Cherry MX Red",
      "Layout ABNT2"
    ],
    features: [
      "RGB por tecla",
      "Apoio de pulso removível"
    ]
  }
];
function Products() {
    const [products, setProducts] = useState(mockProducts);
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
  
    const handleSave = async (productData) => {
      try {
        if (selectedProduct) {
          // Atualizar produto existente
          setProducts(prev => prev.map(p => 
            p.id === selectedProduct.id ? { ...productData, id: p.id } : p
          ));
        } else {
          // Criar novo produto
          const newProduct = {
            ...productData,
            id: products.length + 1
          };
          setProducts(prev => [...prev, newProduct]);
        }
      } catch (error) {
        throw new Error('Erro ao salvar produto');
      }
    };
  
    const handleEdit = (product) => {
      setSelectedProduct(product);
      onFormOpen();
    };
  
    const handleDelete = (product) => {
      setProductToDelete(product);
      onDeleteOpen();
    };
  
    const confirmDelete = () => {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast({
        title: "Produto excluído",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onDeleteClose();
    };
  
    const handleNewProduct = () => {
      setSelectedProduct(null);
      onFormOpen();
    };
  
    const handleToggleStatus = (productId, currentStatus) => {
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, isActive: !currentStatus } : p
      ));
      toast({
        title: `Produto ${currentStatus ? 'desativado' : 'ativado'}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };
  
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <AdminLayout>
          <Box>
            <HStack justify="space-between" mb={6}>
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
{/* Modal de Formulário */}
<ProductFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
          product={selectedProduct}
          onSave={handleSave}
        />

        {/* Diálogo de Confirmação de Exclusão */}
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