// src/components/checkout/DeliveryForm.jsx
import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  GridItem,
  Select,
  useToast
} from '@chakra-ui/react';

function DeliveryForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    receiver: ''
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchCEP = async () => {
    if (formData.cep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf
      }));
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente mais tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação básica
    const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state', 'receiver'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isRequired>
              <FormLabel>CEP</FormLabel>
              <Input
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleSearchCEP}
                placeholder="00000-000"
                maxLength={8}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <FormControl isRequired>
              <FormLabel>Rua</FormLabel>
              <Input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Nome da rua"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isRequired>
              <FormLabel>Número</FormLabel>
              <Input
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Número"
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl>
              <FormLabel>Complemento</FormLabel>
              <Input
                name="complement"
                value={formData.complement}
                onChange={handleChange}
                placeholder="Apto, Bloco, etc."
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired>
              <FormLabel>Bairro</FormLabel>
              <Input
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Bairro"
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired>
              <FormLabel>Cidade</FormLabel>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Cidade"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl isRequired>
              <FormLabel>Estado</FormLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Selecione o estado"
              >
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </Select>
            </FormControl>
          </GridItem>
        </Grid>

        <FormControl isRequired>
          <FormLabel>Nome do Recebedor</FormLabel>
          <Input
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            placeholder="Nome completo de quem vai receber"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
        >
          Continuar para Pagamento
        </Button>
      </VStack>
    </form>
  );
}

export default DeliveryForm;