import { aboutSchema } from './about'
import { contentHighlightsSchema } from './content-highlights'
import { controlledImageSchema } from './controlled-image'
import { heroSchema } from './hero'
import { nowSchema } from './now'

export const schemaTypes = [
  controlledImageSchema,
  heroSchema,
  aboutSchema,
  nowSchema,
  contentHighlightsSchema,
]
