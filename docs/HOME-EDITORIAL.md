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

## Sistema visual

- **Papel claro:** `#f3eee5`
- **Papel alternativo:** `#ece5d8`
- **Preto documental:** `#0e0e0d`
- **Terracota:** `#c4512a`
- **Verde sertão:** `#3d4a2b`
- **Texto secundário:** `#6f675f`

Fraunces continua nos títulos, Inter no texto e JetBrains Mono em marcadores. A alternância entre
foto, verde, papel, superfície e preto cria ritmo sem introduzir uma nova identidade. Movimento
permanece em CSS, discreto e desativado por `prefers-reduced-motion`.

Sem mídia publicada, uma seção nunca cria uma moldura vazia grande: **Agora** vira composição
textual; destaques sem capa usam somente texto; listas sem itens reais desaparecem. Imagens usam
hotspot, crop e alt obrigatório no Studio.

## Rotina no Studio

- **Capa / Hero:** foto horizontal ou vertical com espaço para texto; preferir Andressa e Bruno
  em situação real. Alt obrigatório.
- **Seção Agora:** atualizar somente quando a cidade ou etapa mudar. Foto 4:3 opcional.
- **Seção Sobre:** foto principal 4:5 e até três capítulos curtos.
- **Pilares de conteúdo:** até quatro itens; mudar apenas quando a linha editorial mudar.
- **Seção Conteúdo:** até três links escolhidos manualmente. Capa 3:4 opcional. Desmarcar
  “Mostrar este conteúdo” oculta o item.
- **Seção Parcerias:** até três categorias, email e WhatsApp. Não incluir métricas ou cases sem
  prova real.
- **Seção FAQ:** quatro ou cinco dúvidas; a mesma fonte alimenta a página e o JSON-LD.

O ritmo operacional recomendado é atualizar **Agora** por mudança de etapa, trocar destaques
quando houver trabalho forte e cadastrar portfólio quando um trabalho novo estiver pronto.

## Conteúdo real ainda necessário

- Uma foto adicional atual de Andressa e Bruno para variar Hero e Sobre.
- Foto atual da etapa para **Agora**, se desejarem usar mídia.
- Links e capas de até três publicações reais.
- Revisão do dia, local, período e texto atualmente usados no fallback de **Agora**.

Nenhuma dessas ausências gera imagem quebrada ou bloqueia a publicação técnica.
