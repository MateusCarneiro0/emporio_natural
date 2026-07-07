# Empório Natural

Bem-vindo ao projeto da loja virtual Empório Natural, uma aplicação web desenvolvida em React com Vite para oferecer uma experiência moderna de compra de produtos naturais, saudáveis e com identidade local.

A proposta da aplicação é unir uma interface bonita e responsiva com funcionalidades de catálogo, busca, autenticação, carrinho de compras e navegação por páginas protegidas, criando uma experiência completa para o usuário.

## ✨ Sobre o projeto

O Empório Natural é uma loja online voltada para produtos naturais, com foco em qualidade, bem-estar e comércio local. O projeto foi pensado como uma aplicação de e-commerce com uma interface inspirada em uma marca acolhedora e moderna, com destaque para:

- apresentação da marca na página inicial;
- catálogo de produtos com busca por nome;
- página de detalhes do produto;
- carrinho de compras com adição, remoção e finalização;
- sistema de login e cadastro de usuários;
- rotas protegidas para garantir acesso a áreas exclusivas.

## 🛍️ Funcionalidades

- Página inicial com seções informativas sobre a loja;
- Catálogo de produtos com pesquisa dinâmica;
- Navegação entre produtos e detalhes;
- Carrinho de compras com controle de estado;
- Autenticação de usuários com login e cadastro;
- Proteção de rotas para usuários autenticados;
- Interface estilizada com CSS Modules;
- Testes automatizados para validação de regras de produtos e carrinho.

## 🧰 Tecnologias utilizadas

- React
- Vite
- React Router DOM
- Redux Toolkit
- CSS Modules
- AOS para animações
- Vitest e Testing Library para testes

## 📁 Estrutura principal do projeto

```bash
src/
├── api/                # integração com API e requisições
├── app/                # configuração do store Redux
├── Components/         # componentes reutilizáveis da interface
├── Pages/              # páginas principais da aplicação
├── slices/             # reducers e lógica de estado com Redux Toolkit
├── test/               # testes automatizados
├── utils/              # funções utilitárias
└── main.jsx            # ponto de entrada da aplicação
```

## ▶️ Como executar localmente

### Pré-requisitos

- Node.js instalado
- npm ou yarn

### Instalação

```bash
npm install
```

### Executar em modo de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível no navegador através do endereço local informado pelo Vite.

### Gerar build de produção

```bash
npm run build
```

### Executar testes

```bash
npm run test
```

## 🔐 Variáveis de ambiente

O projeto utiliza variáveis de ambiente para configurar a API e outros dados importantes. Crie um arquivo `.env` na raiz do projeto com valores semelhantes a estes:

```env
VITE_API_URL=sua_url_da_api
VITE_NUMBER_PHONE=seu_numero
```

## 🧪 Testes

O projeto conta com testes para validar regras importantes de negócio, como:

- validação de produtos no carrinho;
- comportamento esperado de produtos na aplicação.

## 💡 Observações

Esta aplicação depende de uma API para gerenciar usuários, produtos e carrinho de compras. Para uma experiência completa, é recomendado configurar corretamente a variável `VITE_API_URL` antes de rodar o projeto.

## 📌 Objetivo

O Empório Natural foi desenvolvido como um projeto de estudo e demonstração de uma loja virtual moderna, com foco em experiência do usuário, organização de componentes e gerenciamento de estado.
