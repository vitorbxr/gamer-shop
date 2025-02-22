# GamerShop - Documentação do Projeto

## Visão Geral
GamerShop é uma plataforma de e-commerce especializada em produtos para gamers, implementada com tecnologias modernas e boas práticas de desenvolvimento.

## Informações de Acesso

### Credenciais
- **Admin Dashboard**
  - Email: admin@test.com
  - Senha: admin123

### Banco de Dados
- **MySQL**
  - URL de conexão: mysql://root:senha@localhost:3306/gamershop
  
### Email
- **Resend API**
  - Email de envio: onboarding@resend.dev (domínio padrão)

## Stack Tecnológico

### Frontend
- React com Vite
- Chakra UI para interface
- Gerenciamento de estado via Context API
- Sistema de rotas com proteção
- Axios para requisições HTTP
- Formik/Yup para validação de formulários

### Backend
- Node.js com Express
- Prisma ORM
- MySQL como banco de dados
- JWT para autenticação
- Resend para envio de emails
- Joi para validação de dados

## Funcionalidades Implementadas

### Sistema de Autenticação
- Login e registro de usuários
- Autenticação via JWT
- Middleware de proteção de rotas
- Refresh tokens
- Criptografia de senhas
- Controle de acesso baseado em roles

### Gestão de Produtos
- CRUD completo de produtos
- Upload e otimização de imagens
- Categorização e marcas
- Sistema de avaliações
- Paginação e filtros básicos

### Carrinho de Compras
- Adição/remoção de produtos
- Atualização de quantidades
- Persistência em localStorage
- Cálculo automático de totais
- Aplicação de cupons de desconto

### Sistema de Pedidos
- Fluxo completo de checkout
- Múltiplos status de pedido (Pendente, Processando, Enviado, Entregue, Cancelado)
- Gestão de endereços
- Menu de ações para pedidos (visualizar detalhes, excluir)
- Edição de dados de endereço de entrega
- Gestão de códigos de rastreio
- Exclusão de pedidos com restauração de estoque
- Diversos métodos de pagamento

### Cupons e Promoções
- CRUD de cupons
- Validação de datas e usos
- Diferentes tipos de desconto (fixo/percentual)
- Controle de uso por usuário

### Área Administrativa
- Dashboard com métricas
- Gestão completa de produtos
- Visualização e gestão de pedidos
- Relatórios básicos

### Sistema de Avaliações
- Avaliação pós-compra
- Validação de compra realizada
- Limite de uma avaliação por produto/usuário
- Exibição em produtos

### Comunicação
- Envio de emails de confirmação de pedido
- Notificações de mudança de status
- Emails de atualização de dados de envio
- Recuperação de senha
- Formatação personalizada para diferentes tipos de email

## Estrutura do Projeto

gamer-shop/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seeds/
│   └── src/
│       ├── controllers/
│       │   └── orderController.js
│       ├── middleware/
│       │   └── auth.js
│       ├── routes/
│       │   └── orderRoutes.js
│       ├── services/
│       │   ├── emailService.js
│       │   └── logService.js
│       └── utils/
└── frontend/
└── src/
├── components/
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── OrderDetailsModal.jsx
│       └── OrderActions.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/
│   └── admin/
│       └── Orders.jsx
├── services/
│   └── api.js
└── utils/
└── format.js

## Componentes Implementados

### Frontend
- **OrderDetailsModal.jsx**: Modal para visualização e edição de detalhes do pedido
  - Visualização de informações completas do pedido
  - Edição de endereço de entrega
  - Atualização de código de rastreio
  - Visualização de itens, valores e pagamento

- **OrderActions.jsx**: Menu de ações para pedidos
  - Opção para visualizar detalhes
  - Opção para excluir pedido com confirmação

- **Orders.jsx**: Página principal de gestão de pedidos
  - Listagem de todos os pedidos
  - Mudança de status com seletor dropdown
  - Solicitação de código de rastreio para pedidos enviados

### Backend
- **orderController.js**: Controlador de pedidos
  - Métodos CRUD completos
  - Gerenciamento de status
  - Atualização de dados de envio
  - Gerenciamento de código de rastreio
  - Exclusão com restauração de estoque

- **emailService.js**: Serviço de envio de emails
  - Confirmação de pedidos
  - Atualização de status
  - Notificação de alterações de dados
  - Templates HTML personalizados

## Melhorias Implementadas

### Autenticação
- Validação reforçada de senhas
- Sistema de refresh token otimizado
- Melhor gestão de sessões

### Pedidos
- Cálculo preciso de fretes
- Validação aprimorada de endereços
- Fluxo de checkout otimizado
- Interface de gerenciamento de status aprimorada
- Emails de notificação formatados
- Controle de exclusão de pedidos

### Cupons
- Validação robusta de datas
- Cálculo preciso de descontos
- Melhor controle de utilização

## Próximos Passos

### Alta Prioridade
1. Sistema avançado de pesquisa e filtros
   - Filtros por categoria, preço, marca
   - Busca por texto completo
   - Ordenação personalizada

2. Área do Cliente
   - Histórico detalhado de pedidos
   - Gestão de perfil
   - Endereços favoritos
   - Produtos favoritos

3. Melhorias no Painel Admin
   - Relatórios avançados
   - Gestão de estoque
   - Dashboard personalizado
   - Exportação de dados

### Média Prioridade
- Sistema de notificações em tempo real
- Integração com mais métodos de pagamento
- Sistema de produtos relacionados
- Cache avançado para melhor performance

### Baixa Prioridade
- Sistema de fidelidade
- Chat de suporte
- Área de wishlist
- Blog integrado

## Considerações Técnicas

### Performance
- Otimização de imagens implementada
- Sistema de paginação eficiente
- Cache estratégico
- Lazy loading de componentes

### Segurança
- Rotas protegidas
- Validação constante de tokens
- Senhas criptografadas
- Controle granular de permissões

### Escalabilidade
- Arquitetura modular
- Boas práticas de código
- Documentação atualizada
- Testes unitários básicos
