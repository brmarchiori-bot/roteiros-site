# Menos Roteiros

> Onde o roteiro acaba, a gente começa.

Casa digital e diário público de Andressa e Bruno. O produto foi desenhado como documentação
viva de uma mudança de vida: editorial, humano e direto, sem linguagem de agência ou turismo
genérico.

## Estado do produto

- Home editorial enxuta, visual e estática, organizada em sete capítulos.
- Hero, Agora, Sobre, Pilares, Conteúdo, Parcerias e FAQ editáveis pelo Sanity, com fallback
  local tipado.
- Sanity Studio em `/studio`.
- Portfólio privado dinâmico, fora da navegação e protegido por chave.
- Cinco páginas futuras preservadas como `noindex` e fora do sitemap.
- Newsletter e lista de interesse visivelmente indisponíveis até existir backend real.
- SEO técnico, JSON-LD, Open Graph, Analytics, headers de segurança e CSP.
- Testes unitários e E2E para os fluxos críticos.

## Stack

- Next.js 16.2.11, App Router e Turbopack
- React 19.2.8
- TypeScript strict
- Tailwind CSS 4
- Sanity 5 e `next-sanity`
- Vercel Analytics
- Vitest e Playwright
- pnpm

## Desenvolvimento local

Requisitos: Node.js 20+ e pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Sem variáveis do Sanity, a home usa conteúdo local e `/studio` apresenta instruções de
configuração. Arquivos `.env*` não são versionados, exceto `.env.example`.

## Comandos

```bash
pnpm dev          # desenvolvimento
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm test         # testes unitários
pnpm test:e2e     # build de produção + Playwright
pnpm build        # build de produção
pnpm start        # servir o build
pnpm audit --prod # auditoria das dependências de produção
```

O Playwright usa o Google Chrome instalado no macOS quando disponível. Em CI ou em outro
sistema, instale o Chromium uma vez:

```bash
pnpm exec playwright install chromium
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública sem barra final |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID público do projeto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset, normalmente `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Versão estável da API |
| `PRIVATE_PORTFOLIO_SLUG` | Chave secreta de 24+ caracteres para o portfólio |
| `ENABLE_PASSWORD` | `true` ativa Basic Auth no site/preview |
| `BASIC_AUTH_USER` | Usuário do preview |
| `BASIC_AUTH_PASSWORD` | Senha do preview |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console, opcional |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing Webmaster, opcional |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Yandex, opcional |

Valores com prefixo `NEXT_PUBLIC_` chegam ao navegador e nunca podem conter segredo. A chave do
portfólio e as credenciais Basic Auth são exclusivamente de servidor.

## Conteúdo e Sanity

Abra `/studio` e publique os singletons:

| Documento | Onde aparece |
|---|---|
| Capa / Hero | Primeira tela |
| Seção Sobre | História e imagens |
| Seção Agora | Local, dia, diário e marcador global |
| Pilares de conteúdo | Os quatro assuntos centrais do projeto |
| Seção Conteúdo | Destaques e canais |
| Seção Parcerias | Posicionamento, categorias e contatos comerciais |
| Seção FAQ | Acordeão e JSON-LD |
| Portfólio privado | Apresentação manual para parceiros |

Manifesto, Caderno e produtos futuros continuam preservados em `src/content`, mas não são
renderizados enquanto não existem produtos reais. Os documentos públicos integrados têm
fallback no mesmo diretório.

Erros do Sanity são registrados no servidor e caem no fallback. Sem documento publicado, o
portfólio mostra um **Preview Editorial** claramente identificado como demonstração fictícia.
Assim que existe conteúdo real no Sanity, ele substitui o preview automaticamente.

### Rotina editorial

1. Atualizar **Seção Agora** quando a cidade ou a etapa mudar.
2. Trocar até três **Destaques de conteúdo** quando existir um trabalho relevante.
3. Cadastrar novos trabalhos no portfólio quando forem produzidos.
4. Conferir alt text, enquadramento e links; abrir a home em mobile e desktop.
5. Rodar `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`.

Se o Sanity não estiver disponível, atualize `src/content/now.ts`; ele é o fallback da jornada.

## Portfólio privado

O portfólio suporta categorias ordenáveis e trabalhos com:

- título, cliente, cidade, data, formato e destaque;
- publicação ou ocultação;
- capa, imagens, Reels, YouTube e vídeos verticais/horizontais;
- descrição, objetivo, serviços, resultado e depoimento;
- links complementares e contato final.

O conteúdo demonstrativo fica centralizado em `src/content/preview-content.ts`. Ele serve somente
para validar a direção visual e nunca deve receber nomes, resultados ou depoimentos que possam
ser confundidos com trabalho real.

Configuração:

1. Gere uma chave aleatória com pelo menos 24 caracteres.
2. Defina `PRIVATE_PORTFOLIO_SLUG` no ambiente.
3. Publique **Portfólio privado** no Studio.
4. Compartilhe manualmente `/portfolio/VALOR_DA_CHAVE`.

Proteções:

- chave inválida recebe HTTP 404 antes da renderização;
- comparação da chave evita diferença temporal simples;
- `noindex`, `nofollow`, `noarchive` e `noimageindex`;
- `Cache-Control: private, no-store`;
- nenhum link público e nenhuma entrada no sitemap;
- canonical removida da página privada.

O slug é uma barreira de compartilhamento privado, não uma conta individual. Para materiais
confidenciais por cliente, a evolução correta é autenticação com expiração.

## Formulários e contatos

Os formulários não coletam dados enquanto não existe provedor configurado. O código possui um
contrato tipado e independente de fornecedor em `src/lib/forms/lead.ts`, com:

- normalização e validação de email;
- consentimento obrigatório;
- honeypot anti-spam;
- limites de payload;
- interface para adaptador de provedor;
- resultados de sucesso/erro tipados.

Para ativar inscrições ainda faltam credenciais, política de privacidade publicada, rate limit
persistente e um adaptador. A opção mais simples para campanhas é Brevo; nenhum serviço deve ser
contratado ou ativado sem decisão do responsável.

Parceiros podem usar o WhatsApp ou `parcerias@menosroteiros.com.br`. O antigo link para um PDF
inexistente foi substituído por solicitação direta por email.

## SEO e publicação

- Apenas `/` aparece no sitemap.
- Rotas futuras usam `noindex`.
- FAQ exibida e FAQPage JSON-LD vêm da mesma resolução.
- Metadata global inclui canonical, Open Graph e Twitter.
- Portfólio possui metadata e headers privados próprios.
- `robots.txt` aponta para o sitemap público.

Antes de um lançamento:

1. Preencher `NEXT_PUBLIC_SITE_URL` com o domínio final.
2. Confirmar as variáveis do Sanity.
3. Atualizar o conteúdo real de **Agora**.
4. Verificar emails, WhatsApp e redes sociais.
5. Rodar toda a validação abaixo.
6. Fazer deploy de preview e inspecionar antes de produção.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm audit --prod
```

## Segurança

O site aplica HSTS, `nosniff`, proteção de frame, Referrer Policy, Permissions Policy e CSP.
A política pública bloqueia objetos, limita frames ao YouTube sem cookies e restringe conexão a
Sanity/Vercel. O Studio é excluído dessa CSP porque sua aplicação editorial possui requisitos
próprios.

`unsafe-eval` não é permitido. `unsafe-inline` permanece em scripts e estilos públicos porque o
Next.js está em geração estática e injeta bootstrap/estilos inline; trocar isso por nonce exigiria
renderização dinâmica de todas as páginas, com perda clara de cache e performance.

Nunca execute `pnpm audit fix --force`.

## Estrutura principal

```text
src/
├── app/          rotas, metadata, erros e portfólio
├── components/   layout, seções e UI
├── content/      conteúdo local e fallbacks
├── lib/          SEO, formulários e utilitários
├── sanity/       client, queries, schemas e Studio
└── types/        contratos de conteúdo e portfólio
tests/
├── unit/         validação, SEO e Proxy
└── e2e/          experiência pública e privada
```

Consulte também:

- [`docs/ETAPA-01-ESTRATEGIA.md`](./docs/ETAPA-01-ESTRATEGIA.md)
- [`docs/AUDITORIA-TECNICA.md`](./docs/AUDITORIA-TECNICA.md)
- [`docs/HOME-EDITORIAL.md`](./docs/HOME-EDITORIAL.md)
