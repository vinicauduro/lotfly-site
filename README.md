# lotfly.com.br

Endereço principal do Lotfly. Por enquanto leva direto para o sistema, em
https://app.lotfly.com.br/ (repositório `lotifly`). Depois, vira a página de vendas.

Publicado pelo GitHub Pages (Settings › Pages › Deploy from a branch › `main` / raiz), com o
domínio no arquivo `CNAME`.

DNS no registro.br, zona de lotfly.com.br:
- quatro entradas **A** no nome em branco: 185.199.108.153, 185.199.109.153,
  185.199.110.153, 185.199.111.153;
- **CNAME** `www` → `vinicauduro.github.io`;
- **CNAME** `app` → `vinicauduro.github.io` (o sistema).
