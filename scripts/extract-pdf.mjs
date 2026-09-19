import { readFile } from 'node:fs/promises'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

const pdfPath = process.argv[2]

if (!pdfPath) {
  console.error('Uso: node scripts/extract-pdf.mjs <archivo.pdf>')
  process.exit(1)
}

const data = new Uint8Array(await readFile(pdfPath))
const pdf = await pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false }).promise

console.log(`PAGINAS: ${pdf.numPages}`)

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
  const page = await pdf.getPage(pageNumber)
  const content = await page.getTextContent()
  const text = content.items.map((item) => item.str).join(' ')

  console.log(`\n--- PAGINA ${pageNumber} ---\n${text}`)
}
