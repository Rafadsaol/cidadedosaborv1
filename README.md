# Cidade do Sabor — versão 1.0

Frontend demonstrativo de uma hamburgueria fictícia, criado com Next.js App Router, TypeScript, Tailwind CSS 4 e Lucide React. Identidade escura, vermelho e laranja, tipografia Poppins e Inter (Google Fonts distribuídas localmente via Fontsource), imagens locais em WebP e componentes reutilizáveis.

## Executar no VS Code

Pré-requisito: Node.js 24 LTS e npm. A versão usada neste ambiente está em `.nvmrc`.

Dentro da pasta `restaurante-git`:

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Next.js no seu computador. Para atualizar a cópia local após alterações enviadas ao GitHub, execute `git pull origin main` e `npm ci` antes de iniciar novamente. Se você tiver alterações locais, faça commit ou guarde-as antes do pull; não use reset para descartá-las.

A cópia local no VS Code e o ambiente na nuvem são checkouts separados. Arquivos são sincronizados por Git; processos e dados do navegador não são sincronizados.

## Verificações

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Os testes E2E usam o build de produção e iniciam seu próprio servidor na porta 3000:

```bash
npm run build
npm run test:e2e
```

No ambiente na nuvem, os testes usam `/usr/bin/chromium`. Em um computador sem esse executável, instale o navegador com `npx playwright install chromium` e defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` para o caminho do Chromium instalado. O arquivo `playwright.config.ts` concentra essa configuração. Os projetos desktop e mobile usam Chromium; não representam testes em Safari ou dispositivos físicos.

## Estrutura

```text
app/
  page.tsx                 # Início
  cardapio/                # Pesquisa, categorias e produtos
  delivery/                # Proposta de entrega demonstrativa
  carrinho/                # Carrinho persistido localmente
  reservas/                # Formulário de simulação
  sobre/                   # História fictícia da marca
  contato/                 # Formulário e canais configuráveis
  login/ e cadastro/       # Interfaces visuais
  layout.tsx, globals.css  # Estrutura e identidade visual
  error.tsx, loading.tsx, not-found.tsx
components/
  layout/                  # Cabeçalho, navegação móvel e rodapé
  products/                # Catálogo, cards, grade e modal acessível
  ui/                      # Imagens com fallback, títulos e avisos
  cart-provider.tsx        # Estado, limites, persistência e feedback
  cart-page.tsx, demo-form.tsx, auth-page.tsx
data/
  products.ts              # Fonte única de produtos e categorias
  site.ts                  # Horários, endereço e canais fictícios
lib/utils.ts               # Moeda brasileira e data local
types/index.ts             # Tipos dos produtos e carrinho
public/images/             # Imagens gastronômicas locais e fallback SVG
tests/site.spec.ts          # Fluxos funcionais e responsividade
playwright.config.ts
```

## O que funciona no navegador

- Vitrine inicial com seletor de três hambúrgueres, setas, indicadores e adição do produto em destaque ao carrinho.
- Cabeçalho com marca centralizada, menu lateral com navegação por teclado, cidade ilustrativa, busca e carrinho.
- Navegação, menu móvel, busca por nome (sem diferenciar acentos ou maiúsculas) e filtro por categoria.
- Detalhes do produto em diálogo nativo com foco, Escape e fechamento pelo fundo.
- Carrinho: adicionar, remover, aumentar/diminuir (até 99 unidades por produto), contar itens e calcular subtotal em reais.
- Persistência do carrinho em `localStorage`, recuperação de dados inválidos e atualização entre abas. Quando o armazenamento é indisponível, o carrinho continua em memória.
- Validação nativa dos formulários, verificação de telefone/data futura nas reservas e confirmação de senha no cadastro.
- Feedback de adição, estados vazios e fallback de imagem.

## O que é demonstração

Não há servidor de aplicação, API, banco de dados, autenticação, pagamentos, envio de pedidos, mensagens ou reservas. O carrinho termina no subtotal, sem checkout. Nenhuma disponibilidade, prazo ou rastreamento de entrega é apresentado como real.

Os formulários são processados somente em memória, com dados fictícios; as senhas são apagadas após a validação e não são gravadas. Não use dados pessoais ou senhas reais. Não há cookies de autenticação. Os depoimentos, a história, o endereço, o telefone e os horários são fictícios e sinalizados. As imagens foram geradas por IA para este protótipo e são ilustrativas, não fotografias de produtos reais. Poppins e Inter mantêm suas licenças nos respectivos pacotes Fontsource.

## Configuração futura

Edite `data/products.ts` para os produtos e `data/site.ts` para os dados do estabelecimento. Os canais WhatsApp e Instagram começam vazios: a interface exibe seu estado indisponível em vez de links falsos. Apenas URLs HTTPS nos formatos aceitos são exibidas (`https://wa.me/NUMERO` e `https://www.instagram.com/PERFIL`). Não coloque segredos nesses arquivos públicos.

Não há integração externa obrigatória no runtime: imagens, fontes e dados estão locais. O acesso ao registro npm é necessário para instalar dependências.

## Checklist de revisão manual

Teste em celular, tablet e desktop, com teclado e zoom de 200%:

- [ ] **Início `/`:** conferir imagem principal, CTAs, benefícios, favoritos, combo, história, avaliações identificadas e rodapé.
- [ ] **Cardápio `/cardapio`:** testar todas as categorias, busca com e sem resultados, limpar filtros, abrir detalhes, percorrer o modal com Tab, fechar com Escape e adicionar produtos.
- [ ] **Delivery `/delivery`:** conferir os avisos de simulação e os links para cardápio e carrinho; nenhum rastreamento real.
- [ ] **Carrinho `/carrinho`:** testar vazio, múltiplos produtos, quantidades, subtotal, remoção, recarregamento e abertura em outra aba. Conferir o limite de 99 e que não há pagamento.
- [ ] **Reservas `/reservas`:** testar campos vazios, telefone inválido, data passada e simulação válida. Confirmar a mensagem de que nenhuma reserva foi realizada.
- [ ] **Sobre `/sobre`:** conferir história fictícia, valores, imagem e navegação ao cardápio.
- [ ] **Contato `/contato`:** testar e-mail inválido, mensagem curta e sucesso demonstrativo. Conferir endereço e telefone fictícios, canais desativados e horários.
- [ ] **Login `/login`:** testar campos obrigatórios, mostrar/ocultar senha e mensagem sem sessão real.
- [ ] **Cadastro `/cadastro`:** testar senhas diferentes, senha curta e simulação válida; confirmar que os campos são limpos e nenhuma conta é criada.
- [ ] **Global:** testar menu móvel, link para pular ao conteúdo, foco visível, imagens/fallback, página 404 e ausência de rolagem horizontal.

## Ambiente na nuvem

Use o checkout existente em `/workspace/restaurante`; a tarefa já é isolada e não precisa de outro worktree. Dependências e build podem ser retidos pelo snapshot, mas os processos precisam ser iniciados novamente. As instruções de instalação e inicialização estão registradas na configuração do ambiente quando salvas pelo onboarding. Publicar o ambiente é uma ação separada na interface.
