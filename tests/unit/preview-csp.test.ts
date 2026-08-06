import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('CSP do Preview Vercel', () => {
  it('libera o Toolbar somente quando VERCEL_ENV é preview', () => {
    const source = readFileSync('src/proxy.ts', 'utf8')

    expect(source).toContain("process.env.VERCEL_ENV === 'preview'")
    expect(source).toContain('https://vercel.live')
    expect(source).toContain('wss://ws-us3.pusher.com')
    expect(source).toContain('https://assets.vercel.com')
  })
})
