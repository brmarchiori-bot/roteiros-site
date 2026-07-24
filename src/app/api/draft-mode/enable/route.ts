import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { createEditorialClient } from '@/sanity/editorial/client.server'

export const dynamic = 'force-dynamic'

const client = createEditorialClient({ stega: false })
const officialDraftMode = client ? defineEnableDraftMode({ client }) : null

export const GET = officialDraftMode
  ? officialDraftMode.GET
  : async function unavailable() {
      return new Response('Prévia editorial indisponível.', {
        status: 503,
        headers: {
          'Cache-Control': 'private, no-store, max-age=0',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
          'Referrer-Policy': 'no-referrer',
        },
      })
    }
