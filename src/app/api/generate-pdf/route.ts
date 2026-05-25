import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import type { Browser, Page } from 'puppeteer'

// Lazy-loaded browser instance for reuse
let _browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (_browser && _browser.connected) {
    try {
      // Check if browser is still alive
      await _browser.version()
      return _browser
    } catch {
      _browser = null
    }
  }
  _browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  })
  return _browser
}

export async function POST(request: NextRequest) {
  const htmlContent = await request.text()
  if (!htmlContent) {
    return NextResponse.json({ error: 'No HTML content' }, { status: 400 })
  }

  let page: Page | null = null

  try {
    const browser = await getBrowser()
    page = await browser.newPage()

    // Set the HTML content with base URL for resolving local assets
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    })

    // Wait a bit for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate PDF with A4 page size
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    })

    await page.close()

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    if (page) {
      await page.close().catch(() => {})
    }
    // If browser seems broken, kill it so next request gets a fresh one
    if (_browser) {
      await _browser.close().catch(() => {})
      _browser = null
    }
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
