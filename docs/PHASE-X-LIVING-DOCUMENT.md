# Phase X — From Editorial Layout to Living Document

> Auditoria, storyboard e sistema aprovados internamente antes da implementação.
> Baseline visual: `a9ad1cd`. Baseline técnico: `8b0a8f5`.

## Fase A — Auditoria visual crítica

| Capítulo | Estado em `a9ad1cd` | Lacuna | Solução | Risco |
|---|---|---|---|---|
| Navegação | Barra clara sticky, links e botão | Anuncia “website” antes da história | Integrar ao primeiro frame, reduzir CTA a gesto textual e preservar contraste no scroll | Legibilidade sobre foto |
| Abertura | Pôster forte e dois CTAs | Campanha editorial; título compete com corpos | Um caminho principal, metadados reduzidos e tratamento com negros mais ricos | Crop mobile |
| Agora | Bloco verde com ficha | Painel estático, não página de hoje | Registro assimétrico, imagem quando existir, marca temporal e superfície de impressão | Fallback sem mídia |
| História | Foto + três itens iguais | Cronologia diagramada | Três movimentos com escalas, alinhamentos e densidades diferentes | CMS antigo possui texto uniforme |
| Pilares | Quatro notas equivalentes | Cards invisíveis | Quatro formas de olhar dentro do mesmo campo editorial, com ritmos alternados | Escaneabilidade |
| Conteúdo | Página clara flutuante no verde | Card institucional | Mesa de montagem: episódio principal quando houver, canais como continuidade e vazio honesto | Pouca mídia real |
| Parcerias | Lista numerada de possibilidades | Vocabulário de agência | Começar pela visão; possibilidades entram como notas laterais, não pacotes | Clareza comercial |
| FAQ | Accordion correto e genérico | Poderia pertencer a qualquer marca premium | Tratar como conversa final, numeração marginal e resposta com pausa | Não prejudicar operação nativa |
| Footer | Sitemap organizado | Encerramento administrativo | Frase final primeiro; links viram créditos de fim de episódio | Links não podem sumir |
| Portfólio | Case com objetivo, resultado, pills e galeria | Estrutura de agência | Coleção de mini-documentários: pergunta, contexto, imersão, evidência e aprendizado | Retrocompatibilidade |
| Studio | Campos por bloco visual | Pouca orientação emocional | Acrescentar somente função narrativa, atmosfera, ritmo, crédito e estado | Campos sem uso imediato |

## Fase B — Storyboard

### Home

1. **Abertura — presença.** Entrada sem barra branca separada. Fotografia ocupa o primeiro
   frame; a frase parece impressa na sombra. Saída única: chegar ao presente.
2. **Presente — proximidade.** Uma página de campo datada. Se houver foto, ela é evidência; sem
   foto, o vazio é assumido. A saída aponta para o registro mais recente.
3. **Origem — peso.** Fotografia dominante e primeiro fragmento curto. A escala desacelera.
4. **Transformação — ruptura.** Texto deslocado, regra interrompida, menos fotografia.
5. **Olhar — leitura do mundo.** Quatro modos de observar, não quatro produtos.
6. **Continuidade — montagem.** Episódios reais quando existirem; sem eles, canais e silêncio.
7. **Convite — participação.** A visão vem antes das possibilidades. A marca entra na história,
   não num pacote.
8. **Dúvidas — conversa.** Perguntas como falas depois do episódio.
9. **Despedida — continuidade.** A assinatura e o estado atual aparecem antes dos créditos.

### Portfólio

Entrada como coleção privada. Cada trabalho começa com uma pergunta e um frame. Contexto e
imersão precedem objetivo e resultado. Imagens funcionam como evidência, com legendas. Entregas
deixam de ser pills. No preview, ausência de material é parte explícita da demonstração.

### Case

1. frame e pergunta;
2. contexto humano;
3. imersão;
4. filme/fotografia;
5. impacto ou espaço honesto para dado real;
6. bastidor/aprendizado;
7. próxima história.

## Fase C — Sistema de linguagem

### Matéria

- `--paper`: papel quente, nunca branco;
- `--charcoal`: negro com temperatura;
- `--graphite`: superfície intermediária;
- `--rust`: marca de pressão;
- `--field`: verde profundo;
- `--dust`: texto e regra envelhecidos.

Materialidade será produzida principalmente por camadas CSS: gradientes irregulares, ruído já
existente, regras com opacidade desigual e sombras largas. Nenhum raster decorativo novo.

### Primitivas

- **Narrative marker:** função do capítulo, não número de seção.
- **Evidence image:** foto + crédito + legenda + tratamento contextual.
- **Distressed rule:** regra descontínua que marca mudança de estado.
- **Field note:** dado real curto, com data e fonte.
- **Chapter transition:** mudança de matéria e densidade, sem separador repetido.

Essas primitivas permanecem como classes e padrões dentro dos componentes atuais. Não serão
criadas abstrações React sem necessidade.

### Movimento

O conteúdo permanece forte sem JavaScript. A entrada deixa de aplicar o mesmo deslocamento a
tudo: títulos recebem pausa curta; imagens ganham revelação mais pesada; texto funcional aparece
sem espetáculo. `prefers-reduced-motion` continua soberano.

### Assets

Nenhuma fotografia será inventada. A repetição da única imagem real será reduzida. Áreas sem
acervo usam silêncio editorial, não imagem duplicada. Novos assets reais entram pelo Sanity com
alt, legenda, crédito, hotspot e contexto narrativo.

## Fase E — Validação visual

A implementação foi inspecionada em `320`, `360`, `375`, `390`, `414`, `768`, `1024`, `1280`,
`1440` e `1920` pixels. Não houve overflow horizontal, imagem quebrada, erro de hidratação ou
erro de console da aplicação. O Analytics não injeta o script da Vercel fora do ambiente Vercel,
eliminando o falso 404 durante desenvolvimento e E2E.

As capturas incluem página completa, capítulos isolados, entrada e página completa do portfólio,
case em cinco momentos e o estado real do Studio sem configuração externa. Elas são geradas fora
do Git em `/tmp/menos-roteiros-phase-x`.

## Fase F — Autocrítica

O resultado deixou de depender de cards, pills e blocos equivalentes. A Home possui mudanças
perceptíveis de densidade: primeiro frame fotográfico, registro escuro, origem em papel, campo
assimétrico, mesa de montagem, convite em carvão e créditos finais. Sem nome, logo ou texto, o
parentesco ainda aparece na alternância entre escala humana, silêncio e regras editoriais.

O que ainda não atinge integralmente a referência:

- o acervo contém uma única fotografia forte; Hero e História ainda precisam dividi-la;
- sem episódios reais, Conteúdo permanece mais tipográfico do que audiovisual;
- sem foto atual, “Agora” comprova o estado vazio, mas não a versão documental completa;
- a materialidade permanece deliberadamente contida e majoritariamente em CSS; fotos e scans
  reais serão necessários para aumentar a sensação de tempo sem cair em decoração;
- o Studio real não pôde ser fotografado porque o ambiente local não possui projeto/dataset
  Sanity. Os schemas e grupos foram validados por tipos, build e E2E no estado orientativo.

Esses limites dependem de acervo ou configuração externa. Não foram compensados com imagens,
clientes, métricas ou resultados inventados.
