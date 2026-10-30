# Demonstração de portfólio na Cloudflare Pages

Projeto conceitual, sem compras, pedidos, pagamento ou autenticação reais. Use somente dados fictícios. Os dados da demonstração ficam no navegador, não em um banco hospedado.

- Repositório: Rafadsaol/cidadedosaborv1, branch main.
- Framework no painel: None (o comando abaixo faz o build).
- Diretório raiz: vazio (raiz do repositório).
- Comando: `npm run build:demo`.
- Diretório de saída: `out`.
- Variável de ambiente: `NODE_VERSION=24`.
- Subdomínio pretendido: `cidadedosabor.dsaol.com.br` (associar em Custom domains após publicar e validar o endereço pages.dev).

`public/_headers` permite incorporar a demonstração somente nela mesma e nas origens dsaol.com.br, www.dsaol.com.br e dsaolv1.pages.dev. Não configurar X-Frame-Options: DENY/SAMEORIGIN, pois bloquearia a incorporação entre os sites. A configuração de cabeçalhos precisa ser validada novamente no domínio público.

Nenhum domínio é configurado pelo build. O projeto deve ser criado como **Pages**, não Workers. Não enviar arquivos .env, banco ou credenciais. Os painéis existentes são demonstrativos e continuam disponíveis.
