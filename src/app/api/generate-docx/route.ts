import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const htmlContent = await request.text()
  if (!htmlContent) {
    return NextResponse.json({ error: 'No HTML content' }, { status: 400 })
  }

  try {
    // Create a Word-compatible HTML document
    // Microsoft Word can open HTML files with proper namespaces and @page directives
    const wordDocument = createWordDocument(htmlContent)
    const bytes = new Uint8Array(wordDocument)

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/msword',
        'Content-Disposition': 'attachment; filename="document.doc"',
      },
    })
  } catch (err) {
    console.error('DOC generation error:', err)
    return NextResponse.json({ error: 'DOC generation failed' }, { status: 500 })
  }
}

function createWordDocument(htmlContent: string): Buffer {
  // Clean the HTML for Word compatibility
  const cleanedHtml = htmlContent
    .replace(/background:\s*#d4d4d4/g, 'background: #ffffff')
    .replace(/box-shadow:[^;"]*;/g, '')
    .replace(/margin:\s*40px auto/g, 'margin: 0 auto')
    .replace(/@import url\([^)]+\);/g, '') // Remove Google Fonts import (Word won't fetch it)
    .replace(/-webkit-print-color-adjust:[^;]+;/g, '')
    .replace(/print-color-adjust:[^;]+;/g, '')

  // Create a Word-compatible HTML document with Microsoft Office namespaces
  // This format is recognized by Microsoft Word, LibreOffice, and Google Docs
  const wordDoc = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 21cm 29.7cm;
      margin: 1.5cm;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      color: #111111;
      line-height: 1.4;
    }
    img {
      max-width: 100%;
    }
    table {
      border-collapse: collapse;
    }
  </style>
</head>
<body>
${cleanedHtml}
</body>
</html>`

  return Buffer.from(wordDoc, 'utf-8')
}
