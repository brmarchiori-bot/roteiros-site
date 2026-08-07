import { HomeComposition } from '@/components/home/home-composition'
import {
  getAboutFromSanity,
  getContentHighlightsFromSanity,
  getFaqFromSanity,
  getHeroFromSanity,
  getNowFromSanity,
  getPartnershipsFromSanity,
  getPillarsFromSanity,
} from '@/sanity/queries'

/** Home editorial enxuta: sete capítulos, sem promessas de produtos futuros. */
export default async function HomePage() {
  const [hero, now, about, pillars, contentHighlights, partnerships, faq] =
    await Promise.all([
      getHeroFromSanity(),
      getNowFromSanity(),
      getAboutFromSanity(),
      getPillarsFromSanity(),
      getContentHighlightsFromSanity(),
      getPartnershipsFromSanity(),
      getFaqFromSanity(),
    ])

  return (
    <HomeComposition
      content={{ hero, now, about, pillars, contentHighlights, partnerships, faq }}
    />
  )
}
