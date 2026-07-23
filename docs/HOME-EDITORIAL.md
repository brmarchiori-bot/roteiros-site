# Home editorial — operação e sistema visual

> Direção implementada em 23 de julho de 2026.

## Arquitetura pública

A home passou de dez para sete seções:

1. **Hero** — apresenta Andressa, Bruno e a assinatura da jornada em uma foto real.
2. **Agora** — mostra etapa, local, dia, nota curta e o próximo canal.
3. **Nossa história** — resume a virada em três capítulos.
4. **O que você encontra** — quatro pilares editoriais.
5. **Conteúdo e canais** — até três destaques reais e os acessos a Instagram e YouTube.
6. **Parcerias** — três categorias amplas e contato direto.
7. **FAQ** — quatro respostas úteis, sincronizadas com o JSON-LD.

Manifesto, Caderno, newsletter, comunidade, ferramentas, encontros e produtos futuros permanecem
preservados no código. Eles não aparecem na home enquanto não houver oferta, conteúdo ou backend
real. O portfólio privado não foi exposto nem ligado pela home.

## Dramaturgia atual

A arquitetura continua tecnicamente dividida em sete regiões, mas a montagem passa por nove
estados: abertura, presente, origem, transformação, olhar, continuidade, convite, dúvidas e
despedida. O cabeçalho integra o primeiro frame somente na Home; nas páginas internas continua
com fundo e contraste determinísticos.

História não usa mais três blocos idênticos: cada movimento muda escala, recuo e densidade.
Pilares são tratados como formas de olhar, com uma composição assimétrica comum. Conteúdo se
comporta como mesa de montagem e Parcerias começa pela visão antes das possibilidades.

## Sistema visual

- **Papel claro:** `#f3eee5`
- **Papel alternativo:** `#ece5d8`
- **Preto documental:** `#0e0e0d`
- **Terracota:** `#c4512a`
- **Verde sertão:** `#3d4a2b`
- **Texto secundário:** `#6f675f`
- **Papel envelhecido:** `#e8dfd0`
- **Grafite:** `#252421`

Fraunces continua nos títulos, Inter no texto e JetBrains Mono em marcadores. A alternância entre
foto, verde, papel, superfície e preto cria ritmo sem introduzir uma nova identidade. Movimento
permanece em CSS, discreto e desativado por `prefers-reduced-motion`.

Fotografias recebem tratamento não destrutivo no navegador: saturação contida, contraste um pouco
mais profundo e calor mínimo. O arquivo original não é alterado. Superfícies materiais usam
gradientes microscópicos em CSS; não há textura raster repetida.

Sem mídia publicada, uma seção nunca cria uma moldura vazia grande: **Agora** vira composição
textual; destaques sem capa usam somente texto; listas sem itens reais desaparecem. Imagens usam
hotspot, crop e alt obrigatório no Studio.

## Rotina no Studio

- **Capa / Hero:** foto horizontal ou vertical com espaço para texto; preferir Andressa e Bruno
  em situação real. Alt obrigatório.
- **Seção Agora:** atualizar somente quando a cidade ou etapa mudar. A imagem principal é opcional;
  uma imagem secundária pode registrar um detalhe sem repetir o enquadramento. O campo “estado da
  jornada” é uma nota factual curta. “Atmosfera visual” permite carvão, sertão ou papel.
- **Seção Sobre:** foto principal 4:5 e até três capítulos curtos.
- **Pilares de conteúdo:** até quatro itens; mudar apenas quando a linha editorial mudar.
- **Seção Conteúdo:** até três links escolhidos manualmente. Capa 3:4 opcional. Desmarcar
  “Mostrar este conteúdo” oculta o item.
- **Seção Parcerias:** até três categorias, email e WhatsApp. Não incluir métricas ou cases sem
  prova real.
- **Seção FAQ:** quatro ou cinco dúvidas; a mesma fonte alimenta a página e o JSON-LD.

O ritmo operacional recomendado é atualizar **Agora** por mudança de etapa, trocar destaques
quando houver trabalho forte e cadastrar portfólio quando um trabalho novo estiver pronto.

## Portfólio como mini-documentário

Projetos existentes continuam compatíveis. Novos campos opcionais permitem abrir cada história
por uma pergunta central e organizar contexto, imersão/processo e aprendizado. Objetivo e
resultado permanecem disponíveis, mas aparecem depois da narrativa e só devem ser preenchidos
com informação comprovável. Serviços deixaram de aparecer como pills e são exibidos como registro
editorial do que tomou forma.

O preview local não atribui cliente, cidade, marca ou resultado real. Ele usa uma única fotografia
existente e deixa ausências explícitas. O documento publicado no Sanity substitui o preview
automaticamente.

## Conteúdo real ainda necessário

- Uma foto adicional atual de Andressa e Bruno para variar Hero e Sobre.
- Foto atual da etapa para **Agora**, se desejarem usar mídia.
- Links e capas de até três publicações reais.
- Revisão do dia, local, período e texto atualmente usados no fallback de **Agora**.

Nenhuma dessas ausências gera imagem quebrada ou bloqueia a publicação técnica.
