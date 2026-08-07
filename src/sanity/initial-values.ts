import {
  about,
  contentHighlights,
  faq,
  hero,
  now,
  partnerships,
  pillars,
} from '@/content'

/** Valores usados somente na primeira abertura de cada singleton no Studio. */
export const initialHero = {
  meta: hero.meta,
  titlePrefix: hero.titlePrefix,
  dynamicWords: hero.dynamicWords,
  headline: hero.headline,
  subheadline: hero.subheadline,
  primaryCta: hero.ctas.primary,
  showJourneyCredits: hero.showJourneyCredits,
  contentWidth: 'medium',
}

export const initialNow = {
  meta: now.meta,
  ...(now.dayCount === null ? {} : { dayCount: now.dayCount }),
  ...(now.journeyState ? { journeyState: now.journeyState } : {}),
  caption: now.caption,
  city: now.city,
  country: now.country,
  period: now.period,
  date: now.date,
  cta: now.cta,
  atmosphere: now.atmosphere ?? 'charcoal',
  contentWidth: 'medium',
  imagePosition: 'left',
}

export const initialAbout = {
  meta: about.meta,
  chapters: about.chapters.map((chapter, index) => ({
    _key: `capitulo-${index + 1}`,
    _type: 'chapter',
    number: chapter.number,
    title: chapter.title,
    body: chapter.body,
  })),
  closingCta: about.closingCta,
  contentWidth: 'medium',
  imagePosition: 'left',
}

export const initialPillars = {
  meta: pillars.meta,
  items: pillars.items.map((item) => ({
    _key: item.id,
    _type: 'object',
    title: item.title,
    description: item.description,
  })),
}

export const initialContentHighlights = {
  meta: contentHighlights.meta,
  pullQuote: contentHighlights.pullQuote,
  channels: contentHighlights.channels,
  contentWidth: 'medium',
}

export const initialPartnerships = {
  meta: partnerships.meta,
  philosophy: partnerships.philosophy,
  principles: partnerships.principles.map((principle) => ({
    _key: principle.id,
    _type: 'object',
    title: principle.title,
    body: principle.body,
  })),
  formats: partnerships.formats.map((format) => ({
    _key: format.id,
    _type: 'object',
    name: format.name,
    description: format.description,
    audience: format.audience,
  })),
}

export const initialFaq = {
  meta: faq.meta,
  intro: faq.intro,
  items: faq.items.map((item, index) => ({
    _key: `pergunta-${index + 1}`,
    _type: 'faqItem',
    question: item.question,
    answer: item.answer,
  })),
}
