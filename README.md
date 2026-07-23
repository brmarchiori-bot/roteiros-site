# Menos Roteiros

> Onde o roteiro acaba, a gente começa.

Site oficial e ecossistema digital da marca **Menos Roteiros** — diário público de viagem real.

---

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack default
- [React 19.2](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org) — strict
- [Tailwind CSS 4](https://tailwindcss.com) — CSS-only, sem `tailwind.config`
- [Sanity CMS](https://www.sanity.io/) — seções integradas e portfólio privado
- [pnpm](https://pnpm.io)
- [Vercel Analytics](https://vercel.com/analytics) — Web Vitals + tráfego sem cookies

## Estrutura

```
menos-roteiros-site/
├── docs/                    ← estratégia + auditoria técnica
├── public/                  ← ativos estáticos (imagens, vídeos)
└── src/
    ├── app/                 ← App Router
    │   ├── (marketing)/     ← rotas públicas com header + footer
    │   ├── portfolio/       ← apresentação privada por chave secreta
    │   ├── icon.tsx         ← favicon programático
    │   ├── apple-icon.tsx   ← Apple Touch Icon
    │   ├── opengraph-image.tsx  ← OG card pra compartilhamentos
    │   ├── manifest.ts      ← PWA manifest
    │   ├── robots.ts        ← /robots.txt
    │   └── sitemap.ts       ← /sitemap.xml
    ├── components/
    │   ├── layout/          ← header, footer, container, primitivos de seção
    │   ├── sections/        ← 10 seções da home (uma pasta cada)
    │   ├── seo/             ← componente <JsonLd>
    │   ├── shared/          ← peças visuais reutilizáveis
    │   └── ui/              ← primitivos genéricos (Button)
    ├── content/             ← conteúdo editável (config + arquivos por seção)
    ├── sanity/              ← client, schemas, queries e estrutura do Studio
    ├── hooks/               ← React hooks customizados
    ├── lib/                 ← utilitários (cn, fonts, seo, constants)
    ├── styles/              ← estilos compartilhados
    └── types/               ← tipos TypeScript do conteúdo
```

---

## Comandos

```bash
pnpm dev          # rodar em desenvolvimento
pnpm build        # build de produção
pnpm start        # servir build local
pnpm lint         # ESLint
pnpm typecheck    # TypeScript --noEmit
```

---

## Variáveis de ambiente

```bash
cp .env.example .env.local
```

Variáveis disponíveis:

| Variável | Obrigatório | Quando preencher |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sim em produção | URL final do site, sem barra no fim |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Não | Token do Google Search Console |
| `NEXT_PUBLIC_BING_VERIFICATION` | Não | Token do Bing Webmaster |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | Não | Token Yandex |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | CMS | ID do projeto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | CMS | Dataset publicado |
| `PRIVATE_PORTFOLIO_SLUG` | Portfólio | Chave aleatória com pelo menos 24 caracteres |
| `RESEND_API_KEY` | Futuro | Quando integrar backend de email |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Não | Se preferir Plausible em vez de Vercel Analytics |

---

## Como editar conteúdo

Hero, Sobre, Agora, Conteúdo, FAQ e Portfólio Privado podem ser editados no Sanity Studio em
`/studio`. Sem configuração do Sanity, as seções públicas usam os fallbacks tipados abaixo.
O portfólio privado não usa conteúdo fictício nem fallback público.

As demais seções e os fallbacks vivem em `src/content/`:

| Arquivo | O que mexer |
|---|---|
| `site.config.ts` | Nome da marca, tagline, links de redes, contato, navegação |
| `hero.ts` | Headline, subheadline e CTAs do hero |
| `manifesto.ts` | Texto do manifesto + assinatura |
| `about.ts` | 3 capítulos da história + foto |
| **`now.ts`** | **Dia X · cidade · período · foto · caption — atualizar toda semana** |
| `pillars.ts` | 4 pilares de conteúdo |
| `content-highlights.ts` | Reels em destaque + canais |
| `club.ts` | Caderno de Viagem (newsletter) |
| `coming-soon.ts` | Produtos em construção |
| `partnerships.ts` | Filosofia + 3 formatos + números + CTAs |
| `faq.ts` | Perguntas e respostas |

Cada arquivo é validado por TypeScript. Se você esquecer um campo, o build falha com mensagem clara.

---

## Deploy na Vercel (recomendado)

A Vercel é a forma mais simples de hospedar Next.js. Deploy em 4 minutos:

1. Crie conta em [vercel.com](https://vercel.com) com GitHub
2. Faça push do projeto pra um repositório GitHub:
   ```bash
   git init
   git add .
   git commit -m "Menos Roteiros — primeira versão"
   git branch -M main
   git remote add origin git@github.com:SEU_USUARIO/menos-roteiros-site.git
   git push -u origin main
   ```
3. No dashboard da Vercel: **Add New → Project** → seleciona o repo
4. Em **Environment Variables**, cole `NEXT_PUBLIC_SITE_URL` apontando pro domínio final
5. Clica **Deploy**

A Vercel detecta Next.js automático. Build leva ~2min. Depois cada `git push` na branch main vira deploy automático.

### Domínio próprio (`menosroteiros.com.br`)

No projeto da Vercel: **Settings → Domains → Add Domain** → digita `menosroteiros.com.br`.

Vercel mostra os registros DNS pra apontar (CNAME ou A). Configurar no painel do registrador (Registro.br ou onde estiver registrado). Propagação ~1h.

### Vercel Analytics

Ativa automaticamente após o primeiro deploy — sem precisar mexer em nada. Acesse em **Analytics** no dashboard da Vercel após algumas horas de tráfego.

---

## Portfólio privado

O portfólio não aparece na navegação nem no sitemap. Para ativá-lo:

1. Defina `PRIVATE_PORTFOLIO_SLUG` com uma chave aleatória de pelo menos 24 caracteres.
2. Publique o documento **Portfólio privado** no Sanity Studio.
3. Compartilhe manualmente `/portfolio/VALOR_DA_CHAVE`.

A rota usa `noindex`, `nofollow`, `no-store` e retorna 404 para chaves inválidas.

## Como editar a jornada

Toda semana, abre `src/content/now.ts` e edita:

```ts
{
  city: 'Piauí',         // ou onde estiver
  state: 'Sertão norte', // sub-localização
  country: 'Brasil',
  date: '2026-04-20',    // ISO (pra SEO)
  period: 'Abril/2026',  // display ("Junho/2026", "Maio/2026", etc.)
  dayCount: 47,          // incrementa
  coordinates: '−5.09° S · −42.80° W',  // opcional, dá tato editorial
  photo: {
    src: '/images/now/current.jpg',  // path quando subir foto real
    alt: '...',
    caption: 'Piauí · Abril/2026',
  },
  caption: '...3 linhas de diário...',
  cta: { label: '...', href: '...' },
}
```

Salva, faz commit + push. Vercel redeploya em ~2min. Marcador atualiza no header, hero, footer e seção Now simultaneamente.

---

## Troubleshooting

### "Internal Server Error" no localhost

Cache do Turbopack ficou stale. Resolve com:

```bash
pkill -9 -f "next" || true
rm -rf .next
pnpm dev
```

### Conteúdo não aparece no Safari iOS

Já corrigido (PASSO 7). Se voltar a acontecer, é provavelmente a animação `Reveal`. O componente em `src/components/shared/reveal.tsx` usa CSS animation pura — se modificar, mantenha esse padrão (não use IntersectionObserver direto, que tem suporte irregular no WebKit antigo).

### Porta 3000 ocupada

Outro projeto rodando. Next escolhe próxima porta automaticamente — leia a linha `Local: http://localhost:XXXX` no terminal e use a porta exata.

### Lint reclamando de `setState` em `useEffect`

React 19 não permite mais. Use callback de evento (onClick, onSubmit) ou derive durante render.

---

## Documentos da marca

Pasta [`docs/`](./docs/):

- [`ETAPA-01-ESTRATEGIA.md`](./docs/ETAPA-01-ESTRATEGIA.md) — direção criativa, posicionamento, identidade visual, voz
- [`AUDITORIA-TECNICA.md`](./docs/AUDITORIA-TECNICA.md) — visão técnica completa do projeto

---

## Status atual

**Funcional:**
- 10 seções da home construídas e responsivas
- 3 schemas Schema.org no HTML (Organization, WebSite, FAQPage)
- OG image dinâmica + favicon próprio
- Vercel Analytics integrada
- Acessibilidade WCAG (skip-to-content, aria-labels, foco visível)

**Pendente pra produção:**
- Mídia real (foto de Andressa + Bruno, vídeo do hero, thumbnails de Reels)
- URLs sociais preenchidas em `siteConfig.social`
- WhatsApp comercial em `siteConfig.contact.whatsapp`
- Mídia kit PDF em `/public/midia-kit.pdf`
- Backend de email — formulários permanecem desativados e informam que não coletam dados
