# Menos Roteiros — Relatório de estado e handoff

**Data do retrato:** 24 de julho de 2026  
**Repositório:** `brmarchiori-bot/roteiros-site`  
**Projeto Vercel:** `brmarchiori-bots-projects/roteiros-site`  
**Domínio principal:** `https://menosroteiros.com.br`  
**Branch de trabalho:** `creative/documentary-direction`

## 1. Resumo executivo

O projeto já encontrou sua base visual, narrativa e técnica. A Home não deve mais
ser reconstruída. O trabalho atual é de lapidação por capítulos, com alterações
pequenas, justificadas e visualmente perceptíveis.

Nesta rodada, o único capítulo alterado foi a abertura da Home: Header + Hero.
Todos os capítulos posteriores permaneceram intactos.

O código mais avançado está na branch local
`creative/documentary-direction`. Essa branch contém toda a evolução do Sanity,
Portfólio privado, hardening técnico e direção documental. Antes deste handoff,
ela ainda não existia no GitHub e suas alterações mais recentes ainda não
estavam commitadas.

A produção existente na Vercel é antiga, de 21 de abril de 2026. O domínio
principal já responde pela Vercel, mas ainda serve essa revisão antiga.

O Sanity já está implementado no código e a Vercel já possui as variáveis
`NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET` nos ambientes de
Preview e Production. O ambiente local ainda não recebeu essas variáveis, e a
conta Sanity não foi confirmada pela CLI nesta máquina.

Após o primeiro deploy desta entrega, a validação visual revelou que o dataset
remoto contém fotografia e textos antigos, diferentes do estado local aprovado.
Por segurança, a leitura remota passou a ser opt-in por meio de
`NEXT_PUBLIC_SANITY_CONTENT_ENABLED=true`. Enquanto essa variável estiver
ausente ou diferente de `true`, o Studio permanece conectado, mas a Home usa os
fallbacks locais aprovados.

## 2. Contrato permanente de direção

### Base aprovada e congelada

Salvo refinamentos pequenos e explicitamente justificados, estão aprovados:

- arquitetura da Home;
- ordem narrativa;
- identidade visual;
- sistema de cores;
- sistema tipográfico;
- ritmo entre capítulos;
- linguagem editorial;
- materiais e texturas;
- estrutura técnica;
- responsividade;
- performance;
- estrutura existente do Sanity.

### Método obrigatório

Cada tarefa deve:

1. ter apenas um capítulo em escopo;
2. começar com uma auditoria rápida;
3. explicar o que funciona;
4. explicar o que pode amadurecer;
5. justificar cada alteração;
6. prever o resultado visual;
7. implementar a menor mudança suficiente;
8. validar desktop e mobile;
9. terminar com autocrítica.

### Ordem de prioridade

1. emoção;
2. narrativa;
3. fotografia;
4. ritmo;
5. materialidade;
6. interface;
7. implementação.

Qualidade vale mais que velocidade. Se uma alteração não elevar
perceptivelmente a experiência, ela não deve ser feita.

## 3. Estado visual da Home

### Capítulos congelados nesta etapa

Nenhuma alteração foi feita em:

- Agora;
- História;
- Pilares;
- Conteúdo;
- Parcerias;
- FAQ;
- Footer;
- Portfólio;
- Studio.

### Header + Hero

O Header e o Hero foram refinados para se aproximar da referência oficial:

- header mais baixo, transparente e integrado à fotografia;
- remoção do “Menu” redundante no desktop;
- logo, navegação e CTA com menos peso;
- recuperação localizada de Andressa;
- preservação de pele, pedra, costa e mar;
- redução da sensação de filtro;
- headline menor e mais respirada;
- comportamento intermediário próprio para tablet;
- headline mobile em três linhas, sem cobrir os rostos;
- identificação `01 · Em movimento`, sem o termo técnico “Hero”;
- frase complementar condensada;
- CTA terracota visualmente menor, mantendo área de toque;
- remoção de “Atualização pendente” da base;
- créditos inferiores mais documentais;
- papel lateral reconstruído como asset fotográfico;
- riscos, grão e texturas reduzidos;
- transição irregular para Agora preservada.

### Bilhete lateral

O bilhete final é composto por:

- papel de caderno fotográfico;
- fibras e amassados reais;
- fita separada;
- rasgo diagonal inferior;
- escrita azul-preta incorporada ao raster;
- texto exato:

  `não é sobre o lugar. é sobre o que muda em você.`

O asset consumido pela Home é:

`src/assets/menos-roteiro/notes/hero-note-paper-v5.webp`

Ele possui aproximadamente 47 KB. As versões intermediárias não fazem parte do
produto final.

## 4. Arquivos alterados na etapa Header + Hero

- `src/app/globals.css`
- `src/components/layout/mobile-menu.tsx`
- `src/components/sections/hero/hero.tsx`
- `src/content/hero.ts`
- `src/assets/menos-roteiro/notes/hero-note-paper-v5.webp`

Nenhum schema, query, rota ou capítulo posterior foi alterado nesta etapa.

## 5. Estado do Git

### Repositório remoto

`https://github.com/brmarchiori-bot/roteiros-site`

### Branches remotas encontradas antes da entrega

- `main` em `18d24c0`;
- `feat/sanity-cms` em `9370aeb`.

### Linha histórica

```text
main
  └── feat/sanity-cms
        └── prelaunch hardening
              └── home editorial
                    └── direção documental
                          └── creative/documentary-direction
```

A branch atual é descendente linear de `main` e de `feat/sanity-cms`. Não são
projetos divergentes; a branch atual representa a evolução completa.

### Estado antes do commit desta entrega

- branch `creative/documentary-direction` ainda local;
- alterações de Header + Hero ainda sem commit;
- produção e GitHub ainda não continham essa revisão.

## 6. Estado da Vercel

### Conta e projeto

- conta autenticada: `brmarchiori-bot`;
- equipe: `brmarchiori-bots-projects`;
- projeto: `roteiros-site`;
- project ID: `prj_yrqyAgsbCC4vO3uK870I4Wqp7wGM`;
- framework: Next.js;
- Node.js: 24.x;
- build: `npm run build` / `next build`;
- diretório raiz: `.`.

### Produção anterior

- deployment: `dpl_6gPR1kkNhh8fe2RqNzrLghXa6pRi`;
- criado em 21 de abril de 2026;
- status: Ready;
- URL: `https://roteiros-site.vercel.app`.

### Domínio

`https://menosroteiros.com.br`:

- pertence à conta Vercel correta;
- usa registrador/DNS externo;
- responde HTTP 200 pela Vercel;
- é o domínio oficial a preservar.

`https://www.menosroteiros.com.br`:

- resolve para infraestrutura Vercel;
- antes desta entrega apresentava incompatibilidade de certificado;
- precisa ser associado ao projeto ou redirecionado corretamente.

### Variáveis encontradas

Preview e Production já possuem:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`;
- `NEXT_PUBLIC_SANITY_DATASET`.

Ainda não possuem:

- `NEXT_PUBLIC_SANITY_CONTENT_ENABLED=true`.

Essa ausência é intencional até a migração e revisão editorial do dataset.

Os valores são secretos/criptografados e não estão registrados neste relatório.

### Vínculo local

Durante esta entrega, a pasta foi vinculada ao projeto Vercel existente. O
arquivo local `.vercel/project.json` é ignorado pelo Git e não deve ser
commitado.

## 7. Estado do Sanity

### O que já existe no código

- Studio incorporado em `/studio`;
- `sanity.config.ts`;
- estrutura editorial por documentos singleton;
- fallback local quando Sanity está ausente;
- revalidação de conteúdo;
- imagens via CDN do Sanity;
- schema de imagem controlada;
- schemas de Hero, Agora, História, Pilares, Conteúdo, Parcerias, FAQ e
  Portfólio privado.

### Documentos singleton

- `hero-singleton`;
- `about-singleton`;
- `now-singleton`;
- `pillars-singleton`;
- `content-highlights-singleton`;
- `partnerships-singleton`;
- `faq-singleton`;
- `private-portfolio-singleton`.

### Controles de imagem atuais

- upload;
- hotspot nativo;
- alt obrigatório;
- legenda;
- foco horizontal;
- foco vertical;
- `cover` ou `contain`.

### Limitações editoriais atuais

- ambiente local ainda sem `.env.local`;
- CLI Sanity não conseguiu listar projetos;
- login/permissão da conta Sanity ainda precisa ser confirmado;
- documentos iniciais podem precisar ser criados ou migrados;
- crop e zoom por breakpoint ainda não têm uma experiência visual completa;
- não existe Preview/Presentation Tool configurado para edição visual ao vivo.

### Princípio de evolução

O Studio deve se tornar o ambiente editorial oficial, mas sem permitir liberdade
que destrua a composição aprovada. A direção recomendada é:

- conteúdo livre dentro de orientações;
- controles visuais estruturados;
- preview desktop/mobile;
- hotspot e crop visual;
- zoom limitado;
- retrocompatibilidade;
- arquivos locais preservados como fallback.

## 8. Arquitetura de conteúdo

Fluxo atual quando Sanity não está disponível:

```text
src/content/*.ts
      ↓
queries com fallback
      ↓
componentes da Home
```

O mesmo fallback é utilizado quando o projeto Sanity está configurado, mas a
flag `NEXT_PUBLIC_SANITY_CONTENT_ENABLED` não está explicitamente ativa.

Fluxo desejado:

```text
Editor
  ↓
/studio
  ↓
Sanity Content Lake
  ↓
queries do servidor
  ↓
Home na Vercel
```

Se uma consulta falhar, os arquivos locais continuam servindo conteúdo. Essa
retrocompatibilidade deve ser preservada.

## 9. Validações já executadas

Na etapa Header + Hero foram aprovados:

- ESLint;
- TypeScript;
- Vitest: 9 testes;
- build de produção;
- `git diff --check`;
- ausência de overflow horizontal.

Viewports verificados:

- 1440 × 1000;
- 1280 × 800;
- 768 × 1024;
- 430 × 932;
- 390 × 844;
- 360 × 800.

## 10. Sequência recomendada após esta entrega

### Fase 1 — Confirmar produção

1. verificar deployment Ready;
2. abrir `menosroteiros.com.br`;
3. validar Header e Hero em desktop;
4. validar em mobile real;
5. validar o rasgo entre Hero e Agora;
6. confirmar que capítulos posteriores não mudaram;
7. corrigir o host `www`.

### Fase 2 — Ativar Sanity localmente

1. executar `vercel env pull .env.local`;
2. confirmar `NEXT_PUBLIC_SANITY_PROJECT_ID`;
3. confirmar dataset;
4. autenticar a conta Sanity;
5. abrir `http://localhost:3000/studio`;
6. cadastrar localhost no CORS com credenciais, se necessário.

### Fase 3 — Validar conteúdo existente

1. listar documentos no dataset;
2. identificar documentos ausentes;
3. comparar Sanity com fallbacks locais;
4. criar documentos singleton faltantes;
5. evitar publicar conteúdo vazio;
6. testar uma alteração reversível no Hero.
7. comparar todos os capítulos remotos com os fallbacks aprovados;
8. só então definir `NEXT_PUBLIC_SANITY_CONTENT_ENABLED=true`.

### Fase 4 — Evoluir o Studio

1. adicionar Preview/Presentation Tool;
2. criar visualização desktop/mobile;
3. melhorar crop e hotspot;
4. adicionar zoom controlado;
5. mostrar avisos de quebra de texto;
6. organizar campos por intenção editorial;
7. preservar todos os campos existentes.

### Fase 5 — Continuar lapidação

Trabalhar um capítulo por vez, começando sempre por auditoria. Não iniciar uma
“revisão geral” da Home.

## 11. Pendências e riscos

### Alta prioridade

- confirmar que o deployment novo serve `menosroteiros.com.br`;
- corrigir `www.menosroteiros.com.br`;
- confirmar acesso ao projeto Sanity;
- verificar se o dataset já contém conteúdo;
- impedir que conteúdo antigo no Sanity sobrescreva o visual/copy aprovado.

### Média prioridade

- trazer envs para o ambiente local;
- adicionar preview visual ao Studio;
- documentar responsáveis e permissões editoriais;
- definir fluxo de rascunho, revisão e publicação.

### Baixa prioridade

- revisar assets antigos não utilizados;
- decidir se o Studio permanecerá incorporado ou ganhará também URL
  `*.sanity.studio`;
- adicionar monitoramento editorial.

## 12. Regras para a próxima thread

A próxima thread deve assumir:

1. a Home está aprovada;
2. Header + Hero são o estado oficial mais recente;
3. não deve reconstruir capítulos;
4. deve auditar antes de alterar;
5. deve trabalhar um capítulo por tarefa;
6. deve preservar fallbacks;
7. deve evitar alterações de schema sem justificativa;
8. deve testar desktop e mobile;
9. deve usar Preview antes de Production quando a mudança for estrutural;
10. deve registrar claramente qualquer ação externa em GitHub, Vercel ou Sanity.

## 13. Critério de conclusão do próximo ciclo

O próximo ciclo estará concluído quando:

- o código atual estiver no GitHub;
- a produção oficial estiver Ready;
- `menosroteiros.com.br` servir o visual aprovado;
- o host `www` redirecionar ou servir certificado válido;
- `/studio` abrir com o projeto Sanity correto;
- um editor autorizado conseguir alterar e publicar conteúdo;
- a Home refletir a publicação sem perder fallback ou composição.
