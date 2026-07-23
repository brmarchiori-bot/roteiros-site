import { expect, test } from '@playwright/test'

const portfolioKey = 'portfolio-e2e-1234567890abcdef'

test('home abre, mantém conteúdo essencial e FAQ consistente com JSON-LD', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('#about')).toBeVisible()
  await expect(page.locator('#now')).toBeVisible()
  await expect(page.locator('#content')).toBeVisible()
  await expect(page.locator('#partnerships')).toBeVisible()
  await expect(page.locator('main > section')).toHaveCount(7)

  const questions = await page.locator('#faq details h3').allTextContents()
  const schema = JSON.parse(await page.locator('#faq-schema').textContent() ?? '{}')
  expect(schema.mainEntity.map((item: { name: string }) => item.name)).toEqual(questions)

  const journey = await page.locator('#hero').getByText(/^(Dia \d+|Em movimento)/).first()
    .textContent()
  expect(journey?.trim()).toBeTruthy()
})

test('navegação principal aponta para seções existentes', async ({ page }) => {
  await page.goto('/')

  for (const href of ['/#now', '/#about', '/#content', '/#partnerships']) {
    const link = page.locator(`header nav a[href="${href}"]`)
    await expect(link).toBeVisible()
    await expect(page.locator(`#${href.split('#')[1]}`)).toHaveCount(1)
  }
})

test('menu mobile contém o foco, fecha com Escape e devolve o foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const trigger = page.getByRole('button', { name: 'Abrir menu' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Menu principal' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('não existe overflow horizontal nas larguras de lançamento', async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 414, height: 896 },
    { width: 768, height: 1024 },
    { width: 1024, height: 900 },
    { width: 1280, height: 900 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `overflow em ${viewport.width}px`).toBeLessThanOrEqual(1)
  }
})

test('páginas provisórias permanecem noindex', async ({ page }) => {
  for (const path of ['/sobre', '/parcerias', '/conteudo', '/caderno', '/jornada']) {
    await page.goto(path)
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
  }
})

test('sitemap contém somente páginas publicáveis', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  const sitemap = await response.text()

  expect(response.ok()).toBe(true)
  expect(sitemap).toContain('<loc>https://menosroteiros.com.br/</loc>')
  expect(sitemap).not.toContain('/portfolio/')
  expect(sitemap).not.toContain('/sobre')
  expect(sitemap).not.toContain('/parcerias')
})

test('portfólio rejeita chave inválida e protege chave válida', async ({
  page,
  request,
}) => {
  const invalid = await request.get('/portfolio/chave-invalida')
  expect(invalid.status()).toBe(404)

  const valid = await request.get(`/portfolio/${portfolioKey}`)
  expect(valid.status()).toBe(200)
  expect(valid.headers()['x-robots-tag']).toContain('noindex')
  expect(valid.headers()['cache-control']).toContain('no-store')

  await page.goto(`/portfolio/${portfolioKey}`)
  const robots = await page.locator('meta[name="robots"]').getAttribute('content')
  expect(robots).toContain('noindex')
  expect(robots).toContain('nofollow')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
  await expect(page.getByText('Preview Editorial', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByText(/demonstração fictícia · nenhum cliente ou resultado real/i),
  ).toBeVisible()
  await expect(page.getByText(/não descreve uma hospedagem ou trabalho existente/i)).toBeVisible()
})

test('home não coleta dados enquanto formulários estão indisponíveis', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('input[type="email"]')).toHaveCount(0)
  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.getByText(/cadastro concluído|inscrição confirmada/i)).toHaveCount(0)
})

test('mídia ausente não produz imagem quebrada e links externos são seguros', async ({
  page,
}) => {
  await page.goto('/')

  const failedImages = await page.locator('img').evaluateAll((images) =>
    (images as HTMLImageElement[]).filter(
      (image) => !image.complete || image.naturalWidth === 0,
    ).length,
  )
  expect(failedImages).toBe(0)

  const unsafeBlankLinks = await page.locator('a[target="_blank"]').evaluateAll((links) =>
    (links as HTMLAnchorElement[]).filter(
      (link) => !link.rel.split(/\s+/).includes('noopener'),
    ).length,
  )
  expect(unsafeBlankLinks).toBe(0)
})

test('contato de parceiros não aponta para mídia kit inexistente', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('a[href="/midia-kit.pdf"]')).toHaveCount(0)
  const partnershipEmail = page.getByRole('link', {
    name: 'Solicitar apresentação por email',
  })
  await expect(partnershipEmail).toHaveAttribute(
    'href',
    /^mailto:parcerias@menosroteiros\.com\.br/,
  )
})

test('Studio falha de forma orientada quando o ambiente Sanity não está configurado', async ({
  page,
}) => {
  const response = await page.goto('/studio')

  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Studio ainda não configurado' })).toBeVisible()
  const robots = await page.locator('meta[name="robots"]').getAttribute('content')
  expect(robots).toContain('noindex')
})
