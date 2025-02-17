// src/components/admin/CouponModal.jsx
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
  Stack,
  Switch,
  FormHelperText,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';

const initialState = {
  code: '',
  type: 'PERCENTAGE',
  value: '',
  minValue: '',
  maxUses: '',
  startDate: '',
  endDate: '',
  isActive: true
};

const CouponModal = ({ isOpen, onClose, coupon, onSave }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (coupon) {
      // Formatar datas para o formato esperado pelo input date
      const startDate = new Date(coupon.startDate)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(coupon.endDate)
        .toISOString()
        .split('T')[0];

      setFormData({
        ...coupon,
        startDate,
        endDate
      });
    } else {
      setFormData(initialState);
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      value: parseFloat(formData.value),
      minValue: formData.minValue ? parseFloat(formData.minValue) : null,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : null
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {coupon ? 'Editar Cupom' : 'Novo Cupom'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Código</FormLabel>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Ex: SUMMER2025"
                  textTransform="uppercase"
                />
                <FormHelperText>
                  Código que o cliente irá utilizar
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tipo de Desconto</FormLabel>
                <Select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="PERCENTAGE">Percentual (%)</option>
                  <option value="FIXED">Valor Fixo (€)</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Valor do Desconto</FormLabel>
                <InputGroup>
                  <Input
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder={formData.type === 'PERCENTAGE' ? "10" : "5.99"}
                    type="number"
                    step={formData.type === 'PERCENTAGE' ? "1" : "0.01"}
                  />
                  <InputRightAddon>
                    {formData.type === 'PERCENTAGE' ? '%' : '€'}
                  </InputRightAddon>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Valor Mínimo da Compra</FormLabel>
                <InputGroup>
                  <Input
                    name="minValue"
                    value={formData.minValue}
                    onChange={handleChange}
                    placeholder="50.00"
                    type="number"
                    step="0.01"
                  />
                  <InputRightAddon>€</InputRightAddon>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Limite de Usos</FormLabel>
                <Input
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  placeholder="100"
                  type="number"
                />
                <FormHelperText>
                  Deixe em branco para usos ilimitados
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Data de Início</FormLabel>
                <Input
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  type="date"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Data de Término</FormLabel>
                <Input
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  type="date"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Cupom Ativo
                </FormLabel>
                <Switch
                  name="isActive"
                  isChecked={formData.isActive}
                  onChange={handleChange}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit">
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CouponModal;