// src/pages/admin/Coupons.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Badge,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import AdminLayout from '../../components/admin/AdminLayout';
import CouponModal from '../../components/admin/CouponModal';
import api from '../../services/api';
import { formatDate } from '../../utils/format';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar cupons',
        description: error.response?.data?.message || 'Ocorreu um erro ao carregar os cupons',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedCoupon(null);
    onOpen();
  };

  const handleSave = async (couponData) => {
    try {
      if (selectedCoupon) {
        await api.put(`/coupons/${selectedCoupon.id}`, couponData);
        toast({
          title: 'Cupom atualizado',
          status: 'success',
          duration: 2000,
        });
      } else {
        await api.post('/coupons', couponData);
        toast({
          title: 'Cupom criado',
          status: 'success',
          duration: 2000,
        });
      }
      loadCoupons();
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar cupom',
        description: error.response?.data?.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (!coupon.isActive) return { label: 'Inativo', color: 'red' };
    if (now < startDate) return { label: 'Agendado', color: 'yellow' };
    if (now > endDate) return { label: 'Expirado', color: 'gray' };
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { label: 'Esgotado', color: 'orange' };
    }
    return { label: 'Ativo', color: 'green' };
  };

  return (
    <AdminLayout>
      <Box p={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Cupons de Desconto</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleAdd}
          >
            Novo Cupom
          </Button>
        </Box>

        <Card>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Código</Th>
                <Th>Tipo</Th>
                <Th>Valor</Th>
                <Th>Validade</Th>
                <Th>Usos</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {coupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return (
                  <Tr key={coupon.id}>
                    <Td fontWeight="bold">{coupon.code}</Td>
                    <Td>
                      {coupon.type === 'PERCENTAGE' ? 'Percentual' : 'Valor Fixo'}
                    </Td>
                    <Td>
                      {coupon.type === 'PERCENTAGE' 
                        ? `${coupon.value}%`
                        : `€${coupon.value.toFixed(2)}`}
                    </Td>
                    <Td>
                      {formatDate(coupon.startDate)} até {formatDate(coupon.endDate)}
                    </Td>
                    <Td>
                      {coupon.usedCount}
                      {coupon.maxUses && ` / ${coupon.maxUses}`}
                    </Td>
                    <Td>
                      <Badge colorScheme={status.color}>
                        {status.label}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton
                        icon={<EditIcon />}
                        variant="ghost"
                        onClick={() => handleEdit(coupon)}
                        aria-label="Editar cupom"
                      />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Card>

        <CouponModal
          isOpen={isOpen}
          onClose={onClose}
          coupon={selectedCoupon}
          onSave={handleSave}
        />
      </Box>
    </AdminLayout>
  );
}

export default Coupons;