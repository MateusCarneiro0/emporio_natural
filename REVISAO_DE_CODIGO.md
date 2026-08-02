# Relatório de Revisão de Código — Empório Natural

- **Repositório:** `emporio_natural` (branch `main`, commit `2f1eeda`)
- **Data da revisão:** 26/07/2026
- **Stack:** React 18 + Vite 4 + Redux Toolkit + React Router 7 + CSS Modules
- **Escopo:** todo o diretório `src/`, configurações de build/lint/deploy e dependências (~3.000 linhas)

## 1. Resumo executivo

O projeto tem uma organização de pastas clara (`api/`, `slices/`, `Components/`, `Pages/`, `utils/`), usa lazy loading de rotas, CSS Modules e possui testes automatizados que passam. A base é sólida para um projeto de estudo.

Por outro lado, a revisão encontrou **3 defeitos críticos** que quebram a aplicação em cenários reais (tela de carregamento infinita quando a API falha, laço infinito de requisições e ausência total de autenticação real), além de vários erros de fluxo assíncrono nos thunks (validações fora do `try`, gerando *unhandled promise rejections*).

### Verificações executadas

| Verificação | Resultado |
|---|---|
| `npm test` | ✅ 2 arquivos, 6 testes passando |
| `npm run lint` | ✅ sem erros/avisos |
| `npm install` | ⚠️ 638 pacotes, peer dependency incompatível (vitest 4 × vite 4) |
| `npm audit` | ⚠️ 7 vulnerabilidades (5 altas, 2 moderadas) |

### Contagem de achados

| Severidade | Quantidade |
|---|---|
| 🔴 Crítica | 4 |
| 🟠 Alta | 9 |
| 🟡 Média | 17 |
| 🔵 Baixa | 24 |

> **Revisão cruzada:** quatro revisores independentes auditaram o código sem acesso a este relatório, e um quinto o auditou com a instrução de refutá-lo. Os achados críticos foram **confirmados separadamente por três deles**, e a condição de corrida de A3 foi comprovada lendo o fonte do React Router (`<Navigate>` age dentro de um `useEffect`, logo o efeito do filho dispara antes do efeito do pai). A seção 6 reúne o que essa segunda passagem acrescentou; a **seção 7** registra o placar da validação adversarial (22 confirmados, 4 exagerados, 0 incorretos) e as recalibrações de severidade — incluindo **três afirmações da versão inicial que foram refutadas e corrigidas** (ver M2, M3 e a nota em M6).

---

## 2. Achados críticos

### 🔴 C1 — Aplicação trava em tela de carregamento permanente quando a API falha

**Arquivo:** `src/slices/authSlice.js:74-98` · `src/AppBootstrap.jsx:24-25`

O `getLocalStorage.pending` liga `isLoadingGetStorage = true`, e o caso `fulfilled` desliga a flag. **O caso `rejected` nunca desliga.**

```js
.addCase(getLocalStorage.rejected, (state) => {
  state.isLoading = false;
  state.isAuthenticated = false;
  state.authUser = "";
  state.authUserId = "";
  // isLoadingGetStorage continua true para sempre
});
```

Como `AppBootstrap` bloqueia toda a árvore de componentes enquanto `isLoadingGetStorage` for verdadeiro, qualquer usuário que já tenha feito login (id no `localStorage`) e abra o site com a API fora do ar, com internet instável ou com o id inválido fica preso no `SpinnerFullScreen` **indefinidamente** — sem mensagem de erro e sem forma de navegar.

**Correção:** adicionar `state.isLoadingGetStorage = false;` no caso `rejected`.

---

### 🔴 C2 — Laço infinito de requisições quando a lista de produtos vem vazia

**Arquivo:** `src/AppBootstrap.jsx:14-16` · `src/slices/productsSlice.js:23-28`

```js
useEffect(() => {
  if (products.length === 0) dispatch(fetchProducts());
}, [products, dispatch]);
```

O reducer `receiveProducts` faz `sta.products = act.payload.filter(...)`, e o Immer sempre gera **uma nova referência de array** nessa atribuição — mesmo que o resultado seja `[]`. Logo, se a API retornar uma lista vazia (ou se todos os produtos forem reprovados por `verifyProduct`), o efeito dispara de novo, refaz o fetch, gera nova referência, e assim por diante: **requisições infinitas em loop**, travando o navegador e sobrecarregando o servidor.

**Correção:** trocar a dependência por uma primitiva e um controle de "já buscou":

```js
const hasFetched = useRef(false);
useEffect(() => {
  if (!hasFetched.current) {
    hasFetched.current = true;
    dispatch(fetchProducts());
  }
}, [dispatch]);
```

---

### 🔴 C3 — Não existe autenticação real: qualquer pessoa pode se passar por outro usuário

**Arquivos:** `src/slices/authSlice.js:32,41` · `src/api/localStorageThunk.js:9-12` · `src/Components/protectedRoutes/AuthProtected.jsx`

O único artefato de sessão é o **id do usuário em texto puro** no `localStorage`, e a "revalidação" é um `GET /users/fetch/{id}` sem qualquer token, assinatura ou cookie:

```js
localStorage.setItem(idKey, JSON.stringify(action.payload.id));
// ...
const id = JSON.parse(localStorage.getItem(idKey));
const data = await requestJson(`/users/fetch/${id}`);
```

Consequências:

1. Trocar manualmente o valor no `localStorage` pelo id de outro usuário concede acesso completo à conta dele (carrinho, dados, "pagamento").
2. Todas as rotas de carrinho (`users/{userId}/addproductcart`, `removeProductCart`, `clearCart`) usam esse id como única credencial — ou seja, a API aceita operações em qualquer conta.
3. `AuthProtected` só protege a UI; não há proteção alguma no transporte.

4. A credencial **nunca expira** e fica em `localStorage`, legível por qualquer script da origem. O `logout` (`authSlice.js:50-58`) apenas apaga a chave local, sem invalidação no servidor — então um XSS ou uma dependência comprometida (`aos`, `@mui/*`, `react-loader-spinner`) que leia `localStorage.getItem("id_EMPORIONaTuRaL")` obtém acesso vitalício à conta.

**Correção:** emitir um token no login (JWT de curta duração ou cookie `HttpOnly; Secure; SameSite=Lax`), enviar `Authorization` em todas as requisições autenticadas via `requestJson`, validar o dono do recurso no servidor e expor um endpoint de revogação chamado pelo `logout`. Se o backend for parte do escopo do projeto, esta é a mudança de maior prioridade.

---

### 🔴 C4 — Cadastro com resposta incompleta grava `"undefined"` no `localStorage` e tranca o usuário para sempre

**Arquivos:** `src/api/authApi.js:42-44` · `src/slices/authSlice.js:32` · `src/api/localStorageThunk.js:9`

`createNewUser` desestrutura `const { id, user: createdUser, cart } = data` e despacha a ação **sem validar `id`** — ao contrário de `loginUser`, que valida em `authApi.js:86` (`Array.isArray(cart) && id && user`). Se a API responder 200 sem `id`, o reducer executa `localStorage.setItem(idKey, JSON.stringify(undefined))`.

Verificado em execução:

```
JSON.stringify(undefined)  →  undefined        (o valor, não uma string)
localStorage grava          →  "undefined"     (string literal, por coerção)
JSON.parse("undefined")     →  SyntaxError: "undefined" is not valid JSON
```

**Cenário de falha:** no carregamento seguinte, `localStorageThunk.js:9` lança `SyntaxError` → `rejectWithValue` → `getLocalStorage.rejected` → **C1** (spinner permanente). E aqui está o agravante: o único código que limpa a chave é o `logout` (`authSlice.js:57`), que exige uma interface que **nunca chega a renderizar**. O usuário fica travado de forma definitiva — nem recarregar resolve; só limpar o `localStorage` manualmente pelo DevTools.

Isto transforma C1 de "falha transitória enquanto a API está fora" em **lockout permanente**, e é a razão de este item ser crítico por si só.

**Correção:** validar `id` e `user` antes de despachar em `createNewUser` (espelhando o que `loginUser` já faz) e envolver o `JSON.parse` do thunk em `try/catch` que remova a chave corrompida.

---

## 3. Achados de severidade alta

### 🟠 A1 — Validações lançam exceção fora do `try`, gerando rejeições não tratadas

**Arquivos:** `src/api/cartApi.js:24,56,58` · `src/api/authApi.js:69-73`

```js
// cartApi.js — addProductCart
verifyProductCart(product);   // fora do try
dispatch({ type: "cart/loadingCart" });
try { ... } catch (err) { ... }
```

Quando `verifyProductCart` lança `ProductNotFound`, nada captura o erro: o thunk rejeita, o Redux nunca recebe `cart/rejected`, o usuário não vê mensagem alguma e o console registra um *unhandled promise rejection*. O mesmo ocorre em `deleteProductCart` (linhas 56 e 58) e em `loginUser` (`authApi.js:69-73`, o `EnoughDataError` é lançado antes do `try`, portanto o `catch` das linhas 96-108 nunca o alcança).

Como efeito colateral, o tratamento de `err.name === "ProductNotFound"` em `cartApi.js:40-42` é **código morto** — essa exceção jamais chega ao `catch`.

**Correção:** mover as validações para dentro do bloco `try`.

---

### 🔵 A2 — Cadastro envia a requisição antes de validar os campos *(recalibrado de Alta para Baixa — ver seção 7)*

**Arquivo:** `src/api/authApi.js:13-25`

O `POST users/createnewuser` é executado na linha 13 e só na linha 21 se verifica se `user.user` e `user.password` existem. Ou seja, dados inválidos são enviados ao servidor antes da validação — e, se a requisição falhar, o usuário recebe "erro de servidor" em vez da mensagem correta sobre campos vazios.

**Correção:** validar antes de chamar `requestJson`.

---

### 🟠 A3 — Redirecionamento indevido ao recarregar uma página protegida

**Arquivos:** `src/AppBootstrap.jsx:18-27` · `src/slices/authSlice.js:9` · `src/Components/protectedRoutes/LoggedProtected.jsx`

`isLoadingGetStorage` inicia como `false`, e o `dispatch(getLocalStorage())` só ocorre no `useEffect` (após a primeira renderização). Nesse primeiro *commit*, `isAuthenticated` ainda é `false`, então `AuthProtected` já executa `<Navigate to="/login" />`. Quando a sessão é restaurada em seguida, `LoggedProtected` empurra o usuário para `/produtos`.

Resultado: dar F5 em `/cart` ou `/produtos/:id` leva o usuário para `/produtos`, perdendo o contexto.

**Correção:** iniciar `isLoadingGetStorage: true` no estado inicial (ou usar um estado `authStatus: "idle" | "checking" | "done"`) para que a árvore protegida só renderize após a checagem terminar.

---

### 🟠 A4 — Navegação para o carrinho ocorre mesmo quando a adição falha

**Arquivo:** `src/Components/productsComponents/Product.jsx:101-117`

```js
dispatch(addProductCart({...}));
if (!cartError && !isLoading) {
  navigate("/cart");
}
```

`dispatch` de um thunk assíncrono retorna imediatamente; `cartError` e `isLoading` lidos aqui são valores **da renderização anterior**. A navegação acontece sempre, inclusive quando o produto não foi adicionado. Além disso, `isLoading` nessa linha vem de `store.products`, não do carrinho — a variável correta seria a do slice de cart.

**Correção:** aguardar o resultado do thunk (converter para `createAsyncThunk` e usar `.unwrap()`), ou navegar dentro de um `useEffect` que observe o sucesso da operação.

---

### 🟠 A5 — `authRejected` descarta a mensagem de erro recebida

**Arquivo:** `src/slices/authSlice.js:59-65`

```js
authRejected(sta, act) {
  sta.authError = act?.payload ? act.payload : "Usuário ou senha não encontrados tente novamente";
  sta.isLoading = false;
  sta.authError = true;   // sobrescreve a mensagem acima
}
```

A mensagem é atribuída e imediatamente substituída por `true`. Toda a lógica da primeira linha é inútil e a UI (`LoginMain.jsx:54-56`) acaba exibindo um texto fixo, mesmo quando a API devolve um motivo específico.

Somado a isso, o reducer `rejected` (linhas 46-49) **não zera `isLoading`**, deixando o formulário em estado de carregamento após uma falha de rede.

---

### 🟡 A6 — Dependências com vulnerabilidades e toolchain partido em dois *(recalibrado de Alta para Média — ver seção 7)*

**Arquivo:** `package.json`

- `npm audit` reporta **7 vulnerabilidades (5 altas)**. As 5 altas estão no `react-router` 7.17.0 e são relevantes para esta aplicação especificamente: *open redirect* via barra invertida em `<Link>`/`useNavigate` (GHSA-wrjc-x8rr-h8h6) e negação de serviço por casamento de rotas ineficiente (GHSA-chx6-hx7r-mcp5) — um SPA com rotas protegidas é exatamente o alvo. As demais: `postcss` (path traversal), `js-yaml` (DoS), `brace-expansion` (DoS), `esbuild` (moderada, afeta só o dev server). **`npm audit fix` resolve 5 das 7 sem breaking change.**
- **O toolchain está partido em dois.** `vitest@4.1.10` exige peer `vite: ^6 || ^7 || ^8`, mas o `package.json` declara `^4.4.5`. O npm resolveu isso instalando um **segundo Vite aninhado** (`node_modules/vitest/node_modules/vite@8.1.3`, baseado em Rolldown/Oxc). Confirmado por `npm ls vite`. Consequência: o `vite.config.js` é compartilhado, mas interpretado por dois engines diferentes — o **build** de produção usa Vite 4.5.14 (esbuild + Rollup 3) e os **testes** rodam em Vite 8 (Oxc + Rolldown). Um teste verde não garante que o mesmo módulo se comporte igual no bundle entregue ao usuário. A própria saída do `npm test` denuncia a situação: `Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored.`
- Efeito colateral: `npm ls --all` **sai com erro** (`invalid: esbuild@0.18.20`, `invalid: yaml@1.10.3`). Nada quebra hoje porque são peers opcionais, mas qualquer pipeline com `npm ci --strict-peer-deps` ou que use `npm ls` como sanity-check vai falhar.
- O alvo correto do upgrade é **vite 7 + `@vitejs/plugin-react` 5**: o plugin instalado (4.7.0) declara peer `vite: ^4.2 || ^5 || ^6 || ^7`, ou seja, subir para o Vite 8 que o vitest prefere deixaria o plugin com peer inválido. Vite 7 é a única versão que satisfaz vitest 4, plugin-react e `vite-plugin-eslint` ao mesmo tempo.
- `vitest` está em `dependencies` em vez de `devDependencies` — vai para o *bundle* de produção conceitualmente e infla a instalação.
- `@base-ui/react` e `redux` (avulso) estão declarados mas **não são importados em lugar algum** do `src/`.

**Correção:** `npm audit fix`, subir o Vite para 6/7, mover `vitest` para `devDependencies` e remover as duas dependências não utilizadas.

---

## 4. Achados de severidade média

### 🟡 M1 — `error` ausente no estado inicial de `auth` (crash latente)

`src/slices/authSlice.js:4-13` não define a chave `error`, mas `LoginMain.jsx:33` faz `error.toLocaleLowerCase()` sem *optional chaining*. Hoje o problema fica mascarado pelo bug C1 (a tela nem chega a renderizar), mas ao corrigir C1 sem corrigir isto surge um `TypeError: Cannot read properties of undefined`. Note que `SignupMain.jsx:36` já usa `error?.` — a inconsistência entre os dois é o sintoma. **Correção:** adicionar `error: ""` ao `initialState`.

### 🔵 M2 — Erro no carrinho substitui o conteúdo da página e nunca é limpo *(recalibrado de Média para Baixa — ver seção 7)*

`src/Components/cartComponents/CartMain.jsx:24` — uma falha ao excluir um item troca todo o carrinho por uma tela de erro, e `cart.error` só é zerado em uma operação bem-sucedida (que já não é mais possível a partir dessa tela). O usuário fica preso. Use um alerta não-bloqueante (*toast*/faixa) e uma ação `clearError`.

### 🔵 M3 — Frase de boas-vindas depende de um re-render acidental *(recalibrado de Média para Baixa — ver seção 7)*

`src/Components/productsComponents/ProductMain.jsx:23-32` — `phraseRef.current` é preenchido dentro de um `useEffect`; alterar uma `ref` não provoca re-render, então o título mostra `Olá fulano,` sem a frase até que outra atualização ocorra. Além disso, `Math.random() * 4` fixa o tamanho do array em código. **Correção:** `useState(() => frases[Math.floor(Math.random() * frases.length)])`.

### 🟡 M4 — Layout responsivo decidido por `window.innerWidth` sem listener

`src/Components/NavBarComponents/NavBar.jsx:5` — a escolha entre menu mobile e desktop é feita uma única vez, no momento da renderização. Redimensionar a janela ou girar o celular mantém a navbar errada. **Correção:** usar `matchMedia` com listener (ou apenas CSS media queries).

### 🟠 M5 — `NavLink` sem `to` deixa o botão "voltar" do produto inoperante *(recalibrado de Média para Alta — ver seção 7)*

`src/Components/NavBarComponents/LeaveProductIcon.jsx:14-18` — `<NavLink>` sem a prop obrigatória `to`, envolvendo um `IconButton`. Isso gera uma âncora sem destino e aninha elementos interativos (problema de acessibilidade e de navegação por teclado). O `NavLink` é desnecessário aqui, já que o clique é tratado por `navigate(-1)`.

### 🟡 M6 — `Error` força recarregamento completo da página

`src/Components/Error.jsx:6-9` — `navigate("/")` seguido de `window.location.reload()` anula as vantagens da SPA: recarrega todo o bundle para se recuperar de uma falha que normalmente exigiria apenas repetir uma requisição. Prefira apenas navegar e re-disparar o thunk que falhou.

> **Correção a uma afirmação anterior desta revisão:** a versão inicial deste item dizia também que "a ordem das duas chamadas não é garantida". **Isso está errado.** A revisão cruzada verificou no código do React Router (`chunk-6CSD65Y2.mjs:304`) que, com `BrowserRouter`, `useNavigate` chama `history.pushState` de forma síncrona — a URL já é `/` quando o `reload()` executa. A ordem é determinística. O único ressalva legítima é que essa garantia se perderia numa migração para `RouterProvider`/data router, onde `router.navigate` é assíncrono.

### 🟠 M7 — Inconsistência na montagem de URLs em `requestJson` *(recalibrado de Média para Alta — ver seção 7)*

`src/api/requestJson.js:11` monta `${BASE_URL}/${url}`, mas os chamadores são inconsistentes: `productsApi.js:7` passa `""` (gera barra final solta) e `localStorageThunk.js:11` passa `/users/fetch/${id}` (gera `//users/...`).

**Agravante identificado na revisão cruzada:** a barra dupla afeta justamente a restauração de sessão, e todos os outros chamadores (`authApi.js:13,75`, `cartApi.js:28,62,87`) omitem a barra inicial — só este destoa. Se o backend responder 404 para `//users/fetch/:id` (o comportamento padrão de Express e Fastify), **toda** restauração de sessão cai no caso `rejected` e, por causa de C1, todo usuário que já logou uma vez trava permanentemente no spinner. Esta linha isolada pode ser a causa raiz de C1 se manifestar em produção.

**Correção:** normalizar as barras dentro de `requestJson` (`String(url).replace(/^\/+/, "")` e remover a barra final de `BASE_URL`), corrigindo todos os chamadores de uma vez.

### 🟡 M8 — Cobertura de testes limitada a um único utilitário

Os 6 testes existentes cobrem apenas `ProductChecker`. Não há teste algum para os reducers (`authSlice`, `cartSlice`, `productsSlice`) nem para componentes, apesar de `@testing-library/react`, `user-event` e `jest-dom` estarem instalados. `src/test/setup.js` está **vazio** — deveria conter `import "@testing-library/jest-dom";`. Os reducers são código puro e de altíssimo retorno para teste: cada bug listado em C1, A5 e M1 seria capturado por um teste de reducer de 5 linhas.

### 🟡 M9 — Campo de quantidade aceita valores negativos e não pode ser esvaziado

`src/Components/productsComponents/Product.jsx:39-44,86-93` — `Number.isFinite(-5)` é `true`, então quantidades negativas são aceitas e exibem um total negativo na tela. Como o input é controlado com valor inicial `0`, o usuário também não consegue apagar o conteúdo para digitar outro número. **Correção:** rejeitar `value < 0` e permitir string vazia como estado intermediário.

---

## 5. Achados de severidade baixa

| # | Arquivo | Observação |
|---|---|---|
| B1 | `src/slices/authSlice.js:19-23,7` | Reducer `receiveUsers` e o estado `users` nunca são utilizados — código morto. Armazenar uma lista de usuários no cliente também é indesejável. |
| B2 | `src/slices/productsSlice.js:9` | Campo `times: 0` no estado nunca é lido nem escrito. |
| B3 | `src/Components/cartComponents/CartCard.jsx:13` | A prop `isLast` é declarada e usada no `className`, mas `CartMain` nunca a passa — o estilo `.last` nunca é aplicado. |
| B4 | `src/secretKeys.js:5` | Comentário residual `//Maaaa and Maaaa`. O nome do arquivo é enganoso: variáveis `VITE_*` ficam **públicas** no bundle; renomear para `config.js` ou `env.js`. |
| B5 | `src/Components/loginComponents/LoginMain.jsx:25-26` | `ev.preventDefault()` chamado duas vezes seguidas. |
| B6 | `index.html:2` | `<html lang="en">` em uma aplicação inteiramente em português — prejudica leitores de tela e SEO. Trocar por `pt-BR` e adicionar `<meta name="description">`. |
| B7 | `src/Pages/*.jsx` | Os 6 arquivos de página repetem o mesmo esqueleto `NavBar / conteúdo / Footer`. Um *layout route* do React Router (`<Route element={<Layout/>}>`) elimina a duplicação. Idem para o bloco do ícone de carrinho, duplicado entre `NavBarDesktop.jsx:34-58` e `NavModal.jsx:63-97`. |
| B8 | `vercel.json` · `src/api/cartApi.js:104` | Sem cabeçalhos de segurança (`X-Content-Type-Options`, `Referrer-Policy`, CSP) nem política de cache. E a mensagem de erro `"Error on pay cart"` está em inglês, destoando do restante da UI em português — o `err` original é descartado. |

---

## 6. Achados adicionais da revisão cruzada

Defeitos encontrados por revisores independentes e confirmados por leitura do código. Numeração continua a das seções anteriores para não invalidar as referências já existentes.

### 🟠 A7 — Sessão é restaurada com qualquer resposta não-nula, sem validar o formato

**Arquivo:** `src/slices/authSlice.js:78-87` · `src/api/localStorageThunk.js:9-12`

A única checagem é `if (action.payload !== null)`. Não se verifica se o payload traz `id` e `user`:

```js
.addCase(getLocalStorage.fulfilled, (sta, action) => {
  if (action.payload !== null) {
    sta.authUser = action.payload.user;   // pode ser undefined
    sta.authUserId = action.payload.id;   // pode ser undefined
    sta.isAuthenticated = true;           // autenticado mesmo assim
```

**Cenário de falha:** o backend responde `200` com `{}` ou `{"error":"not found"}` para um id inexistente — comportamento comum em APIs que não devolvem 404. O usuário é marcado como autenticado com `authUserId === undefined`, as rotas protegidas liberam o acesso e todas as chamadas do carrinho passam a bater em `users/undefined/addproductcart`. O contraste está no próprio código: `authApi.js:86` valida `if (Array.isArray(cart) && id && user)` antes de autenticar; aqui essa checagem não existe.

**Correção:** validar a forma do payload no thunk (`if (!data?.id || !data?.user) return null;`) antes de setar `isAuthenticated`.

### 🟠 A8 — Corrida entre `fetchProducts` e `getProduct` renderiza a página de produto vazia

**Arquivos:** `src/api/productsApi.js:5,20` · `src/AppBootstrap.jsx:15` · `src/Components/productsComponents/Product.jsx:27-29,45`

Os dois thunks compartilham o mesmo `isLoading` e o mesmo `error` do slice `products`, e o primeiro a responder zera a flag para ambos.

**Cenário de falha:** um usuário autenticado abre direto `/produtos/abc`. `AppBootstrap` dispara `fetchProducts()` (catálogo vazio) e `Product` dispara `getProduct("abc")` — concorrentes. Se o catálogo responder primeiro, `receiveProducts` zera `isLoading`, mas `currentProduct` ainda é `{}`: a página renderiza com `nome`, `imagem` e `descricao` `undefined` e exibe **"Total: NaN R$"** (`preco * quantity` com `preco` indefinido). Existe ainda a variante *last-write-wins*: navegando rápido de `/produtos/A` para `/produtos/B`, se a resposta de A chegar por último, `currentProduct` fica sendo A enquanto a URL mostra B — e `addProductCart` combina o `id` de `useParams` (B) com os dados de A, gravando um item corrompido no carrinho.

**Correção:** migrar os dois para `createAsyncThunk` e descartar respostas obsoletas via `requestId`; no mínimo, separar `isLoadingList` de `isLoadingCurrent` e limpar `currentProduct` no início de `getProduct`.

### 🟡 M10 — `products.error` nunca é limpo e bloqueia o catálogo inteiro

**Arquivos:** `src/slices/productsSlice.js:19-22,46-48` · `src/Components/productsComponents/ProductMain.jsx:45`

`products.error` só volta a `""` em `receiveProducts` ou `receivedCurrentProduct`; `leaveOfCurrentProduct` limpa apenas `currentProduct`.

**Cenário de falha:** o usuário abre `/produtos/id-invalido` → `getProduct` falha com "Produto não encontrado" → `error` preenchido. Ao voltar para `/produtos`, `ProductMain.jsx:45` troca **todo o catálogo** pela tela de erro — e ele nunca se recupera, porque `AppBootstrap` só refaz `fetchProducts` quando `products.length === 0` e a lista está cheia. Só F5 resolve. **Correção:** limpar `sta.error` em `loadingProducts` e em `leaveOfCurrentProduct`.

### 🟡 M11 — Erro de rede no login é um beco sem saída

**Arquivos:** `src/api/authApi.js:102-107` · `src/Components/loginComponents/LoginMain.jsx:33-35`

Diferente de `createNewUser` (que trata `FetchApiError` à parte em `authApi.js:49`), o `catch` de `loginUser` manda qualquer erro para `auth/rejected`, e `LoginMain.jsx:35` substitui o formulário inteiro por `<Error>`. Nenhum reducer limpa `error` depois disso.

**Cenário de falha:** a conexão cai numa tentativa de login → o formulário desaparece e o usuário **não consegue tentar de novo**; a única saída é o botão que recarrega a página. **Correção:** tratar `FetchApiError` com mensagem inline via `authRejected` e limpar `error` ao submeter.

### 🟡 M12 — Sem política de senha

**Arquivos:** `src/Components/loginComponents/Input.jsx:6-23` · `src/api/authApi.js:32-40`

O input só tem `required` — sem `minLength`, `maxLength` ou critério de força. A única regra é o teto de 100 caracteres, aplicado tarde demais (ver A2). Cadastrar-se com a senha `a` é aceito. Combinado com C3 (id como credencial permanente), a conta é trivialmente comprometida. **Correção:** `minLength={8}` e `maxLength={100}` no input **e** validação equivalente no servidor, que é onde ela vale.

### 🟡 M13 — Identificadores interpolados em URL sem `encodeURIComponent`

**Arquivos:** `src/api/localStorageThunk.js:11` · `src/api/cartApi.js:28,62,87` · `src/api/productsApi.js:23`

Nenhum ponto de interpolação codifica o valor. O caso mais relevante é `productsApi.js:23`, onde o `id` vem de `useParams` — ou seja, **é controlado pela URL que o visitante digita**. Um id contendo `../` altera o caminho efetivo da requisição após a normalização feita pelo `fetch`; um id contendo `?` ou `#` descarta silenciosamente o resto do caminho. **Correção:** `encodeURIComponent` em todas as interpolações e validação do formato do id.

### 🟡 M14 — Ações despachadas por string literal, sem action creators

**Arquivos:** `src/api/cartApi.js` (linhas 26, 36, 43, 60, 69, 74, 76, 85, 98, 104) · `src/api/productsApi.js` (5, 8, 11, 26, 33) · `src/api/authApi.js`

Os slices exportam apenas 6 action creators; todo o resto é despachado com o `type` escrito à mão. Um erro de digitação (`"cart/rejeted"`) passa despercebido: o Redux aceita a ação, nenhum reducer a trata e o `isLoading` fica ligado para sempre — exatamente a classe de bug que aparece em C1 e A5. **Correção:** exportar e usar os creators gerados pelo `createSlice`.

### 🟡 M15 — Elementos interativos aninhados: `<button>` dentro de `<a>` em cinco lugares

**Arquivos:** `NavLoginButton.jsx:5-7` · `Purpose.jsx:24-26` · `NavBarDesktop.jsx:35-58` · `NavModal.jsx:65-90` · `LeaveProductIcon.jsx:14-18` (o `IconButton` do MUI renderiza um `<button>`)

O modelo de conteúdo de `<a>` exclui conteúdo interativo — `<a><button></button></a>` é HTML inválido. Cada um desses controles gera **dois** stops de Tab para uma única ação, e o leitor de tela anuncia "link, Login" seguido de "botão, Login". No caso do carrinho, o clique dispara o handler do `IconButton` **e** borbulha para a navegação do `NavLink`. **Correção:** escolher um único elemento — `<NavLink>` estilizado como botão para navegação, `<button>` puro com `navigate()` para ações.

### 🟡 M16 — Controles sem nome acessível e sem acesso por teclado

Conjunto de falhas de acessibilidade confirmadas, todas no caminho crítico de compra:

- **`CartCard.jsx:35-44`, `NavModal.jsx:19-32`** — três botões cujo único conteúdo é um caractere tipográfico: `&times;` (remover do carrinho), `&#9776;` (abrir menu), `&times;` (fechar). O leitor de tela anuncia "multiplication sign, botão" e "trigram for heaven, botão". O contraste está no próprio projeto: `Error.jsx:17` e `LoginButton.jsx:6` já usam `aria-label` corretamente.
- **`CartCard.jsx:20-26`** — o card é uma `<div onClick>` sem `role`, `tabIndex` ou handler de teclado. Navegando por Tab, o usuário alcança apenas o "×" de remover; **não há como abrir a página do produto a partir do carrinho sem mouse**.
- **`Input.jsx:6-23`, `Product.jsx:85-93`** — nenhum `<label htmlFor>` existe. O `Input` até define `id={name}`, mas nada o referencia; o campo de quantidade é rotulado por um `<span>` sem associação programática, então clicar no texto não foca o campo.
- **`Card.jsx:8` + `Motives.jsx:41`** — os quatro ícones decorativos recebem `alt="icon"` (o `id` fixo), fazendo o leitor anunciar "icon" quatro vezes. Ícones decorativos devem ter `alt=""`.

**Correção:** `aria-label` nos três botões (+ `aria-expanded`/`aria-controls` no menu), trocar a div clicável por `<Link>` com o botão de remover fora dele, adicionar `<label htmlFor>` e usar `alt=""` nos decorativos.

### 🟡 M17 — Sem campo `engines`: o deploy pode escolher um Node incompatível

**Arquivo:** `package.json`

`vitest@4.1.10` exige `node: ^20 || ^22 || >=24` e o Vite 8 aninhado exige `^20.19 || >=22.12`. O ambiente local está em Node 24.13.1, mas sem `engines` a Vercel usa o default do projeto e pode divergir silenciosamente. **Correção:** `"engines": { "node": ">=20.19" }`.

### 🟡 M18 — Rotas inexistentes retornam HTTP 200 e os assets não têm cache

**Arquivo:** `vercel.json`

O rewrite catch-all em si está **correto** (na Vercel os rewrites só se aplicam quando nenhum arquivo estático casa, então `/assets/*` continua servido normalmente). Os problemas são as omissões: toda rota inválida devolve `200 OK` com o `index.html` — a página `NotFound` renderiza, mas buscadores indexam a URL como válida (*soft-404*); e não há `Cache-Control: public, max-age=31536000, immutable` para `/assets/*`, que têm hash no nome e portanto são seguros para cache eterno. Somado à ausência de cabeçalhos de segurança (B8), o `vercel.json` merece um bloco `headers` completo.

### 🟠 A9 — Não existe nenhum `ErrorBoundary` na aplicação

**Arquivos:** `src/App.jsx:18` · `src/main.jsx` (busca por `componentDidCatch`, `ErrorBoundary` e `getDerivedStateFromError` em `src/`: **zero ocorrências**)

Duas consequências concretas:

1. **Corrigir C1 sozinho troca um sintoma por outro.** Destravado o spinner, o `TypeError` de M1 (`error.toLocaleLowerCase()` com `error` indefinido) desmonta a árvore React inteira — o usuário vê **tela branca**, não a tela de erro do projeto.
2. **O `<Suspense>` de `App.jsx:18` não tem par de erro.** Se o carregamento de um chunk lazy falhar — cenário corriqueiro logo após um deploy, quando o navegador ainda pede os hashes antigos e recebe 404 — a página fica **em branco permanentemente**, sem nem o `SpinnerFullScreen`.

**Correção:** envolver a árvore com um `ErrorBoundary` que renderize o componente `Error` existente. Isto deve entrar na **Etapa 1**, antes de destravar M1.

### 🟡 M19 — Assimetria de retry: a falha no catálogo nunca é reexecutada

**Arquivos:** `src/AppBootstrap.jsx:14-16` · `src/slices/productsSlice.js:19-22`

É o espelho exato de C2. Quando `fetchProducts` **falha**, `products/rejected` não toca no array `products`, a referência não muda, o `useEffect` não roda de novo — e `products.error` só é limpo por um `receiveProducts` bem-sucedido, que nunca virá. A página `/produtos` fica em tela de erro definitiva até um F5.

Ou seja, o mesmo `useEffect` **tenta infinitamente no caso benigno** (lista vazia, C2) e **nunca tenta no caso de falha**. **Correção:** ao aplicar a correção de C2, incluir um botão "tentar novamente" que redisparе o thunk — resolve os dois lados de uma vez.

### 🟡 M20 — Quantidades decimais são impossíveis de digitar

**Arquivo:** `src/Components/productsComponents/Product.jsx:40`

Complemento a M9: `+ev.target.value` converte a cada tecla, e `+"1."` é `1` — o input controlado apaga o ponto no instante em que o usuário o digita. Para produtos vendidos por **kg** (a maior parte do catálogo: maçã, castanha, granola), só é possível comprar quantidades inteiras. **Correção:** manter o valor cru como string no estado e derivar o número apenas no cálculo do total.

### 🔵 B9 — `.gitignore` não cobre todas as variantes de `.env`

`*.local` cobre `.env.local` e `.env` cobre o arquivo base, mas `.env.production`, `.env.development` e `.env.staging` — que o Vite lê normalmente — **não** são ignorados. O histórico do git foi verificado e nenhum arquivo de ambiente foi versionado até agora; é prevenção, não incidente. **Correção:** `.env*` com exceção `!.env.example`.

### 🔵 B10 — `BASE_URL` usado sem validação

`src/secretKeys.js:1` — se `VITE_API_URL` não estiver definida no build, `BASE_URL` é `undefined` e todas as chamadas viram `undefined/users/...` (tratada como URL relativa), falhando com erros confusos que não apontam para a causa. **Correção:** falhar explicitamente no boot se a variável estiver ausente.

### 🔵 B11 — Defensividade inconsistente com itens do carrinho

`src/api/cartApi.js:54` usa `productCart?.id` (assume que o array pode conter `null`), enquanto `src/slices/cartSlice.js:29,39` usa `product.id` sem proteção. Como `cart/receiveCart` grava o payload do servidor sem validação, um item nulo vindo da API lança `TypeError` **dentro do reducer**, derrubando a árvore React. **Correção:** padronizar o acesso opcional ou validar o payload em `receiveCart`.

### 🔵 Achados menores adicionais (B12–B21)

| # | Arquivo | Observação |
|---|---|---|
| B12 | `LoginMain.jsx:30-32` · `SignupMain.jsx:31-35` | O `useEffect` que redireciona quando `isAuthenticated` vira `true` é **código morto**: ambos os componentes são filhos de `LoggedProtected`, que retorna `<Navigate replace to="/produtos" />` no mesmo render, desmontando o componente antes que o efeito do novo render exista. O redirecionamento que o usuário vê é sempre o do `LoggedProtected`. |
| B13 | `CartMain.jsx:38-47` · `CartCard.module.css:46` | A prop `isLast` não passada (item B3) tem **efeito visual real**: a classe `.last { margin-bottom: 100px }` existe, então o último item do carrinho fica colado no `<hr>`/total. `ProductMain.jsx:77` e `Motives.jsx:38` passam a prop corretamente — só o carrinho esqueceu. |
| B14 | `LoginMain.jsx:62-63` | Passa `color="white"` e `backgroundColor="rgb(163, 220, 79)"` para `<LoginButton>`, que só aceita `{children, disabled, register}`. As props são descartadas silenciosamente — quem lê o arquivo acredita que a cor vem dali, quando vem de `styles.login`. Idem `CardProduct.jsx:9`, que desestrutura `categorias` sem que ninguém a passe. |
| B15 | `Input.jsx:4,16` | `type="user"` não é um tipo de input válido (o navegador faz fallback para `text`), e o `name`/`id` montado como `${type}-${signup ? "register" : "password"}` gera `name="user-password"` para o campo de **usuário** na tela de login — nome enganoso para gerenciadores de senha. |
| B16 | `Links.jsx:6-12` | Links externos (Instagram, WhatsApp) sem `target="_blank" rel="noopener noreferrer"` — o usuário perde o estado da SPA ao clicar. |
| B17 | `NavModal.jsx:35` · `ProductMain.jsx:48` | Dois landmarks `<main>` na mesma página (o menu mobile usa `<main>` para a lista de links), o que confunde a navegação por landmarks. O menu também não tem *focus trap* nem fecha com Esc. |
| B18 | `Button.jsx:5` | Não aceita nem propaga `type`, então o `<button>` fica com `type="submit"` implícito. Hoje nenhum uso está dentro de `<form>`, mas é uma armadilha — `LoginButton.jsx:7` já define `type` explicitamente. |
| B19 | `AppBootstrap.jsx:18-22` | O efeito re-dispara `getLocalStorage()` a cada logout (a dependência `isAuthenticated` volta a `false`), causando um flash do spinner de tela cheia ao clicar em "Sair". |
| B20 | `index.html:5` | `type="image/png+xml"` não é um MIME válido — é uma mistura de `image/png` com `image/svg+xml`. Correção: `image/png`. |
| B21 | `.eslintrc.json` · `src/test/*.js` | A config de lint tem 3 linhas (`{"extends":"react-app"}`) e nunca referencia o `eslint-plugin-react-refresh` declarado em `package.json:41` — devDependency morta. Zero warnings em 56 arquivos é mais sintoma de config frouxa do que de código impecável. Além disso, os nomes dos testes contradizem as asserções: `cart.test.js:4` diz "deve retornar true" para um `expect(value).toBeUndefined()`, e `:19`/`:32` dizem "deve retornar false" onde a função na verdade **lança**. |

---

## 7. Validação adversarial e recalibração de severidade

Um quinto revisor auditou este relatório com a instrução explícita de **refutar** cada achado, assumindo-os errados até o código provar o contrário. Ele executou os reducers reais em Node para testar C1, C2, A5 e M1 empiricamente, e leu o fonte do `react-router` instalado para checar M5.

**Placar: 22 CONFIRMADOS · 4 EXAGERADOS · 0 INCORRETOS.** Os três críticos originais resistiram ao ataque. As recalibrações abaixo foram aceitas e já estão refletidas na contagem do resumo executivo.

| Achado | Era | Passou a ser | Motivo |
|---|---|---|---|
| **M7** barra dupla na URL | 🟡 Média | 🟠 **Alta** | É o gatilho mais provável do caminho `rejected` que causa C1, e a correção tem duas linhas. |
| **M5** `NavLink` sem `to` | 🟡 Média | 🟠 **Alta** | Não é cosmético. Lendo `resolveTo` no fonte do React Router: `to = {...undefined}` → `toPathname == null` → `from = locationPathname`, ou seja, a âncora aponta para a **URL atual**. Como o `handleClick` do `IconButton` não chama `preventDefault`, o clique dispara **duas** navegações — um `push` para a rota atual e um `go(-1)` que volta justamente para ele. O botão "voltar" do produto é, na prática, inoperante. |
| **A2** POST antes de validar | 🟠 Alta | 🔵 **Baixa** | O caminho é inalcançável pela interface: `SignupMain.jsx:21` desabilita o botão e `Input.jsx:22` tem `required`. Campos vazios nunca chegam ao thunk — o `EnoughDataError` é código morto. Continua sendo um defeito de ordem, não de comportamento. |
| **A6** dependências | 🟠 Alta | 🟡 **Média** | Das 7 vulnerabilidades, **só o `react-router` é de runtime**; as demais (`vite`, `esbuild`, `postcss`, `js-yaml`, `brace-expansion`) afetam apenas o toolchain de desenvolvimento. |
| **M2** erro do carrinho | 🟡 Média | 🔵 **Baixa** | Eu havia escrito que "o usuário fica preso". **Está errado:** só o `CartMain` é substituído — `Cart.jsx:8,10` mantém `NavBar` e `Footer`, e o próprio `Error.jsx:16-22` oferece o botão de retorno. |
| **M3** frase de boas-vindas | 🟡 Média | 🔵 **Baixa** | Eu havia escrito que a frase "não aparece". **Está errado:** o segundo efeito (`ProductMain.jsx:37-39`) despacha `searchProducts` na montagem, e esse reducer sempre gera novo `displayProducts` → re-render garantido no mesmo ciclo, com a ref já preenchida. A frase aparece; o que resta é o anti-padrão (a ref só funciona por acidente de ordem) e o `4` hardcoded. |

**Divergência mantida — A1 (validações fora do `try`) permanece Alta.** O validador sugeriu Média, argumentando que exige "dado ruim vindo da API". Mantenho a severidade porque o caminho é mais fácil do que parece: `getProduct` **não** valida o produto com `verifyProduct` (ao contrário de `fetchProducts`), então qualquer produto do catálogo com `categoria` ausente ou `preco: 0` chega intacto à página de detalhe e faz `verifyProductCart` lançar. O resultado combinado — falha totalmente silenciosa **e** navegação para `/cart` como se tivesse dado certo (A4) — é grave o bastante para se manter em Alta.

**Duas outras observações do validador, acatadas:**
- O item B8 foi mantido como está, mas registre-se que ele agrupa dois assuntos sem relação (cabeçalhos de segurança e mensagem de erro em inglês); ao atacar a lista, trate-os separadamente.
- **C3 está na Etapa 3 por dependência externa, não por ser menos importante.** É a única correção que exige mudança de backend. Sem essa ressalva, o relatório parece se contradizer ao classificar como crítico algo que agenda em terceiro lugar.

---

## 8. Pontos positivos

- Separação de responsabilidades clara entre `api/` (thunks), `slices/` (estado) e componentes de apresentação.
- Uso de `React.lazy` + `Suspense` para *code splitting* por rota (`src/App.jsx:7-13`).
- Erros de API modelados com classes próprias (`FetchApiError`, `ProductNotFound`, `EnoughDataError`), permitindo tratamento diferenciado.
- Validação defensiva do formato dos produtos vindos da API (`utils/ProductChecker.js`), com testes cobrindo os casos de borda.
- Boas práticas pontuais de acessibilidade: `aria-label` em `Button` e `LoginButton`, `autoComplete` correto nos inputs de login/cadastro (`Input.jsx:9-15`).
- Lint sem avisos e testes verdes na base atual.
- README claro, com instruções de instalação, variáveis de ambiente e estrutura do projeto.

Pontos que a revisão cruzada verificou e **descartou** como problema — vale registrar para que não sejam "corrigidos" à toa:

- **O build de produção está saudável.** `vite build` roda limpo em 6,5s, 1053 módulos, sem warning de chunk, com code-splitting por rota funcionando (chunks separados para Home/Cart/Login/Products). Os achados de toolchain (A6) são de configuração, não de falha de build.
- **O lint está legitimamente limpo.** Confirmado que o ESLint de fato processa os arquivos (56 analisados, nenhum ignorado) — não é um "verde" falso por escopo vazio.
- **Nenhuma `key` de lista inadequada.** Os quatro `map` usam chaves estáveis e únicas; não há uso de índice como `key`.
- **Nenhum array de dependências incorreto.** Os seis `useEffect` do projeto têm dependências completas; `react-hooks/exhaustive-deps` não reporta nada. Os problemas de hooks encontrados são de outra natureza (ref no lugar de estado, closure obsoleto em handler).
- **`useParams()` nos componentes de navbar funciona como esperado**, apesar de a rota pai não declarar `:id` — o React Router atribui a mesma referência de params a todos os matches do branch.
- **Nenhum segredo vazado no código ou no histórico do git.** Sem chave, token ou senha hardcoded; `.env` nunca foi versionado; `secretKeys.js` sempre usou `import.meta.env`.
- **Nenhuma superfície de XSS por injeção de HTML.** Nenhuma ocorrência de `dangerouslySetInnerHTML`, `innerHTML` ou `eval` em `src/`.
- **`requestJson.js:15-17`** parece ter um `throw` perdido dentro do `.catch()` de `res.json()`, mas o `.catch()` devolve uma promise que o `await` aguarda — o erro propaga corretamente. Não é bug.

---

## 9. Plano de ação recomendado

> A ordem abaixo já incorpora os quatro ajustes apontados pela validação adversarial. As dependências entre itens estão explícitas: **respeitá-las importa mais que a ordem em si**, porque três dessas correções, aplicadas isoladamente, trocam um defeito por outro pior.

**Etapa 1 — Correções que quebram o app (fazer agora, nesta ordem)**
1. `isLoadingGetStorage = false` no caso `rejected` (C1).
2. **Pré-requisito de todo o resto:** adicionar um `ErrorBoundary` na raiz (A9). Corrigir C1 sem isto apenas troca "spinner infinito" por "tela branca", porque destrava o `TypeError` de M1.
3. Validar `id`/`user` em `createNewUser` e sanear a chave corrompida do `localStorage` com `try/catch` no `JSON.parse` (C4). Sem isto, C1 continua sendo um **lockout permanente**, não uma falha transitória.
4. Corrigir a barra inicial em `localStorageThunk.js:11`, normalizando as URLs dentro de `requestJson` (M7). Não faz sentido tratar o sintoma de C1 e deixar para depois a inconsistência que provavelmente o causa.
5. Corrigir a dependência do `useEffect` de produtos para eliminar o laço infinito (C2) — **junto com** um botão "tentar novamente", senão a correção consolida o defeito espelhado de M19 (falha na busca inicial passa a ser definitiva).
6. Mover todas as validações para dentro dos blocos `try` dos thunks (A1).
7. Adicionar `error: ""` ao `initialState` de `auth` e remover a linha duplicada em `authRejected` (M1, A5).

**Etapa 2 — Correções de fluxo e experiência**
8. `isLoadingGetStorage: true` no estado inicial para acabar com o redirecionamento no F5 (A3). **Depende do item 1:** aplicado sozinho, transforma qualquer falha de API em tela de carregamento permanente para **todos** os usuários, não só para os que têm sessão salva.
9. Remover o `<NavLink>` sem `to` do `LeaveProductIcon` e trocar `navigate(-1)` por `navigate("/produtos")` — o botão "voltar" do produto está inoperante hoje (M5).
10. Validar a forma do payload em `getLocalStorage.fulfilled` antes de autenticar (A7).
11. Navegar para o carrinho apenas após o sucesso confirmado do thunk (A4).
12. Limpar `products.error` ao sair de um produto e ao iniciar um carregamento (M10); separar as flags de carregamento de lista e de produto atual (A8).
13. Erros do carrinho e do login como aviso não-bloqueante, com ação de limpar (M2, M11).
14. Corrigir a responsividade da navbar e o input de quantidade, incluindo decimais e negativos (M4, M9, M20).

**Etapa 3 — Segurança e dependências**
15. Implementar autenticação por token com validação no servidor (C3). **Bloqueado por dependência externa** — exige mudança de backend. Está nesta etapa por isso, não por ser menos importante que os itens acima.
16. `npm audit fix` (resolve 5 das 7 vulnerabilidades sem breaking change), alinhar o toolchain em **vite 7 + `@vitejs/plugin-react` 5**, mover `vitest` para `devDependencies`, remover `@base-ui/react` e `redux`, adicionar `engines` (A6, M17).
17. Bloco `headers` no `vercel.json` com segurança + `Cache-Control` para `/assets/*` (B8, M18).
18. Política mínima de senha no cliente e no servidor (M12); `encodeURIComponent` nas interpolações de URL (M13).

**Etapa 4 — Qualidade a longo prazo**
19. Preencher `src/test/setup.js` e escrever testes (ordem sugerida abaixo).
20. Extrair um layout compartilhado para as páginas e um componente único para o ícone de carrinho (B7).
21. Corrigir a acessibilidade dos controles do fluxo de compra (M15, M16).
22. Trocar as ações despachadas por string literal pelos action creators do `createSlice` (M14).
23. Remover código morto (B1, B2, B3, B12, B14) e padronizar as mensagens de erro em português (B8).

### Ordem sugerida para os testes

O critério é risco × custo. Os primeiros são baratos (JS puro, sem DOM) e cobrem o dinheiro do cliente:

1. **Reducer `cartSlice`** — funções puras, sem store nem mocks, e é o carrinho de compras. Há três ramos de `getLocalStorage.fulfilled` sem nenhum teste, e vale congelar (ou corrigir) o comportamento de `addProductCart`, que **substitui** o produto de mesmo `id` em vez de somar a quantidade.
2. **Endurecer os testes de `ProductChecker`** — custo quase zero, já sabemos o resultado: `it.each` com `null`, `undefined`, `{}`, `preco: 0`, e trocar `toThrow()` por `toThrow(ProductNotFound)`.
3. **Thunks de `cartApi.js`** — com `dispatch`/`getState` falsos e `vi.mock("./requestJson")`. O teste *"addProductCart com produto inválido despacha `cart/rejected`"* **vai falhar hoje**, justamente por causa de A1 — é a forma de transformar o achado em regressão vigiada.
4. **`authSlice`** — mesma mecânica, cobrindo login, logout e os caminhos de erro que guardam as rotas protegidas.
5. **Componentes, começando por `protectedRoutes/`** — os menores componentes com a maior consequência; testá-los força a criar a infra de `renderWithProviders` (store + `MemoryRouter`) que todo teste de componente vai reusar.

**Pré-requisito para os itens 3-5:** `src/test/setup.js` está vazio e precisa de `import "@testing-library/jest-dom";`.
