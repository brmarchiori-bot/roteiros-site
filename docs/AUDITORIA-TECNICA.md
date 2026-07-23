# Auditoria técnica — Menos Roteiros

> Documento operacional atualizado em 23 de julho de 2026.

## Estado atual

O projeto é um site editorial em Next.js 16 com uma home pública, cinco páginas futuras,
Sanity Studio e um portfólio privado. A home funciona sem Sanity por meio de conteúdo local
tipado; quando o CMS está configurado, as seções integradas usam os documentos publicados.

### Stack

- Next.js 16.2.11, App Router e Turbopack
- React 19.2.8
- TypeScript strict
- Tailwind CSS 4
- Sanity 5 com Studio em `/studio`
- Vercel Analytics
- pnpm

## Rotas

| Rota | Estado | Indexação |
|---|---|---|
| `/` | Home editorial completa | Permitida |
| `/sobre`, `/parcerias`, `/conteudo`, `/caderno`, `/jornada` | Em construção | `noindex`, fora do sitemap |
| `/studio` | Painel editorial autenticado pelo Sanity | Fora do sitemap |
| `/portfolio/[accessKey]` | Portfólio privado alimentado pelo Sanity | `noindex`, `nofollow`, sem cache e fora da navegação |

## Conteúdo e CMS

Os documentos Sanity são singletons com IDs determinísticos:

- `hero-singleton`
- `about-singleton`
- `now-singleton`
- `content-highlights-singleton`
- `faq-singleton`
- `private-portfolio-singleton`

As cinco seções públicas integradas possuem fallback em `src/content`. Erros de leitura são
registrados no servidor e o site continua disponível com o fallback. FAQ visual e JSON-LD
consomem a mesma resolução. O marcador da jornada também utiliza o documento `now` resolvido.

O portfólio privado não possui conteúdo fictício nem fallback público. Sem documento publicado
no Sanity, a URL autorizada informa que o conteúdo ainda não foi publicado.

## Segurança

- Next.js atualizado além das versões afetadas pelos advisories encontrados na auditoria.
- Headers `nosniff`, `SAMEORIGIN`, HSTS, Referrer Policy e Permissions Policy configurados.
- `X-Powered-By` desativado.
- Portfólio protegido por slug secreto de no mínimo 24 caracteres.
- Portfólio recebe `X-Robots-Tag` e `Cache-Control: private, no-store`.
- Basic Auth opcional continua disponível para proteger ambientes de preview.

O último `pnpm audit --prod` encontrou cinco vulnerabilidades transitivas na CLI do Sanity 5:
duas altas e três moderadas. Não há vulnerabilidade crítica. A remoção restante exige migração
controlada para Sanity 6 ou correções upstream; não deve ser feita com `audit fix --force`.

## Formulários

Newsletter e lista de interesse não coletam dados enquanto não há backend configurado. Ambos
informam claramente a indisponibilidade. Eles só devem voltar a aceitar email após existir:

- provedor definido e credenciais;
- persistência confirmada;
- validação no servidor;
- rate limit e proteção anti-spam;
- consentimento e política de privacidade;
- tratamento observável de falhas.

## Validação obrigatória

Antes de qualquer entrega:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm audit --prod
```

## Próximas prioridades

1. Escolher e integrar a plataforma real de contatos/newsletter.
2. Adicionar testes E2E para home, navegação, formulários desativados, portfólio e Basic Auth.
3. Implantar CSP testada contra Next.js, Analytics e Sanity Studio.
4. Planejar a migração isolada de Sanity 5 para 6.
5. Publicar conteúdo real no portfólio e completar as páginas secundárias antes de indexá-las.
