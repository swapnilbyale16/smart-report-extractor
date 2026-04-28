import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function extractTextFromPDF(buffer) {
  try {
    // Convert Buffer to Uint8Array — pdfjs requires this
    const uint8Array = new Uint8Array(buffer);
    
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    if (!fullText || fullText.trim().length < 50) {
      const err = new Error('PDF appears to be empty or image-only (not parseable)');
      err.code = 'UNPARSEABLE_PDF';
      err.status = 422;
      throw err;
    }

    return fullText;
  } catch (err) {
    if (err.code === 'UNPARSEABLE_PDF') throw err;
    const wrapped = new Error('Failed to parse PDF: ' + err.message);
    wrapped.code = 'PDF_PARSE_ERROR';
    wrapped.status = 422;
    throw wrapped;
  }
}