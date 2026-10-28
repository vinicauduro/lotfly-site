# lotfly.com.br

Página de vendas do Lotfly. O sistema fica em https://app.lotfly.com.br/ (repositório `lotifly`).

Página estática, sem etapa de build:
- `index.html`, `estilo.css` e `pagina.js` (simulador de parcelas, régua da venda, prévia da lista,
  formulário que abre o WhatsApp);
- `img/`: telas e gravação do próprio sistema, com dados de demonstração;
- `fonts/`: Stack Sans Headline e Stack Sans Text (licença SIL Open Font License, Google Fonts).

**Antes de publicar:** preencher o número do WhatsApp em `pagina.js` (constante `WHATSAPP`, só
dígitos, com 55 e DDD). Enquanto estiver vazio, os botões levam ao formulário no fim da página.

Publicado pelo GitHub Pages (Settings › Pages › Deploy from a branch › `main` / raiz), com o
domínio no arquivo `CNAME`.

DNS no registro.br, zona de lotfly.com.br:
- quatro entradas **A** no nome em branco: 185.199.108.153, 185.199.109.153,
  185.199.110.153, 185.199.111.153;
- **CNAME** `www` → `vinicauduro.github.io`;
- **CNAME** `app` → `vinicauduro.github.io` (o sistema).
