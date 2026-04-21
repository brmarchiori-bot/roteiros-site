# Auditoria Técnica — Menos Roteiros

> Documento de transferência. Estado em 2026-04-20 · após conclusão do PASSO 5.
> Destinatário: especialista técnico assumindo continuidade do projeto.

---

## 1. Visão geral do projeto

### 1.1 Identidade

Site oficial e ecossistema digital da marca **Menos Roteiros** — projeto editorial de viagem real, criado por Andressa e Bruno. O site é o primeiro ativo comercial sério da marca; arquitetado para evoluir para um ecossistema completo (blog, comunidade, produtos digitais, mídia kit, parcerias).

Documento estratégico completo em [`docs/ETAPA-01-ESTRATEGIA.md`](./ETAPA-01-ESTRATEGIA.md). Toda decisão de produto deve ser cruzada com ele.

### 1.2 Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | **16.2.4** |
| Runtime React | React + ReactDOM | **19.2.4** |
| Linguagem | TypeScript (strict) | **^5** |
| Estilização | Tailwind CSS v4 (CSS-only, sem `tailwind.config`) | **^4** |
| Build/Dev | **Turbopack** (default no Next 16) | bundled |
| Pacote | pnpm | **10.33.0** |
| Lint | ESLint 9 (flat config) + `eslint-config-next` | **^9** / **16.2.4** |
| Animação | `motion` (sucessor do framer-motion) | **^12.38.0** |
| Ícones | `lucide-react` | **^1.8.0** *(instalado, ainda não consumido)* |
| Util | `clsx`, `tailwind-merge` | **^2.1.1**, **^3.5.0** |
| Fonts | `next/font/google` (Fraunces, Inter, JetBrains Mono) | bundled |

### 1.3 Arquitetura

- **App Router** com `src/` separado (boa prática de configs vs código)
- **Route Group** `(marketing)` agrupa páginas públicas com layout compartilhado (header + footer)
- **Conteúdo desacoplado**: pasta `src/content/` armazena todo texto/dado editável em arquivos `.ts` tipados
- **Server Components por default**; client components apenas onde estritamente necessário (`Nav`, `MobileMenu`, `NewsletterForm`, `Reveal`, `error.tsx`)
- **Tipos centralizados** em `src/types/content.ts` validam todos os arquivos de conteúdo
- **Static-first**: todas as 10 rotas atuais geradas como estáticas no build (`pnpm build` confirma `○ (Static)` para todas)
- Sem CMS, sem banco, sem autenticação no momento

### 1.4 Estado atual

**Concluídos:**
- ETAPA 01 — Estratégia (documento)
- PASSO 1 — Setup
- PASSO 2 — Limpeza + estrutura profissional
- PASSO 3 — Design System base (tokens, fontes, primitivos)
- PASSO 4 — Conteúdo desacoplado (10 arquivos em `src/content/`)
- PASSO 5 — Layout global refinado (header com active link, mobile menu, footer editorial)

**Em aberto:**
- PASSO 6 — Construção das 10 seções reais da home
- PASSO 7 — Refinamento responsivo
- PASSO 8 — SEO + Open Graph dinâmico
- PASSO 9 — Refinamento final + favicon próprio + PWA icons
- Backend de email (Resend/Loops)
- Integração com analytics (Plausible/Umami)
- CMS plugável (Sanity/Payload)
- Rotas placeholder (`/sobre`, `/parcerias`, etc.) ainda sem conteúdo

---

## 2. Estrutura de pastas

### 2.1 Árvore atual

```
menos-roteiros-site/
├── .env.example                   ← template (sem .env.local committed)
├── .gitignore
├── .prettierrc                    ← formatação consistente
├── AGENTS.md                      ← marker: Next 16 tem breaking changes
├── CLAUDE.md                      ← @AGENTS.md (referência)
├── README.md                      ← onboarding
├── eslint.config.mjs              ← flat config v9
├── next.config.ts                 ← vazio (defaults do Next 16)
├── next-env.d.ts                  ← gerado (não editar)
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml            ← ignoredBuiltDependencies (sharp, unrs-resolver)
├── postcss.config.mjs             ← @tailwindcss/postcss
├── tsconfig.json                  ← strict, paths "@/*" → ./src/*
│
├── docs/
│   ├── ETAPA-01-ESTRATEGIA.md     ← direção criativa + posicionamento
│   └── AUDITORIA-TECNICA.md       ← este documento
│
├── public/
│   ├── images/
│   │   ├── about/    .gitkeep     (vazia — fotos de Andressa + Bruno)
│   │   ├── now/      .gitkeep     (vazia — foto da semana atual)
│   │   ├── content/  .gitkeep     (vazia — thumbnails de Reels)
│   │   └── og/       .gitkeep     (vazia — Open Graph images)
│   └── videos/
│       └── hero/     .gitkeep     (vazia — vídeo loop do hero)
│
└── src/
    ├── app/                       ← App Router
    │   ├── (marketing)/           ← route group (URL: sem prefixo)
    │   │   ├── layout.tsx         ← skip-link + SiteHeader + main + SiteFooter
    │   │   ├── page.tsx           ← home (esqueleto consumindo content/)
    │   │   ├── caderno/page.tsx   ← placeholder
    │   │   ├── conteudo/page.tsx  ← placeholder
    │   │   ├── jornada/page.tsx   ← placeholder
    │   │   ├── parcerias/page.tsx ← placeholder
    │   │   └── sobre/page.tsx     ← placeholder
    │   ├── error.tsx              ← error boundary global ('use client')
    │   ├── globals.css            ← Tailwind v4 + tokens da marca
    │   ├── layout.tsx             ← root: html + body + fonts + metadata
    │   ├── loading.tsx            ← loading state global
    │   ├── manifest.ts            ← PWA manifest (sem icons ainda)
    │   ├── not-found.tsx          ← 404 com voz da marca
    │   ├── robots.ts              ← gera /robots.txt
    │   └── sitemap.ts             ← gera /sitemap.xml (6 rotas)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── container.tsx          ← wrapper com max-width responsive
    │   │   ├── mobile-menu.tsx        ← overlay full-screen ('use client')
    │   │   ├── nav.tsx                ← navegação com active link ('use client')
    │   │   ├── newsletter-form.tsx    ← inline form do Caderno ('use client')
    │   │   ├── section-header.tsx     ← kicker + título editorial
    │   │   ├── section.tsx            ← wrapper semântico de seção
    │   │   ├── site-footer.tsx        ← footer editorial 12-col
    │   │   └── site-header.tsx        ← header sticky + nav + mobile menu
    │   ├── sections/                  ← 10 pastas vazias .gitkeep (PASSO 6)
    │   │   ├── about/, club/, coming-soon/, content-bridge/,
    │   │   ├── faq/, hero/, manifesto/, now/, partnerships/, pillars/
    │   ├── shared/
    │   │   ├── journey-marker.tsx     ← "Dia 47 · Piauí · Abril/2026"
    │   │   └── reveal.tsx             ← scroll reveal ('use client')
    │   └── ui/
    │       └── button.tsx             ← Button + buttonStyles helper
    │
    ├── content/                       ← FONTE DA VERDADE de todo conteúdo editável
    │   ├── about.ts                   ← história Andressa + Bruno (3 capítulos)
    │   ├── club.ts                    ← Caderno de Viagem (newsletter)
    │   ├── coming-soon.ts             ← 4 produtos futuros
    │   ├── content-highlights.ts      ← Reels destaque + canais
    │   ├── faq.ts                     ← 5 perguntas
    │   ├── hero.ts                    ← copy do hero
    │   ├── index.ts                   ← barrel export
    │   ├── manifesto.ts               ← manifesto editorial
    │   ├── now.ts                     ← Dia X · cidade · período (FONTE única)
    │   ├── partnerships.ts            ← filosofia + 3 formatos + números
    │   ├── pillars.ts                 ← 4 pilares de conteúdo
    │   └── site.config.ts             ← marca, contato, navegação
    │
    ├── hooks/                         ← vazia (.gitkeep)
    ├── lib/
    │   ├── constants.ts               ← SITE_URL, BRAND_NAME (derivados)
    │   ├── fonts.ts                   ← Fraunces + Inter + JetBrains Mono
    │   └── utils.ts                   ← cn() = twMerge(clsx(inputs))
    ├── styles/                        ← vazia (.gitkeep)
    └── types/
        └── content.ts                 ← tipos de TODO arquivo em content/
```

### 2.2 Padrão adotado: papel de cada pasta

| Pasta | Papel | Regra |
|---|---|---|
| `src/app/` | **Roteamento + arquivos especiais do App Router** | Aqui só vai o que o Next.js conhece como convenção (page, layout, error, loading, route, manifest, sitemap, robots). |
| `src/app/(marketing)/` | Route group para páginas públicas com layout compartilhado | URL não inclui `(marketing)`. Permite criar `/admin` ou `/dashboard` futuramente em outro grupo, com outro layout. |
| `src/components/layout/` | Estrutura visual reutilizável global | Header, footer, container, nav, primitivos de seção. |
| `src/components/sections/` | Uma pasta por seção da home | Cada pasta vira o componente isolado da seção (PASSO 6). |
| `src/components/shared/` | Peças visuais reutilizáveis da marca | `JourneyMarker`, `Reveal`, futuros `GrainOverlay`, `EditorialQuote`. |
| `src/components/ui/` | Primitivos genéricos | `Button` + `buttonStyles`. Equivalente ao shadcn/ui customizado. |
| `src/content/` | **Conteúdo editável** (fonte única) | Arquivos `.ts` tipados. Editar conteúdo NÃO requer mexer em componente. |
| `src/lib/` | Utilitários e configs técnicas | `cn`, fontes, constantes. |
| `src/hooks/` | React hooks customizados | Vazia hoje. Reservada. |
| `src/styles/` | Estilos compartilhados além de globals.css | Vazia hoje. Reservada. |
| `src/types/` | Tipos TypeScript | `content.ts` define a estrutura de todos os arquivos em `src/content/`. |

### 2.3 Convenções de nome

- Componentes em `kebab-case.tsx` (arquivo) e `PascalCase` (export)
- Conteúdo em `kebab-case.ts` (arquivo) e `camelCase` (export)
- Tipos em `PascalCase` (`HeroContent`, `Pillar`, `SectionMeta`)
- Arquivos especiais do Next em lowercase (`page.tsx`, `layout.tsx`, etc.)

---

## 3. Sistema de layout e UI

### 3.1 Hierarquia de layouts

```
RootLayout (src/app/layout.tsx)
└── MarketingLayout (src/app/(marketing)/layout.tsx)
    └── Page (src/app/(marketing)/page.tsx ou nested)
```

#### `RootLayout`
- Define `<html>` (com `lang="pt-BR"`, `data-scroll-behavior="smooth"`, font variables)
- Define `<body>` com `bg-background text-foreground font-sans` + `min-h-full flex flex-col`
- Importa `globals.css`
- Define `metadata` global (title template, OG, Twitter)
- **Não tem chrome visual** — apenas estrutura raiz

#### `MarketingLayout`
- Renderiza `<a>` skip-to-content (acessibilidade WCAG)
- Renderiza `<SiteHeader />`, `<main id="main">`, `<SiteFooter />`
- Aplicado a TODAS as rotas dentro de `(marketing)/`

### 3.2 Header (`src/components/layout/site-header.tsx`)

- **Sticky** no topo (`top-0 z-50`), `border-b border-subtle`
- Background `bg-background/85 backdrop-blur-md` (blur ao scrollar)
- 3 áreas: logo (Fraunces, esquerda) · `<Nav />` desktop (centro) + CTA outline (direita) · `<MobileMenu />` (mobile only)
- Altura `h-16 md:h-20`

### 3.3 Footer (`src/components/layout/site-footer.tsx`)

Layout editorial em **12 colunas** (Tailwind grid):

```
┌───────────────────────────────────────────────────────────┐
│ Marca + tagline + JourneyMarker  │  Caderno + form         │
│ (col-span 6)                     │  (col-span 6)           │
├───────────────────────────────────────────────────────────┤
│ Navegar (3)  │ Canais (3, cond.) │ Contato (3) │ vazio (3) │
├───────────────────────────────────────────────────────────┤
│ © Copyright           ·             Tagline mono           │
└───────────────────────────────────────────────────────────┘
```

- Coluna **Canais** só renderiza se houver URL preenchido em `siteConfig.social`
- Newsletter form embedado (`<NewsletterForm />`) — UI funcional, backend pendente
- Mobile: tudo empilha em coluna única

### 3.4 Componentes globais

| Componente | Tipo | Descrição |
|---|---|---|
| `<Container>` | server | Wrapper com `max-width` responsive (`narrow`/`default`/`wide`), padding `px-6 md:px-10 lg:px-16` |
| `<Section>` | server | Wrapper semântico com `padding`, `border-bottom` opcional, `id` para anchor, props `spacing` (sm/md/lg/xl), `bare` para hero full-bleed |
| `<SectionHeader>` | server | Kicker (terracota mono) + Title (Fraunces) + Description; animado com `<Reveal>` em cascata; suporta `align="center"` |
| `<Nav>` | client | Lista de links de `siteConfig.nav`; ativo via `usePathname` + `aria-current="page"` |
| `<MobileMenu>` | client | Trigger + overlay full-screen com nav stacked Fraunces 4xl; ESC fecha; bloqueia scroll do body |
| `<NewsletterForm>` | client | Email input + submit; simula sucesso após 600ms (TODO: integrar `/api/subscribe`) |
| `<JourneyMarker>` | server | Lê `now.dayCount`, `now.city`, `now.period`; renderiza `Dia 47 · Piauí · Abril/2026` em mono |
| `<Reveal>` | client | Wrapper `motion.div` com `initial: { opacity: 0, y: 20 }`, `whileInView: visible`, `viewport: { once: true, margin: '-100px' }` |
| `<Button>` / `buttonStyles()` | server | 4 variantes (primary, secondary, ghost, outline) × 3 tamanhos (sm/md/lg); helper `buttonStyles()` para uso em `<Link>` |

### 3.5 Padrão de uso

```tsx
// Exemplo de seção (PASSO 6)
import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/layout/section-header'
import { manifesto } from '@/content'

export function ManifestoSection() {
  return (
    <Section id="manifesto" size="narrow">
      <SectionHeader meta={manifesto.meta} />
      {manifesto.paragraphs.map((p, i) => (
        <p key={i} className="mt-6 font-display text-2xl leading-relaxed">{p}</p>
      ))}
    </Section>
  )
}
```

---

## 4. Design System

### 4.1 Tipografia

3 fontes carregadas via `next/font/google` em `src/lib/fonts.ts` (zero CLS, expostas como CSS variables):

| Token | Variable CSS | Fonte | Uso |
|---|---|---|---|
| `font-display` | `--font-fraunces` | **Fraunces** (variable, axes `opsz` + `SOFT`) | Headlines, logo, links de navegação no mobile menu |
| `font-sans` | `--font-inter` | **Inter** | Texto corrido, UI, body default |
| `font-mono` | `--font-jetbrains-mono` | **JetBrains Mono** (weights 400, 500) | Kickers, datas, journey marker, footer labels |

Aplicação: `<html className={fontVariables}>` em `RootLayout`. `body` aplica `font-sans` por default.

**Decisão registrada:** ETAPA 01 propôs `Fraunces + General Sans + JetBrains Mono`. General Sans (Fontshare) foi substituído por **Inter** (Google Fonts) por simplicidade de integração via `next/font/google`. Migração futura para General Sans = baixar arquivos + trocar 3 linhas em `lib/fonts.ts` usando `next/font/local`.

### 4.2 Paleta — tokens CSS variables

Definidos em `:root` dentro de `src/app/globals.css`:

| Token CSS | Hex | Token Tailwind gerado | Uso |
|---|---|---|---|
| `--background` | `#F3EEE5` | `bg-background` | Fundo principal — areia quente editorial |
| `--foreground` | `#0E0E0D` | `text-foreground` | Texto principal — preto quente (não puro) |
| `--surface` | `#ECE5D8` | `bg-surface` | Cards, blocos com leve elevação |
| `--muted` | `#8A8175` | `text-muted` | Texto secundário, labels |
| `--subtle` | `rgba(14,14,13,0.08)` | `border-subtle` | Bordas, separadores |
| `--primary` | `#C4512A` | `bg-primary` / `text-primary` | Terracota Piauí — CTAs, kickers, hover |
| `--primary-foreground` | `#F3EEE5` | `text-primary-foreground` | Texto sobre primary |
| `--secondary` | `#3D4A2B` | `bg-secondary` | Verde sertão — profundidade, ainda não usado |
| `--secondary-foreground` | `#F3EEE5` | `text-secondary-foreground` | Texto sobre secondary |

### 4.3 Tailwind v4

- **Sem `tailwind.config.ts`**. Configuração inteira via `@theme inline` em `globals.css`.
- PostCSS plugin: `@tailwindcss/postcss` (configurado em `postcss.config.mjs`).
- Padrão de mapeamento: `:root` define raw CSS vars, `@theme inline` mapeia para tokens Tailwind via `var(--name)`. Permite override dinâmico (dark mode futuro etc.).
- Tokens de fonte mapeados para variables expostas pelo `next/font/google`.
- Radius custom: `radius-none`, `radius-sm` (2px), `radius-md` (4px), `radius-full` (9999px) — minimalismo editorial.

### 4.4 Padrões visuais

- **Texto seleção** muda para terracota com fundo creme (regra `::selection` em globals.css)
- **Foco visível** outline 2px terracota com 3px de offset (regra `:focus-visible` em globals.css)
- **Antialiasing** ativo (`-webkit-font-smoothing: antialiased`)
- **Font features** Fraunces ativa `'ss01'` por classe `.font-display`
- **Espaçamento de seções** padronizado: `py-28 md:py-36` (default `lg`)
- **Container** max-widths: `narrow` 3xl, `default` 6xl, `wide` 7xl
- **Tracking editorial** kickers e labels mono usam `tracking-[0.2em]` uppercase
- **Animações** sempre `ease: [0.22, 1, 0.36, 1]` (curva editorial cinematográfica)

---

## 5. Conteúdo e dados

### 5.1 Estratégia de conteúdo

**Princípio:** todo texto/dado editável vive em `src/content/` separado dos componentes. Bruno edita conteúdo SEM tocar em código de UI.

**Formato escolhido:** TypeScript (`.ts`) em vez de JSON ou MDX:
- Type safety via `import type { ... } from '@/types/content'`
- Comentários inline permitidos (JSON não permite)
- IntelliSense no VSCode
- Migração futura para MDX (rich prose) ou CMS é direta — tipos são o contrato

### 5.2 `siteConfig` (`src/content/site.config.ts`)

Configuração global da marca. Tudo que aparece em chrome (header, footer, metadata, contato) bebe daqui:

```ts
{
  name, tagline, shortTagline, description, url, locale,
  founders: { andressa, bruno },
  social: { instagram, youtube, tiktok },        // strings vazias hoje
  contact: { general, partnerships, whatsapp },
  nav: [{ label, href }, ...],                    // navegação principal
  primaryCta: { label, href },
  legal: { copyrightYear }
}
```

Tipo derivado via `as const` + `export type SiteConfig = typeof siteConfig`.

### 5.3 Tipos de conteúdo (`src/types/content.ts`)

Hierarquia:

**Primitivos:**
- `SectionMeta = { kicker, title? }`
- `Cta = { label, href }`

**Por seção:** cada uma tem seu wrapper com `meta: SectionMeta` + payload específico:
- `HeroContent` — headline + subheadline + 2 CTAs + media (video/poster/alt)
- `ManifestoContent` — meta + `paragraphs: string[]` + signature
- `AboutContent` — meta + `chapters: AboutChapter[]` + closingCta
- `NowContent` — city/state/country/date/period/dayCount/photo/caption/link
- `PillarsContent` — meta + `items: Pillar[]`
- `ContentBridgeContent` — meta + pullQuote + highlights + channels (instagram/youtube)
- `ClubContent` — meta + name + promise + rule + cta + socialProof
- `ComingSoonContent` — meta + intro + items
- `PartnershipsContent` — meta + philosophy + formats + numbers + ctas (mediaKit/whatsapp)
- `FaqContent` — meta + items

### 5.4 Arquivos de conteúdo

10 arquivos + 1 barrel:

| Arquivo | Tipo | O que contém |
|---|---|---|
| `hero.ts` | `HeroContent` | Headline, subheadline, 2 CTAs, paths de vídeo/poster (placeholders) |
| `manifesto.ts` | `ManifestoContent` | 6 parágrafos do manifesto + assinatura "Andressa & Bruno" |
| `about.ts` | `AboutContent` | 3 capítulos: De onde viemos / Por que saímos / O que tá fazendo agora |
| `now.ts` | `NowContent` | **Dia 47 · Piauí · Abril/2026** (fonte única do JourneyMarker) |
| `pillars.ts` | `PillarsContent` | 4 pilares: Viagens sem maquiagem / Vida entre viagens / Mapas de custo / Sair do automático |
| `content-highlights.ts` | `ContentBridgeContent` | 4 Reels placeholder + canais Instagram + YouTube |
| `club.ts` | `ClubContent` | Caderno de Viagem — promise + regra + CTA |
| `coming-soon.ts` | `ComingSoonContent` | 4 produtos futuros (Roteiros, Comunidade, Ferramentas, Encontros) |
| `partnerships.ts` | `PartnershipsContent` | Filosofia + 3 formatos (Pousada de alma / Experiência contada / Roteiro patrocinado) + números (placeholders) |
| `faq.ts` | `FaqContent` | 5 perguntas com personalidade |
| `index.ts` | barrel | Re-exporta tudo: `import { manifesto, about, ... } from '@/content'` |

### 5.5 Pontos de atenção sobre conteúdo

- **`now.ts` precisa ser atualizado semanalmente** (dayCount, city, period, photo, caption). Mudança propaga para JourneyMarker (header, hero, footer, mobile menu).
- **Rotas placeholder** (`/sobre`, `/parcerias`, `/conteudo`, `/caderno`, `/jornada`) não consomem `src/content/` ainda — apenas a home consome. Ao expandir essas rotas, importar do mesmo content.
- **Imagens e vídeos** referenciados em `now.ts`, `hero.ts`, `content-highlights.ts` ainda não existem em `public/`. Pastas estão vazias com `.gitkeep`.

---

## 6. Rotas e páginas

### 6.1 Rotas existentes

| Path | Arquivo | Estado | Pre-render |
|---|---|---|---|
| `/` | `(marketing)/page.tsx` | **Esqueleto funcional** com hero + 9 SectionPlaceholder (consomem `src/content/`) | Static |
| `/sobre` | `(marketing)/sobre/page.tsx` | Placeholder ("Em construção") com metadata própria | Static |
| `/parcerias` | `(marketing)/parcerias/page.tsx` | Placeholder | Static |
| `/conteudo` | `(marketing)/conteudo/page.tsx` | Placeholder | Static |
| `/caderno` | `(marketing)/caderno/page.tsx` | Placeholder | Static |
| `/jornada` | `(marketing)/jornada/page.tsx` | Placeholder | Static |
| `/_not-found` | `app/not-found.tsx` | 404 customizado com voz da marca + skip header/footer | Static |
| `/robots.txt` | `app/robots.ts` | Permite tudo, aponta para sitemap | Static |
| `/sitemap.xml` | `app/sitemap.ts` | Lista 6 rotas com `priority` e `changeFrequency` | Static |
| `/manifest.webmanifest` | `app/manifest.ts` | PWA manifest (sem icons ainda) | Static |

Confirmado pelo `pnpm build`: **10 rotas, todas geradas como static** (`○ (Static)`).

### 6.2 Route group `(marketing)`

- Pasta entre parênteses **não aparece na URL**
- Compartilha um `layout.tsx` (`SiteHeader` + `<main>` + `SiteFooter`)
- Estratégia: futuras rotas administrativas (`/admin`, `/dashboard`) iriam em outro route group (ex: `(app)`) com layout próprio sem header/footer da marca

### 6.3 Funcional vs placeholder

**Funcional:**
- Home com conteúdo real lido de `src/content/`
- Hero com 2 CTAs ativos (vão para `/caderno` e ancora `#now`)
- Header com nav ativo (sabe a página atual)
- Mobile menu funcional (overlay + animação + ESC + scroll lock)
- Footer com formulário de newsletter funcional na UI (sem backend)
- Skip-to-content acessível

**Placeholder:**
- 5 páginas internas (`/sobre`, `/parcerias`, `/conteudo`, `/caderno`, `/jornada`) — só metadata + título + frase "em construção"
- 9 das 10 seções da home renderizam apenas kicker + título + uma prévia de texto (refino visual completo planejado para PASSO 6)
- Mídia: nenhuma imagem ou vídeo real (caminhos apontam para arquivos inexistentes)

---

## 7. Build e execução

### 7.1 Scripts (`package.json`)

```json
{
  "dev": "next dev",        // dev server (Turbopack default)
  "build": "next build",    // build de produção (Turbopack default)
  "start": "next start",    // serve build
  "lint": "eslint",         // ESLint flat config
  "typecheck": "tsc --noEmit"
}
```

### 7.2 Como rodar localmente

```bash
cd /Users/macbookpro/menos-roteiros-site

# Garantir que não tem dev server antigo travado
pkill -9 -f "next" || true

# Limpar cache se houver suspeita de stale
rm -rf .next

# Subir dev
pnpm dev

# A porta exata sai no terminal (3000, 3001, 3002... depende do que está livre)
```

### 7.3 Build de produção

```bash
pnpm build         # gera output em .next/
pnpm start         # serve com Node em modo produção
```

Build atual gera 10 rotas static. Tempo de build: ~2s (Turbopack).

### 7.4 Observações sobre Turbopack

- **Turbopack é default no Next 16** (mudança de v15). Não é necessário passar `--turbopack`.
- Para opt-out (usar Webpack), passar `--webpack` em dev/build scripts. Não recomendado.
- Turbopack escreve em `.next/dev/` (não `.next/`). Isso permite rodar `dev` e `build` concorrentemente.
- **Lock-file mechanism**: Turbopack impede 2 instâncias do `next dev` rodarem no mesmo projeto. Se forçado, corrompe a cache (`Compaction failed: Another write batch or compaction is already active`).

### 7.5 Variáveis de ambiente

- `.env.local` é git-ignored (`.gitignore` linha 35)
- Template em `.env.example`:
  - `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`)
  - `RESEND_API_KEY` (futuro, comentado)
  - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (futuro, comentado)
- `SITE_URL` em `src/lib/constants.ts` faz fallback para `siteConfig.url`

---

## 8. Problemas enfrentados e resoluções

### 8.1 Cache stale do Next 16 + dev server fantasma

**Sintoma:** `Internal Server Error` aleatório no navegador, frequentemente após mudanças massivas de arquivos.

**Causa raiz:** dev server antigo continua rodando em background com cache de arquivos que não existem mais (ex: `src/app/page.tsx` deletado quando movido para `(marketing)/page.tsx`).

**Erro típico:**
```
Error: ENOENT: no such file or directory, open '.next/dev/server/app/(marketing)/page/build-manifest.json'
Compaction failed: Another write batch or compaction is already active
```

**Resolução padrão (sequência de 4 comandos):**
```bash
pkill -9 -f "next" || true
sleep 3
rm -rf .next
pnpm dev
```

**Risco de recorrência:** alto. Sempre que houver:
- Renomeação de arquivos do app router
- Mudança de estrutura de rotas
- Adição/remoção massiva de arquivos
- Dois processos `next dev` rodando no mesmo projeto

### 8.2 Conflito de porta com outros projetos

**Sintoma:** `pnpm dev` reporta `Port 3000 is in use, using port 3001 instead` (ou outra). Usuário abre 3000 e vê outro projeto.

**Causa:** ambiente local tem outros projetos rodando (`vancy` foi um caso real).

**Resolução:** sempre ler a linha `Local: http://localhost:XXXX` no terminal e usar a porta exata reportada.

### 8.3 Lint do React 19: `setState` síncrono em `useEffect`

**Sintoma:** `pnpm lint` falha com `react-hooks/set-state-in-effect`.

**Caso real:** `MobileMenu` tinha um `useEffect(() => { setOpen(false) }, [pathname])` para fechar o menu ao mudar rota.

**Resolução:** removido. Os `<Link>` dentro do menu já têm `onClick={() => setOpen(false)}`. Edge case de browser back/forward com menu aberto não é tratado (rare).

**Padrão para futuro:** evitar `setState` direto em `useEffect`. Usar:
- Callbacks de evento (onClick, onSubmit)
- Derivar state durante render
- `useEffectEvent` (React 19 — quando estabilizar API)

### 8.4 Cache do TypeScript apontando para arquivos deletados

**Sintoma:** `pnpm typecheck` reclama de `Cannot find module '../../src/app/page.js'` após mover arquivo.

**Causa:** `.next/types/validator.ts` cacheado.

**Resolução:** `rm -rf .next` antes de typecheck depois de qualquer mudança estrutural de rotas.

### 8.5 Riscos abertos

- **Tailwind v4 ainda recente** — alguns plugins/bibliotecas terceiras podem não suportar `@theme inline` ainda.
- **`motion/react`** (sucessor framer-motion) ainda em transição. APIs idênticas hoje, mas pacote pode mudar.
- **`lucide-react ^1.8.0`** — versão major nova, pode ter breaking changes vs. `0.x`. Não consumida ainda; verificar antes de PASSO 6.
- **Sem testes** — qualquer refactor de componentes carrega risco.

---

## 9. Pendências e próximos passos

### 9.1 Pendências críticas (antes de produção)

- [ ] **Repositório Git** — diretório tem `.git/` mas não está claro se há remote configurado. Verificar e configurar GitHub.
- [ ] **Backend de email** — `NewsletterForm` simula sucesso. Integrar com Resend ou Loops via `app/api/subscribe/route.ts`.
- [ ] **Mídia real** — fotos de Andressa + Bruno, vídeo do hero, thumbnails de Reels. Substituir paths placeholder em `now.ts`, `hero.ts`, `content-highlights.ts`.
- [ ] **URLs sociais** — preencher `siteConfig.social.instagram/youtube/tiktok` (atualmente strings vazias — coluna "Canais" no footer não renderiza).
- [ ] **Mídia kit PDF** — `partnerships.ts` aponta para `/midia-kit.pdf`, arquivo não existe.
- [ ] **WhatsApp comercial** — `siteConfig.contact.whatsapp` vazio.

### 9.2 Próximos passos planejados

| Passo | Escopo |
|---|---|
| **PASSO 6** | Construção real das 10 seções da home (uma a uma, consumindo `src/content/`). Ordem proposta: Hero → Manifesto → About → Now → Pillars → Content Bridge → Club → Coming Soon → Partnerships → FAQ |
| **PASSO 7** | Refinamento responsivo (mobile, tablet) seção por seção |
| **PASSO 8** | SEO completo — Open Graph dinâmico, Schema.org `Person`/`Organization`/`WebSite`, otimizações de Lighthouse, integração de analytics |
| **PASSO 9** | Refinamento final — favicon próprio, ícones PWA, opengraph-image dinâmico via `app/opengraph-image.tsx`, copy review, performance budget |

### 9.3 Pendências de longo prazo

- **CMS plugável** (Sanity ou Payload) — arquitetura já separa conteúdo, migração é direta
- **i18n** (PT default, EN para pós-Ásia)
- **Blog/MDX** — quando houver volume de conteúdo
- **Páginas internas reais** — `/sobre`, `/parcerias`, `/conteudo`, `/caderno`, `/jornada`
- **Integração de analytics** (Plausible ou Umami)
- **Dark mode** (a paleta editorial pode não suportar — discutir)
- **Testes** (Vitest + Testing Library + Playwright)

---

## 10. Avaliação técnica

### 10.1 Pontos fortes

1. **Arquitetura modular e escalável**
   Conteúdo desacoplado de componente, route group permite outros grupos futuros, types centralizados, pasta por seção planejada. Pronta para crescer sem reescrita.

2. **Stack moderna e estável**
   Next.js 16 + React 19 + Tailwind v4. Sem deps desnecessárias (apenas 4 fora do framework). Build em ~2s com Turbopack.

3. **Type safety completa**
   `tsconfig` em strict, todo conteúdo tipado, `cn()` com tipo correto, props bem definidas. `pnpm typecheck` passa em ~1s.

4. **Acessibilidade considerada desde a base**
   Skip-to-content, `aria-label` em todos os interativos, `aria-current="page"` no nav, foco visível, `role="dialog"` no mobile menu.

5. **SEO estruturado desde o setup**
   Metadata global + por página, sitemap automático, robots, Open Graph configurado, manifest. Falta apenas conteúdo real (imagens OG).

6. **Design system real**
   Tokens CSS variables centralizados, fontes via `next/font`, primitivos (`Button`, `Section`, `SectionHeader`) reutilizáveis. Identidade visual consistente.

7. **Identidade verbal forte registrada em código**
   404 com voz da marca, error boundary com voz da marca, comentários em português direto. Não tem cara de boilerplate.

8. **Documentação estratégica robusta**
   `ETAPA-01-ESTRATEGIA.md` (1100+ linhas) cobre posicionamento, identidade, conteúdo, headlines, conversão. Qualquer decisão de produto pode ser cruzada com ele.

### 10.2 Pontos de atenção

1. **`pnpm-workspace.yaml` define `ignoredBuiltDependencies`** (sharp, unrs-resolver). Isso sinaliza que o projeto pode ter sido criado em contexto de monorepo. Hoje é single-package — limpar ou justificar.

2. **`lucide-react ^1.8.0`** instalada mas nunca importada. Versão 1.x é major recente — verificar API antes de consumir no PASSO 6.

3. **Sem testes** — risco em refactors. Considerar Vitest minimal cobrindo: `cn()`, render dos primitivos, `JourneyMarker`, `NewsletterForm` (estado).

4. **Sem CI** — `lint` + `typecheck` + `build` deveriam rodar em PR via GitHub Actions.

5. **Variáveis de marca duplicadas em alguns lugares**
   Ex: cor terracota `#C4512A` está em `globals.css` e (mesmo valor) hex no `manifest.ts` (`theme_color: '#0E0E0D'`, `background_color: '#F3EEE5'`). Aceitável (manifest é static), mas se mudar o token, manifest precisa update manual.

6. **`error.tsx` global no root usa `console.error` direto**. Considerar integração com Sentry ou similar quando houver tráfego.

7. **`next.config.ts` está vazio**. Tudo bem hoje. Mas precisará de `images.remotePatterns` quando usar imagens externas, e `i18n` quando expandir para EN.

8. **Pasta `src/styles/` vazia** — reservada mas talvez nunca usada. `globals.css` cobre tudo no padrão Tailwind v4. Decidir se vale manter.

### 10.3 Sugestões de melhoria

#### Curto prazo (durante PASSO 6)
- Remover `lucide-react` se não for consumida no PASSO 6 (reduz install)
- Adicionar `pnpm format` script com prettier instalado como dev dep
- Setar `output: 'export'` em `next.config.ts` se for hospedar 100% estático (ou manter padrão para Vercel)
- Consolidar tokens de cor — extrair `manifest.ts` colors do `siteConfig` em vez de hardcode

#### Médio prazo (antes do lançamento)
- Configurar GitHub Actions: lint + typecheck + build em PR
- Adicionar `@next/bundle-analyzer` para auditoria de bundle
- Configurar Lighthouse CI com budget (Performance ≥ 95)
- Implementar `app/opengraph-image.tsx` dinâmica (gera OG image por rota)
- Migrar `.env.example` para incluir todas as vars que serão usadas

#### Longo prazo (escala)
- Avaliar **Cache Components** (PPR estabilizada no Next 16) quando houver conteúdo dinâmico
- Avaliar **CMS** (Sanity preferível pelo editorial; Payload se quiser self-host)
- Avaliar **Sentry** para error tracking
- Avaliar **Vercel Analytics** ou **Plausible** para Web Vitals reais
- Considerar i18n quando houver demanda EN
- Avaliar **React Compiler** (estabilizado no Next 16) — pode dar ganho de perf grátis

### 10.4 Veredito

Projeto em **estado profissional sólido** para a etapa em que está. Arquitetura, tipagem, identidade visual e desacoplamento de conteúdo estão alinhados com práticas de mercado para projetos editoriais escaláveis. A maior parte do que falta é **conteúdo real** (mídia, URLs sociais, backend de email) e a **construção visual das seções** (PASSO 6 em diante).

Não há débito técnico significativo até aqui. As decisões tomadas (TypeScript em vez de MDX, tokens via `@theme inline`, route group `(marketing)`, `cn` com clsx+twMerge) são padrões reconhecidos da comunidade Next.js 2025/2026.

Risco principal é operacional, não técnico: **gestão do dev server e do cache do Turbopack**. Documentar a sequência de recuperação no README seria valioso.

---

*Fim do documento.*
*Próxima atualização recomendada: após conclusão do PASSO 6.*
