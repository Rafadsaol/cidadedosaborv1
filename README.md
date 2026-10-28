# Cidade do Sabor — versão 3.0 demonstrativa

Frontend demonstrativo de uma hamburgueria fictícia, criado com Next.js App Router, TypeScript, Tailwind CSS 4 e Lucide React. Identidade escura, vermelho e laranja, tipografia Poppins e Inter (Google Fonts distribuídas localmente via Fontsource), fotografias locais em WebP e hambúrgueres em PNG transparente e componentes reutilizáveis.

## Executar no VS Code

Pré-requisito: Node.js 24 LTS e npm. A versão usada neste ambiente está em `.nvmrc`.

Dentro da pasta `restaurante-git`:

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Next.js no seu computador. Para atualizar a cópia local após alterações enviadas ao GitHub, execute `git pull origin main` e `npm ci` antes de iniciar novamente. Se você tiver alterações locais, faça commit ou guarde-as antes do pull; não use reset para descartá-las.

A cópia local no VS Code e o ambiente na nuvem são checkouts separados. Arquivos são sincronizados por Git; processos e dados do navegador não são sincronizados.

No PowerShell, se houver bloqueio de `npm.ps1`, use `npm.cmd ci` e `npm.cmd run dev`.

### Testar no celular pela rede Wi-Fi

Conecte o celular e o computador à mesma rede e execute `npm.cmd run dev` no PowerShell. Em outro terminal, use `ipconfig` e procure o Endereço IPv4 da conexão Wi-Fi. Abra `http://IP-DO-COMPUTADOR:3000` no navegador do celular, usando a porta exibida pelo servidor. Mantenha o computador e o servidor ligados; se o Windows solicitar acesso para o Node.js, permita em redes privadas.

O servidor escuta em `0.0.0.0`, e `next.config.ts` permite os endereços IPv4 das interfaces locais para as conexões de desenvolvimento. Isso evita que a página abra sem iniciar os botões por bloqueio da conexão do Next.js. Reinicie o servidor se o IP mudar ou após atualizar essa configuração.

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
  carrinho/                # Carrinho com personalizações
  checkout/                # Checkout e sucesso demonstrativos
  reservas/                # Formulário de simulação
  sobre/                   # História fictícia da marca
  contato/                 # Formulário e canais configuráveis
  login/ e cadastro/       # Escolha de perfis demo sem senha
  meus-pedidos/            # Histórico local do Cliente Teste
  admin/                  # Painel e telas de gestão V3
  layout.tsx, globals.css  # Estrutura e identidade visual
  error.tsx, loading.tsx, not-found.tsx
components/
  layout/                  # Cabeçalho, navegação móvel e rodapé
  products/                # Catálogo, ordenação e personalização
  checkout/                # Formulário e resumo detalhado
  ui/                      # Imagens com fallback, títulos e avisos
  demo-provider.tsx        # Estado da operação V3 e serviços locais
  admin/, orders/          # Gestão, gráficos e histórico de pedidos
  cart-provider.tsx        # Estado, limites, persistência e feedback
  cart-page.tsx, demo-form.tsx, auth-page.tsx
data/
  products.ts              # Produtos, categorias e preços em centavos
  customization.ts         # Adicionais, combos e frete fictício
  site.ts                  # Horários, endereço e canais fictícios
lib/cart.ts                # Normalização, preços, migração e agrupamento
lib/checkout.ts            # Validação local do checkout
lib/utils.ts               # Formatação de centavos e data local
types/index.ts             # Tipos dos produtos e carrinho
public/images/             # Imagens gastronômicas locais e fallback SVG
tests/site.spec.ts          # Regressão das funcionalidades V1
tests/v2.spec.ts            # Personalização, combos e checkout
tests/logic.spec.ts         # Preços, armazenamento e validação
playwright.config.ts
```

## V3: operação demonstrativa

Além do cardápio, personalização e carrinho da V2, a V3 inclui checkout com registro local de pedidos, histórico do cliente, reservas persistidas e painel administrativo com dashboard, gestão de pedidos/produtos/reservas, clientes fictícios, relatórios e restauração com confirmação.

Abra `/login` e escolha **Cliente Demo (Cliente Teste)** ou **Administrador Demo (Administrador)**. Não é necessário informar senha. O painel fica em `/admin`; o histórico em `/meus-pedidos`.

Todos os fluxos são demonstrativos. Nada é enviado ao restaurante, nenhum pagamento é processado e nenhuma reserva real é efetuada. Use dados fictícios: os dados de teste ficam no localStorage deste navegador. Computador e celular têm armazenamentos separados; abas da mesma origem acompanham as mudanças.

Consulte [Entrega V3](docs/V3.md) para funcionalidades, arquivos, acessos, regras dos relatórios, verificações, checklist de testes, limitações e pontos preparados para futura integração com backend. [Entrega V2](docs/V2.md) permanece como documentação histórica.

## Configuração futura

As fotos de bebidas, sobremesas e acompanhamentos usam composição horizontal 3:2, com o produto inteiro e espaço ao redor. A grade mantém essa proporção com `object-fit: contain`, sem recorte ou zoom no hover. Ao substituir fotos, preserve essa composição; os hambúrgueres continuam em PNG transparente.

Edite `data/products.ts` para os produtos (preços em centavos), `data/customization.ts` para adicionais, grupos de combos e frete simulado, e `data/site.ts` para os dados do estabelecimento. Os canais WhatsApp e Instagram começam vazios: a interface exibe seu estado indisponível em vez de links falsos. Apenas URLs HTTPS nos formatos aceitos são exibidas (`https://wa.me/NUMERO` e `https://www.instagram.com/PERFIL`). Não coloque segredos nesses arquivos públicos.

Não há integração externa obrigatória no runtime: imagens, fontes e dados estão locais. O acesso ao registro npm é necessário para instalar dependências.

Os gráficos locais usam React/SVG e tabelas acessíveis; não há dependência de API ou CDN. A descrição de todos os arquivos da V3 está em [Entrega V3](docs/V3.md#arquivos-e-arquitetura).

## Checklist de revisão manual

Use o [checklist da V3](docs/V3.md#checklist-de-exploração) para conferir a loja e a operação no celular, tablet e desktop, incluindo teclado e zoom de 200%.

## Ambiente na nuvem

Use o checkout existente em `/workspace/restaurante`; a tarefa já é isolada e não precisa de outro worktree. Dependências e build podem ser retidos pelo snapshot, mas os processos precisam ser iniciados novamente. As instruções de instalação e inicialização estão registradas na configuração do ambiente quando salvas pelo onboarding. Publicar o ambiente é uma ação separada na interface.
