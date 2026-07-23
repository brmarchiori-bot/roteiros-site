import type { PrivatePortfolio } from '@/types/portfolio'

/**
 * Demonstração visual do portfólio.
 *
 * Nunca representa clientes, entregas ou resultados reais. Este conteúdo só aparece
 * enquanto o Sanity não devolve um portfólio publicado e desaparece automaticamente
 * assim que existir conteúdo editorial verdadeiro.
 */
export const portfolioPreview: PrivatePortfolio = {
  title: 'Histórias que poderiam nascer no caminho.',
  introduction:
    'Uma demonstração editorial de como hospedagens, sabores e encontros podem virar narrativa. Tudo abaixo é exemplo de estrutura — não é trabalho realizado, cliente atendido ou resultado alcançado.',
  contactLabel: 'Conversar sobre uma história real',
  categories: [
    {
      id: 'preview-hospitalidade',
      title: 'Hospitalidade',
      description:
        'O lugar não entra como cenário. Ele entra como personagem: chegada, silêncio, textura, gente e aquilo que fica depois da partida.',
      projects: [
        {
          id: 'preview-case-pousada',
          title: 'Uma pausa antes da próxima estrada',
          featured: true,
          client: 'Exemplo demonstrativo · marca fictícia',
          city: 'Local ilustrativo',
          format: 'Filme curto · fotografias · diário',
          objective:
            'Demonstrar como uma hospedagem pode ser apresentada pela experiência vivida, sem transformar a narrativa em um catálogo de quartos.',
          description:
            'O capítulo começaria na chegada e terminaria na vontade de ficar mais um dia. Entre os dois pontos: o café cedo, a conversa com quem recebe, o som do lugar e os pequenos gestos que uma lista de comodidades não consegue contar.',
          result:
            'Área reservada para resultado real, publicada somente depois de uma entrega comprovada.',
          services: ['Direção narrativa', 'Vídeo vertical', 'Fotografia documental'],
          cover: {
            src: '/images/about/andressa-bruno.jpg',
            alt: 'Andressa e Bruno sentados em uma pedra diante do mar',
            caption: 'Imagem real do projeto aplicada a uma composição demonstrativa.',
            objectPosition: 'center',
            fitMode: 'cover',
          },
          links: [],
          media: [
            {
              id: 'preview-still-01',
              kind: 'image',
              title: 'Exemplo de galeria · enquadramento horizontal',
              image: {
                src: '/images/about/andressa-bruno.jpg',
                alt: 'Andressa e Bruno conversando diante da paisagem',
                caption: 'Still real do Menos Roteiros · uso demonstrativo.',
                objectPosition: 'center',
                fitMode: 'cover',
              },
            },
            {
              id: 'preview-still-02',
              kind: 'image',
              title: 'Exemplo de galeria · recorte de detalhe',
              image: {
                src: '/images/about/andressa-bruno.jpg',
                alt: 'Recorte de Andressa e Bruno durante a jornada',
                caption: 'A mesma fotografia real em outro ritmo editorial.',
                objectPosition: 'right center',
                fitMode: 'cover',
              },
            },
            {
              id: 'preview-reel-01',
              kind: 'reel',
              title: 'Exemplo de saída para Reel · conteúdo demonstrativo',
              url: 'https://instagram.com/menosroteiros',
            },
          ],
        },
      ],
    },
    {
      id: 'preview-experiencias',
      title: 'Comida, encontro e caminho',
      description:
        'Um capítulo para o que acontece ao redor da mesa, durante uma travessia ou numa conversa que muda a leitura de um lugar.',
      projects: [
        {
          id: 'preview-case-experiencia',
          title: 'O lugar contado por quem vive nele',
          featured: false,
          client: 'Exemplo demonstrativo · sem cliente real',
          city: 'Local ilustrativo',
          format: 'Reel narrativo · sequência fotográfica',
          objective:
            'Visualizar uma narrativa que apresenta pessoas e contexto antes de apresentar o produto.',
          description:
            'A câmera acompanha o gesto, o preparo e a conversa. O negócio aparece porque faz parte da história — não porque interrompeu a história para anunciar.',
          result:
            'Resultados, depoimentos e métricas permanecem ausentes até existirem dados verdadeiros.',
          services: ['Pesquisa de história', 'Captação', 'Edição'],
          cover: {
            src: '/images/about/andressa-bruno.jpg',
            alt: 'Andressa e Bruno durante uma conversa ao ar livre',
            caption: 'Preview editorial · não representa trabalho comercial.',
            objectPosition: 'left center',
            fitMode: 'cover',
          },
          links: [],
          media: [],
        },
      ],
    },
  ],
}
