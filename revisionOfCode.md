# Empório Natural — Análise Adversarial (Adversarial Review)

Consolidado em **15 de setembro de 2026** a partir de rodadas de revisão realizadas em **13 e 14 de setembro de 2026**.

## Escopo e veredito

A revisão cobriu os 12 commits trazidos para a `main`, a implementação atual do frontend, testes automatizados selecionados, configurações e jornadas de usuário em desktop e dispositivos móveis.

- Commit local anterior: `29c9044fdf89c39b85945f8762d06991b0656034`.
- Commit revisado: `3125e630923adf67dfa2b0de23c7da6d0434b786`.
- Comparação de entrada: `git diff 29c9044...3125e63`.
- Os conteúdos locais existentes dos arquivos `index.html` e `vercel.json` foram preservados byte a byte durante a atualização e a revisão.
- Nenhum código de aplicação foi editado. Este relatório é a única nova entrega da etapa de documentação.
- O backend separado em Flask ficou fora do escopo da revisão. Autorização no backend, aplicação de preços, processamento de pagamentos e comportamento de cookies em produção não foram verificados.

**Veredito:** corrija a consistência da identidade do produto e as falhas de inicialização antes do lançamento. O defeito reproduzido de maior consequência combina o ID de um produto com o nome e o preço de outro produto em uma requisição do carrinho. A recuperação de erros e as asserções de testes também precisam de melhorias substanciais antes que os indicadores verdes possam ser tratados como evidência de jornadas de usuário confiáveis.

O arquivo mais antigo `REVISAO_DE_CODIGO.md` foi tratado como contexto histórico, e não como evidência de que suas descobertas ainda se aplicam. Vários problemas relatados anteriormente já foram corrigidos.

## Evidências e limitações

| Verificação | Resultado observado |
| --- | --- |
| `npm run lint` | Passou durante a primeira rodada de revisão. |
| `npm run build` | Passou; exibiu um aviso de que `store.js` é importado tanto estática quanto dinamicamente, portanto a importação dinâmica não cria um chunk separado. |
| `npx vitest run src/test/cart.test.js` | 11 testes passaram. |
| Revisão no navegador | Layouts de desktop/mobile foram inspecionados e cenários de falha no carrinho, logout, configuração e navegação foram exercitados com respostas de API interceptadas. |
| Verificações de funções isoladas | Thunks, loaders, validadores e reducers existentes foram executados com respostas de fetch controladas para verificar condições de contorno e caminhos de falha. |
| Suítes completas dependentes de API | Não foram executadas contra o backend real. Não há garantia de que a suíte completa passe ou falhe em um ambiente implantado. |
| Mutações externas | Nenhuma conta, carrinho, pedido ou pagamento real foi modificado. |
| Verificação no dia da documentação | Confirmado que o repositório permanece no commit `3125e63`; não foram repetidas as execuções anteriores de build e testes. |

As reproduções no navegador estabelecem o comportamento do frontend sob as respostas declaradas. Elas não estabelecem como o backend separado aceita ou rejeita as requisições resultantes.

**Alta** significa um problema de prioridade de lançamento relacionado à correção, disponibilidade ou manipulação de sessão. **Média** significa um defeito funcional relevante ou uma lacuna de confiabilidade nos testes. **Baixa** significa um defeito de documentação ou usabilidade com impacto mais restrito. Decisões de design estão listadas separadamente dos bugs confirmados.

## Achados na aplicação existente

### R01 — Alta: respostas obsoletas misturam identidades de produtos

**Evidência:** reproduzido via navegação no navegador e confirmado na requisição do carrinho interceptada.

1. Abra o produto A (Maçã) e atrase a resposta dos seus detalhes.
2. Use o link de navegação "Produtos" para abandonar essa navegação.
3. Abra o produto B (Banana) e aguarde a conclusão da resposta.
4. Libere a resposta atrasada da Maçã.
5. Insira a quantidade `1` e adicione o produto exibido ao carrinho.

A URL permaneceu `/produtos/B`, mas a visualização detalhada mudou para a Maçã. O corpo enviado na requisição incluiu:

```json
{
  "product": {
    "id": "B",
    "nome": "Apple Review",
    "total": 8.9,
    "quantity": "1",
    "categoria": "kg"
  }
}
```

O loader grava cada resposta concluída em um `currentProduct` compartilhado, incluindo respostas de navegações abandonadas. O manipulador de compra combina os campos desse objeto compartilhado com o ID da rota atual.

**Mudança recomendada:** evite que requisições canceladas ou desatualizadas confirmem estado. Mantenha a identidade do produto exibido e a identidade de compra unificadas; desabilite o envio quando elas não coincidirem. Repasse o cancelamento de navegação para a requisição e proteja as atualizações de estado contra respostas obsoletas.

**Cobertura de regressão:** atrase A, finalize B, depois finalize A. Garanta que a página e o item do carrinho enviado permaneçam sendo B com o preço de B.

**Locais:** [actionProduct.js](src/Components/productsComponents/actionProduct.js), linhas 25–42; [Product.jsx](src/Components/productsComponents/Product.jsx), linhas 19–20, 28 e 55–70.

### R02 — Alta: ausência de configuração opcional quebra a inicialização

**Evidência:** reproduzido no navegador configurando apenas `VITE_API_URL`, correspondendo às variáveis fornecidas pelo fluxo de trabalho atual do Playwright.

Quando `VITE_NUMBER_PHONE` está ausente, a avaliação do módulo atinge `process.env.VITE_NUMBER_PHONE`. O navegador lança `ReferenceError: process is not defined` e renderiza uma página em branco. A ausência de `VITE_DEV` produz a mesma falha.

**Mudança recomendada:** use valores padrão seguros para o navegador em configurações opcionais do Vite. Valide valores obrigatórios explicitamente. Mantenha o acesso ao ambiente Node apenas em códigos executados no Node.

**Cobertura de regressão:** inicie a aplicação com apenas a URL da API obrigatória configurada e verifique se uma página funcional é renderizada. Inclua valores opcionais vazios.

**Locais:** [secretKeys.js](src/secretKeys.js), linhas 1–4; [playwright.yml](.github/workflows/playwright.yml), etapa de criação do ambiente.

### R03 — Alta: fallback de erro raiz quebra fora do roteador

**Evidência:** uma URL de API inválida gerou uma página em branco e a mensagem `useNavigate() may be used only in the context of a <Router> component`.

O `ErrorBoundary` externo renderiza `Error`, que chama `useNavigate`, mas o fallback está fora do `RouterProvider`. A validação de inicialização também importa o componente de UI como `Error` e depois chama `new Error(...)`, sobrepondo o construtor nativo de erro.

**Mudança recomendada:** forneça um fallback raiz que não dependa do contexto de roteamento. Renomeie o componente de erro de UI ou use explicitamente o construtor nativo ao lançar uma exceção.

**Cobertura de regressão:** configurações inválidas e erros lançados no bootstrap devem produzir uma tela de recuperação legível em vez de uma página em branco.

**Locais:** [App.jsx](src/App.jsx), linha 81; [Error.jsx](src/Components/Error.jsx), linha 8; [AppBootstrap.jsx](src/AppBootstrap.jsx), linhas 6 e 20.

### R04 — Alta: falha no logout é silenciosa e deixa o estado de carregamento indefinido

**Evidência:** abortar a requisição de logout manteve a UI autenticada sem qualquer explicação; o navegador relatou uma rejeição de fetch não tratada.

O `logoutApi` define o estado de carregamento, aguarda a requisição e só limpa a autenticação local em caso de sucesso. Não há tratamento de falhas para restaurar o estado de carregamento ou fornecer feedback.

**Mudança recomendada:** trate falhas de logout explicitamente, resolva o estado de carregamento em todos os caminhos e forneça uma opção clara de tentativa posterior. Distinga a limpeza de UI local da revogação de sessão confirmada no servidor.

**Cobertura de regressão:** falhas de rede, falhas no servidor e logouts bem-sucedidos devem, cada um, produzir um estado visível intencional.

**Local:** [authApi.js](src/api/authApi.js), linhas 121–132.

### R05 — Média: sessões inválidas mantêm o frontend autenticado

**Evidência:** uma resposta simulada do carrinho com HTTP 401 e `type_error: "invalid"` manteve o carrinho protegido visível. A UI sugeriu tentar novamente uma operação que exigia autenticação.

O fluxo de autorização que não é por expiração lança um erro sem invalidar a sessão existente no frontend.

**Mudança recomendada:** centralize o tratamento de sessões autenticadas inválidas, limpe o estado de usuário desatualizado e oriente o usuário para o login. Preserve a intenção de navegação útil quando apropriado. Mantenha respostas de login incorreto comuns distintas da invalidação de uma sessão já estabelecida.

**Limitação:** este é um defeito de estado/recuperação do frontend, não uma evidência de burla de autorização no backend.

**Local:** [requestJson.js](src/api/requestJson.js), linhas 84–88.

### R06 — Média: erros no checkout podem ser invisíveis

**Evidência:** retornar HTTP 500 para `/users/clearCart` manteve o carrinho inalterado sem explicação visível quando nenhum toast de operação anterior estava ativo.

O thunk define `cart.error`, enquanto a UI só renderiza feedback se `operationText` estiver preenchido. Ele exibe esse texto separado em vez do erro em si.

**Mudança recomendada:** renderize erros de checkout diretamente, resolva o estado de carregamento e ofereça uma nova tentativa. Forneça também um feedback explícito de sucesso.

**Cobertura de regressão:** um checkout com falha e `operationText` vazio deve exibir a falha e reter o carrinho.

**Locais:** [cartApi.js](src/api/cartApi.js), linha 146; [CartMain.jsx](src/Components/cartComponents/CartMain.jsx), linhas 73–74.

### R07 — Média: edições de carrinho que falham navegam para fora e perdem a quantidade inserida

**Evidência:** editar a quantidade de duas para três unidades com uma requisição com falha redirecionou de volta ao carrinho exibindo duas unidades.

O componente aguarda o thunk, mas o thunk captura seus erros e é resolvido. O componente então navega incondicionalmente. Aguardar a conclusão não garante sucesso.

**Mudança recomendada:** retorne um resultado de operação explícito ou propague a falha. Navegue apenas em caso de sucesso; mantenha a quantidade inserida disponível para nova tentativa.

**Locais:** [Product.jsx](src/Components/productsComponents/Product.jsx), linhas 55–70; [cartApi.js](src/api/cartApi.js), linhas 52–66.

### R08 — Média: cadastro e login divergem no limite do tamanho das credenciais

**Evidência:** com uma resposta de API simulada com sucesso, um nome de usuário com 100 caracteres foi autenticado no cadastro. O login com o mesmo nome de usuário foi rejeitado localmente sem realizar uma requisição.

O cadastro rejeita tamanhos maiores que 100, o login rejeita tamanhos maiores ou iguais a 100, e ambos os campos de entrada permitem 100 caracteres. As verificações de senha possuem a mesma inconsistência. Se o backend real aceita esse limite, isso não foi testado.

**Mudança recomendada:** compartilhe as regras de validação de credenciais e alinhe-as com o contrato do backend.

**Cobertura de regressão:** tamanhos de 99, 100 e 101 caracteres para nome de usuário e senha.

**Locais:** [authApi.js](src/api/authApi.js), linhas 39–40 e 78; [Input.jsx](src/Components/loginComponents/Input.jsx), `maxLength`.

### R09 — Média: falha no servidor após atualização (refresh) bem-sucedida desconecta o usuário

**Evidência:** a sequência abaixo limpou a autenticação do frontend:

1. A requisição original retorna HTTP 401 com resposta de token expirado.
2. A atualização (refresh) é bem-sucedida com `status: "refreshed"`.
3. A nova tentativa da requisição original retorna HTTP 500.

O código trata qualquer tentativa frustrada como uma falha de autenticação. Separadamente, `!newData?.status === "refreshed"` compara um booleano com uma string e não consegue validar o status de atualização conforme pretendido.

**Mudança recomendada:** distinga falhas de servidor de rejeições de autenticação, valide a resposta de refresh explicitamente e só invalide a sessão quando o resultado da autenticação exigir.

**Cobertura de regressão:** refresh bem-sucedido seguido de 200, 401 e 500, além de respostas de refresh com falha ou malformadas.

**Local:** [requestJson.js](src/api/requestJson.js), linhas 69–79.

### R10 — Média: validação aceita produtos malformados que quebram os consumidores de dados

**Evidência:** o `verifyProduct` aceitou um produto com `alias` numérico, `categorias` em formato string e preço negativo. A busca subsequente lançou `product.alias.toLocaleLowerCase is not a function`.

O validador verifica a presença e a veracidade (truthiness) das chaves, mas não os tipos e intervalos exigidos pelos componentes consumidores. O `Object.keys` também pressupõe um objeto não nulo.

**Mudança recomendada:** valide o formato da API antes de armazená-lo: estrutura do objeto, campos de texto, arrays de categorias e preços finitos dentro das regras de negócio suportadas. Trate entradas inválidas sem quebrar todo o catálogo.

**Cobertura de regressão:** entradas nulas, tipos de campos incorretos, arrays de categorias malformados e valores numéricos inválidos.

**Locais:** [ProductChecker.js](src/utils/ProductChecker.js), linhas 8–17; [productsSlice.js](src/slices/productsSlice.js), reducers de ingestão e busca de produtos.

### R11 — Média: teste de sucesso de produto aceita um objeto de erro

**Evidência:** um HTTP 404 simulado produziu `{ "error": "..." }`; a avaliação da asserção de sucesso existente ainda assim retornou `true`.

O teste apenas verifica se o objeto retornado e o objeto armazenado contêm pelo menos uma chave. Ele também despacha manualmente o resultado do loader em uma store separada, o que não verifica o estado que o próprio loader atualizou.

**Mudança recomendada:** garanta a asserção do ID de produto esperado e dos valores obrigatórios, a ausência de um resultado de erro e a transição de estado pretendida. Separe os contratos de resultados de sucesso e falha do loader.

**Local:** [products.test.js](src/test/products.test.js), linhas 106–118.

## Mudanças recebidas: padrões e consistência

Nenhum padrão de código autoritativo foi encontrado no repositório. As seguintes observações de consistência são distintas de violações formais de padrões.

### R12 — Média: alteração na mensagem de login deixa asserções E2E desatualizadas

**Introduzido pelo diff revisado.** O `LoginMain` agora renderiza `authError`, mas os testes E2E para desktop e mobile ainda esperam o texto fixo removido, `Usuário ou senha não existem tente de novo`.

A mensagem atual do thunk para credenciais incorretas é `Usuário ou senha não encontrados, tente novamente mais tarde`. As asserções não correspondem a esse comportamento. Isso foi estabelecido pela leitura do componente alterado e suas asserções; a suíte E2E completa dependente do backend não foi executada.

**Mudança recomendada:** atualize o contrato de mensagem de erro e suas asserções conjuntamente. Cubra cenários distintos de validação, credenciais incorretas e erros de rede, incluindo mensagens localizadas e legíveis.

**Locais:** [LoginMain.jsx](src/Components/loginComponents/LoginMain.jsx), linha 53; [userflow.spec.js](src/e2e/userflow.spec.js), linha 174; [mobileUserflow.spec.js](src/e2e/mobileUserflow.spec.js), linha 184.

### C01 — Decisão de design: definições duplicadas de CSP divergiram

O arquivo `index.html` commitado permite `https://*.onrender.com`, enquanto o cabeçalho no Vercel commitado não permite mais. O `vercel.json` local preservado contém o caractere coringa (wildcard), portanto o estado local difere da `main` revisada e commitada.

A diferença demonstra divergência na manutenção da política. Não é, por si só, prova de que a API de produção atual esteja bloqueada ou de que a política no HTML se sobreponha a um cabeçalho de resposta mais restritivo.

**Mudança recomendada:** mantenha uma fonte única para a política ou políticas explicitamente verificadas por ambiente. Verifique a configuração efetiva implantada ao alterar os hosts da API.

**Locais:** [index.html](index.html), linha 9; [vercel.json](vercel.json), linha 14. Use `git show 3125e63:<caminho>` para inspecionar as versões commitadas em vez das sobreposições locais.

Remover a invocação duplicada do Playwright e fornecer a variável de API antes da invocação restante são melhorias. Aumentar o limite de tempo limite de 60 para 120 minutos não resolve falhas de configuração, asserções desatualizadas ou instabilidade em fixtures.

## Mudanças recebidas: comportamento documentado

Nenhum problema de origem ou especificação formal estava disponível. O README reescrito foi usado como um contrato de comportamento documentado, não como prova de que todas as capacidades de backend descritas existem.

### R13 — Média: testes repetíveis exigem fixtures que o README não estabelece

O README afirma que execuções repetidas de E2E podem ser executadas sem conflitos. Os auxiliares existentes selecionam nomes de usuário entre apenas 1.000 sufixos possíveis, com registros de API persistentes e sem limpeza nos testes revisados. Alguns cenários de login exigem, em vez disso, uma conta fixa `TEST_CART`. Cenários de produtos também dependem de fixtures de catálogo existentes. A geração aleatória de quantidade pode produzir zero, desativando o botão de compra.

Esses problemas de implementação de teste são anteriores ao diff; a afirmação mais forte de repetibilidade é uma documentação nova.

**Mudança recomendada:** crie dados de teste isolados e determinísticos; use identidades de conta únicas; popule o catálogo necessário; limpe os registros de teste; e use quantidades explicitamente válidas, exceto em testes de entrada inválida. Documente esses pré-requisitos.

**Locais:** [README.md](README.md), linha 237; [constants_e2e.js](src/e2e/constants_e2e.js), linhas 4–5; [userflow.spec.js](src/e2e/userflow.spec.js), linhas 41 e 66; [mobileUserflow.spec.js](src/e2e/mobileUserflow.spec.js), linhas 75 e 139.

### R14 — Baixa: instruções de configuração da API omitem a mudança de diretório

As novas instruções clonam o `api_products` e imediatamente criam um ambiente, instalam os requisitos e executam o `app.py`. Clonar o repositório não altera o diretório no terminal.

**Mudança recomendada:** adicione `cd api_products` após a clonagem. Remova suposições sobre um ambiente virtual local já existente nas instruções de clonagem do zero.

**Local:** [README.md](README.md), linhas 106–117.

As instruções de teste também rotulam o comando direto `npm test` como uma execução única, enquanto o script configurado é `vitest` em modo contínuo. Documente `npm test -- --run` para execução única explícita e distinga o comportamento de monitoramento (watch) local da execução em CI.

A promessa do README de fornecer feedback sobre operações também foi apenas parcialmente implementada: consulte R06 e R07.

## Melhorias de produto e UX

Estas são recomendações, não alegações adicionais de defeitos reproduzidos no backend.

| Área | Mudança recomendada | Razão |
| --- | --- | --- |
| Texto do checkout | Rotule claramente o fluxo atual como uma simulação ou adicione um fluxo de confirmação de pedido/pagamento. | A ação "Pagar o carrinho" do frontend chama um endpoint de limpeza de carrinho. Limpar um carrinho não confirma um pagamento concluído. |
| Navegação antes da autenticação | Permita que visitantes inspecionem detalhes do produto antes de exigir login; preserve o produto pretendido durante a autenticação. | Exigir login na etapa de detalhes interrompe a avaliação do produto. |
| Layout de compra mobile | Reduza o espaço ocupado pela imagem do produto e aproxime os controles de compra da visualização inicial. | Na viewport inspecionada de 380 × 840, os controles de quantidade e compra ficaram abaixo da primeira tela. |
| Edição de quantidade | Preencha previamente a quantidade existente no carrinho e suporte a entrada por teclado numérico/decimal para produtos vendidos por peso. | A edição deve reter o contexto e facilitar a inserção de quantidades fracionadas válidas. |
| Legibilidade | Escureça textos em verde claro sobre fundos claros e melhore a hierarquia de informações do produto. | Diversos tratamentos de texto ficaram visualmente fracos nos layouts inspecionados. Esta não foi uma auditoria completa de contraste. |
| Controles acessíveis | Adicione rótulos visíveis significativos aos campos de entrada e um nome acessível ao botão de voltar. | Rótulos vazios e botões de ícone sem nome tornam os controles mais difíceis de identificar. |
| Exibição de preços | Use a formatação de moeda brasileira consistente, como `R$ 17,80`. | A exibição atual inclui formatos como `17.8 R$`. |

## Ordem de implementação recomendada

1. **Proteger a identidade do produto:** corrija o R01 e adicione o caso de regressão para resposta atrasada.
2. **Garantir a inicialização confiável:** corrija o R02 e o R03, incluindo cobertura do navegador sob configuração mínima.
3. **Tornar explícitas as transições de sessão:** aborde R04, R05 e R09 com testes separados para falhas de rede, servidor e autenticação.
4. **Clarear os resultados do carrinho:** aborde R06 e R07, preservando a entrada do usuário em caso de falha.
5. **Fortalecer os limites de dados:** alinhe os limites de credenciais em R08 e valide o formato dos produtos em R10.
6. **Tornar as verificações confiáveis:** corrija R11 e R12; isole as fixtures e atualize a documentação em R13 e R14.
7. **Melhorar a experiência de compra:** trate do texto de checkout, controles mobile, rótulos, contraste e formatação de preços.

Esta é apenas uma sequência proposta. Nenhum ajuste foi implementado como parte desta revisão.