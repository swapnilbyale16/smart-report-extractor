export function extractInvoiceFields(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  return {
    invoiceNumber: matchPattern(text, /invoice\s*#?\s*[:\-]?\s*([A-Z0-9\-]+)/i),
    invoiceDate:   matchPattern(text, /(?:invoice\s*)?date\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i),
    dueDate:       matchPattern(text, /due\s*date\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i),
    vendor:        matchPattern(text, /(?:from|vendor|billed?\s*by)\s*[:\-]?\s*([A-Za-z0-9 .,]+)/i),
    billTo:        matchPattern(text, /bill\s*to\s*[:\-]?\s*([A-Za-z0-9 .,]+)/i),
    totalAmount:   matchPattern(text, /(?:total|amount\s*due)\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
    tax:           matchPattern(text, /tax\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
    subtotal:      matchPattern(text, /subtotal\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
  };
}

function matchPattern(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}