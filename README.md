# 🌿 Empório Natural

Loja virtual de produtos naturais desenvolvida em **React + Vite**, com foco em qualidade, bem-estar e comércio local. O projeto une uma interface bonita e responsiva a funcionalidades completas de e-commerce: catálogo, busca, autenticação com sessão persistente e carrinho de compras.

A aplicação consome uma **API própria** (Flask/Python), que fica na pasta **`Área de trabalho/api_products`** — veja a seção [🖥️ API](#-api) para saber como configurá-la e executá-la.

---

## ✨ Funcionalidades

- **Página inicial** com apresentação da marca, seções informativas e animações (AOS);
- **Catálogo de produtos** carregado da API, com busca dinâmica por nome;
- **Página de detalhes do produto** com quantidade (inclusive decimais, para produtos vendidos por kg);
- **Carrinho de compras** com adicionar, editar, remover e pagar (limpar), com feedback de operação em tempo real;
- **Autenticação completa**: cadastro, login e logout com tokens JWT (*access token* em cookie + *refresh token*);
- **Sessão persistente**: ao recarregar a página, a sessão é restaurada (`/users/me`) e o *refresh token* renova o *access token* automaticamente quando ele expira;
- **Rotas protegidas** para áreas exclusivas de usuários autenticados;
- **Interface responsiva** com versões dedicadas para desktop e mobile (menu hambúrguer);
- **Página 404** e tratamento de erros com mensagens amigáveis;
- **Testes automatizados**: unitários/integração (Vitest) e ponta a ponta (Playwright).

## 🧰 Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, Vite, React Router DOM |
| Estado | Redux Toolkit, React Redux |
| Estilo | CSS Modules, MUI (Material UI), AOS (animações) |
| Testes | Vitest + Testing Library (unitários), Playwright (E2E) |
| CI/CD | GitHub Actions, Vercel |

## 📁 Estrutura principal do projeto

```bash
src/
├── api/                # integração com a API (requestJson, thunks de auth/cart/products)
├── app/                # configuração do store Redux
├── Components/         # componentes reutilizáveis da interface
├── Pages/              # páginas principais (Home, Products, Cart, Login, Signup, NotFound)
├── slices/             # reducers e lógica de estado com Redux Toolkit
├── test/               # testes unitários e de integração (Vitest)
├── e2e/                # testes ponta a ponta (Playwright)
├── utils/              # funções utilitárias e validadores (ProductChecker)
├── AppBootstrap.jsx    # inicialização: carrega produtos e restaura a sessão
├── secretKeys.js       # leitura das variáveis de ambiente
└── main.jsx            # ponto de entrada da aplicação
```

---

## ▶️ Como executar localmente

### Pré-requisitos

- **Node.js 22+** (definido em `engines` no `package.json`);
- npm;
- A API rodando (veja a seção [🖥️ API](#-api)).

### Instalação

```bash
npm install
```

### Executar em modo de desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

### Gerar build de produção

```bash
npm run build
```

### Lint

```bash
npm run lint
```

---

## 🖥️ API

A aplicação depende de uma API própria, que **não faz parte deste repositório**. Ela está localizada na pasta:

```
~/Área de trabalho/api_products
```

> Em sistemas em português, essa é a pasta **`Área de trabalho`** (Desktop). Se estiver em outro idioma, use o caminho equivalente da sua máquina.

### Sobre a API

- **Stack:** Python 3 + **Flask 3**, SQLAlchemy (SQLite por padrão, PostgreSQL via `DATABASE_URL`), Redis (gerenciamento de sessão/tokens) e PyJWT;
- **Autenticação:** emite *access token* (cookie curto) e *refresh token*; rota `/refresh` renova o *access token* expirado;
- **CORS:** já configurada para aceitar `http://localhost:5173` (com `credentials: include`), pronta para o Vite.

### Como executar a API

```bash
cd ~/Área\ de\ trabalho/api_products

# 1. Crie e ative o ambiente virtual (já existe um na pasta `venv/`)
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Rode a aplicação (porta padrão 5000, configurável via PORT)
python app.py
```

A API ficará disponível em `http://localhost:5000`. Configure `VITE_API_URL` no frontend apontando para ela (veja abaixo).

### Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/:id` | Busca um produto pelo id |
| POST | `/users/createnewuser` | Cria um novo usuário (com carrinho vazio) |
| POST | `/users/login` | Autentica e devolve access/refresh tokens |
| GET | `/users/me` | Restaura a sessão a partir dos cookies |
| GET/POST/DELETE | `/users/cart` | Consulta, adiciona e remove produtos do carrinho |
| DELETE | `/users/clearCart` | Limpa o carrinho (finalização) |
| POST | `/refresh` | Renova o access token expirado |
| DELETE | `/users/logout` | Encerra a sessão |

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (use o [`.env.example`](.env.example) como modelo):

```env
VITE_API_URL=http://localhost:5000   # URL da API (Área de trabalho/api_products)
VITE_NUMBER_PHONE=seu_numero          # telefone exibido no rodapé
VITE_DEV=true                         # habilita o modo de desenvolvimento
```

> ⚠️ Os arquivos `.env` não são versionados. O CI (GitHub Actions) usa o secret `VITE_API_URL` para rodar os testes que dependem da API.

---

## 🧪 Testes

O projeto tem **duas camadas de testes**:

| Tipo | Ferramenta | Onde ficam | Comando |
|---|---|---|---|
| Unitários / integração | Vitest | `src/test/` | `npm test` |
| Ponta a ponta (E2E) | Playwright | `src/e2e/` | `npx playwright test` |

### 1. Testes com Vitest (`npm test`)

Cobrem a lógica pura e os reducers do Redux: validação de produtos (`ProductChecker`), regras do carrinho (adicionar, editar, remover, pagar) e fluxos de autenticação (cadastro, login, logout, erros).

**Como executar:**

```bash
npm test               # roda uma vez
npm test -- --watch    # modo watch durante o desenvolvimento
```

**Como criar um novo teste:**

1. Crie um arquivo na pasta **`src/test/`** (a configuração em `vitest.config.js` só inclui arquivos desse diretório, ex.: `src/test/meuTeste.test.js`);
2. Importe `describe`, `it` e `expect` de `vitest`;
3. Para testar reducers, monte um store real com `configureStore` do Redux Toolkit e use os action creators dos slices:

```js
import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { addProductCart } from "../slices/cartSlice";

const initializeStore = () =>
  configureStore({
    reducer: { cart: cartReducer },
  });

describe("Meu novo teste", () => {
  it("adiciona um produto ao carrinho", () => {
    const store = initializeStore();
    store.dispatch(addProductCart({ id: "1", nome: "Melancia", quantity: 3 }));
    expect(store.getState().cart.cartProducts.length).toBe(1);
  });
});
```

> Dica: testes que chamam a API (`requestJson`) exigem a API rodando e o `VITE_API_URL` configurado — veja os exemplos em `src/test/auth.test.js` e `src/test/products.test.js`. Para lógica pura, não dependem de nada externo.

### 2. Testes E2E com Playwright (`npx playwright test`)

Cobrem os fluxos completos do usuário no navegador (desktop e mobile): criar conta, login, sessão persistente, adicionar/remover/pagar produtos no carrinho, renovação e expiração de tokens.

**Pré-requisitos:**

- API rodando (seção [🖥️ API](#-api)) com `VITE_API_URL` configurado no `.env`;
- Navegadores instalados: `npx playwright install`.

**Como executar:**

```bash
npx playwright test                     # roda todos os specs
npx playwright test --project=chromium  # somente Chromium
npx playwright test src/e2e/auth.spec.js  # um arquivo específico
npx playwright test --headed            # com navegador visível
```

O `playwright.config.js` sobe o servidor Vite automaticamente (`npm run dev` em `http://localhost:5173`) e roda os testes em Chromium, Firefox e WebKit.

**Como criar um novo teste E2E:**

1. Crie um arquivo em **`src/e2e/`** (ex.: `src/e2e/meuFluxo.spec.js`);
2. Reutilize os helpers de `src/e2e/constants_e2e.js` (`goToLink`, `loginUser`, `addProductInCart`) para navegar e autenticar;

```js
import { test, expect } from "@playwright/test";
import { loginUser } from "./constants_e2e";

test("Meu novo fluxo", async ({ page }) => {
  await loginUser(page);
  await page.goto("/produtos");
  await expect(page.getByText(/encontrados/i)).toBeVisible();
});
```

> Os testes E2E criam usuários reais na API com nomes aleatórios (`TEST_...`), então podem ser executados repetidamente sem conflito. Testes que dependem de sessão usam `test.describe.configure({ mode: "serial" })` para rodar em sequência.

### CI (GitHub Actions)

Há dois workflows na pasta `.github/workflows/`:

- **`vitest.yml`** — roda `npm test` a cada push/PR para `main`, usando o secret `VITE_API_URL`;
- **`playwright.yml`** — instala as dependências e os navegadores do Playwright e roda os testes E2E, subindo o relatório HTML como artefato.

Para que a CI funcione, configure o secret **`VITE_API_URL`** nas *Settings > Secrets and variables > Actions* do repositório.

---

## 🚀 Deploy

A aplicação é deployada na **Vercel** (configuração em [`vercel.json`](vercel.json), com rewrites para o SPA e cabeçalhos de segurança). O `VITE_API_URL` deve apontar para a API em produção.

---

## 📌 Objetivo

O Empório Natural foi desenvolvido como projeto de estudo e demonstração de uma loja virtual moderna, com foco em experiência do usuário, organização de componentes, gerenciamento de estado com Redux Toolkit e cobertura de testes nas duas camadas (unitária e E2E).