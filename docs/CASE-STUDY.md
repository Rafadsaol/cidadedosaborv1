# Apresentação de portfólio — Cidade do Sabor

Rota: `/case-study`. Também há um link discreto **Case study do projeto** no rodapé da loja.

## Análise do projeto existente

A Cidade do Sabor V3 é uma demonstração frontend da loja e da operação de uma hamburgueria fictícia. A identidade confirmada no código usa preto `#181818`, vermelho `#E34B35`, laranja `#FFB347`, branco `#FFFFFF` e grafite `#242424`. Poppins compõe títulos e Inter, o texto; a vitrine usa Georgia como acento serifado. O símbolo da marca é a chama em Lucide React.

As rotas analisadas foram `/`, `/cardapio`, `/delivery`, `/carrinho`, `/checkout`, `/meus-pedidos`, `/reservas`, `/sobre`, `/contato`, `/login`, `/cadastro`, `/admin`, `/admin/pedidos`, `/admin/produtos`, `/admin/reservas`, `/admin/clientes`, `/admin/relatorios` e `/admin/configuracoes`, além dos estados de carregamento, erro e página não encontrada.

Os recursos implementados incluem carrossel com Web Animations API, busca sem acentos, categorias, ordenação e URL dos filtros, personalização e adicionais, combos, cálculos em centavos, carrinho persistido, checkout local, snapshots de pedidos, histórico e status, reservas, gestão local de catálogo, gráficos SVG, perfis demonstrativos e restauração com confirmação. O contato valida o formulário sem enviar mensagens. Fontes e imagens ficam locais.

A apresentação distingue as interações funcionais da operação simulada: não há backend, autenticação real, pagamento, envio de pedidos, reservas reais ou sincronização entre dispositivos. Dados persistidos pertencem ao mesmo navegador e origem; a atualização entre abas usa o evento `storage`. As imagens gastronômicas são geradas por IA, e os depoimentos e dados comerciais são fictícios.

O `package.json` e o código confirmam Next.js App Router, React, TypeScript, Tailwind CSS 4, CSS, Lucide React, Fontsource, Playwright, axe-core e ESLint. Context, localStorage/sessionStorage, SVG e Web Animations API são recursos efetivamente usados. Nenhuma biblioteca de gráficos externa, backend ou serviço de autenticação é anunciado como implementado.

## Apresentação

A página segue a estrutura editorial solicitada: hero, visão geral, identidade visual, galeria, funcionalidades, tecnologias, experiência, demonstração e conclusão. Usa CSS Modules para manter seus estilos isolados, navegação de seções com rolagem no celular, animações discretas com respeito a movimento reduzido, textos alternativos, hierarquia de títulos e links de ampliação das capturas.

O cabeçalho próprio aparece apenas em `/case-study`; as demais páginas preservam o cabeçalho existente. O rodapé da marca é compartilhado. Visitar a apresentação não troca o perfil nem altera intencionalmente os dados da demonstração.

## Capturas reais

Oito arquivos WebP em `public/images/case-study/` foram capturados da aplicação em execução em Chromium, com fontes e imagens carregadas. Não são interfaces inventadas ou geradas por IA:

| Arquivo | Origem | Dimensões da captura |
| --- | --- | --- |
| `inicio-desktop.webp` | `/` | 1440 × 1000 |
| `cardapio-desktop.webp` | `/cardapio` | 1440 × 1000 |
| `personalizacao-desktop.webp` | Diálogo de Cidade Original, adicional de bacon | 1440 × 1000 |
| `checkout-desktop.webp` | `/checkout`, carrinho e nome fictícios | 1440 × 1000 |
| `painel-desktop.webp` | `/admin`, perfil demo e dados de exemplo | 1440 × 1000 |
| `pedidos-desktop.webp` | `/admin/pedidos`, exemplos iniciais | 1440 × 1000 |
| `inicio-mobile.webp` | `/`, viewport 390 × 1000, DPR 2 | 780 × 2000 |
| `favoritos-mobile.webp` | Seção `#favoritos`, viewport 390 px, DPR 2 | 708 × 2056 |

O script usa contextos de navegador isolados, sem reutilizar dados pessoais ou perfis da sessão de quem desenvolve. As capturas são registros estáticos; valores e datas de exemplo podem diferir de uma nova sessão. Os screenshots mantêm a composição original, sem recortes de produtos ou montagens que sugiram funcionalidades inexistentes. A imagem inteira pode ser aberta pelos links da galeria.

Para atualizar as capturas, inicie o build de produção em um terminal e execute o script em outro:

```powershell
npm.cmd run build
npm.cmd run start
```

```powershell
node scripts/capture-case-study.mjs
```

O script usa `@playwright/test` e a instalação de Sharp disponível com Next.js. Usa `/usr/bin/chromium` quando presente; em outro ambiente pode usar o Chromium instalado pelo Playwright ou o caminho definido em `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. `CASE_STUDY_BASE_URL` permite alterar a origem padrão `http://127.0.0.1:3000`. Em seguida, gere o build novamente para incorporar as novas imagens. Nenhum dado do navegador do visitante é usado.

## Arquivos e verificação

- `app/case-study/page.tsx`: conteúdo editorial, metadados, imagens, navegação e links para demonstração.
- `app/case-study/case-study.module.css`: estilos responsivos isolados e animações.
- `components/site-frame.tsx`: seleção do cabeçalho próprio apenas na nova rota.
- `components/layout/footer.tsx`: acesso discreto à apresentação.
- `public/images/case-study/*`: capturas reais otimizadas.
- `scripts/capture-case-study.mjs`: reprodução das capturas.
- `tests/case-study.spec.ts`: rota, navegação, arquivos de captura, ampliação, links de demonstração, tamanhos de tela, movimento reduzido e auditoria automática de acessibilidade.

Verificações: `npm run lint`, `npm run typecheck`, `npm run build` e testes Playwright de `case-study.spec.ts` nos projetos desktop e mobile. Testes automatizados usam Chromium; não representam certificação de acessibilidade ou testes físicos em Safari e celular.

Resultado desta entrega: lint, TypeScript e build aprovados; seis testes de case study aprovados (três em desktop e três em mobile). Conferidas larguras de 320, 390, 768, 1024 e 1440 px e auditorias automáticas de acessibilidade em 390 e 1440 px.
