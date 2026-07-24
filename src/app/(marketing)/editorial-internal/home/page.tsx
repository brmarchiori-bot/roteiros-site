import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { HomeComposition } from '@/components/home/home-composition'
import { EditorialPreviewSourceMarker } from '@/components/editorial/editorial-preview-source-marker'
import { resolveEditorialPillars } from '@/sanity/editorial/pillars'

export const dynamic = 'force-dynamic'

export default async function EditorialHomePage() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const pillars = await resolveEditorialPillars(true)

  return (
    <>
      <EditorialPreviewSourceMarker source={pillars.source} />
      <HomeComposition pillars={pillars.content} />
    </>
  )
}
