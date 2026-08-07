import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { VisualEditing } from 'next-sanity/visual-editing'
import { HomeComposition } from '@/components/home/home-composition'
import { EditorialPreviewSourceMarker } from '@/components/editorial/editorial-preview-source-marker'
import { resolveEditorialHome } from '@/sanity/editorial/home'

export const dynamic = 'force-dynamic'

export default async function EditorialHomePage() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const home = await resolveEditorialHome(true)

  return (
    <>
      <EditorialPreviewSourceMarker source={home.source} />
      <HomeComposition content={home.content} editorialSections={home.sections} />
      <VisualEditing />
    </>
  )
}
