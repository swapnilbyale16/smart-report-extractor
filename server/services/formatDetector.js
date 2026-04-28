// Scoring-based format detection — more robust than single keyword checks
const FORMAT_SIGNALS = {
  invoice: [
    'invoice', 'bill to', 'invoice number', 'invoice #', 'due date',
    'subtotal', 'amount due', 'payment terms', 'vendor', 'purchase order'
  ],
  bank_statement: [
    'account number', 'statement period', 'opening balance', 'closing balance',
    'debit', 'credit', 'transaction', 'deposit', 'withdrawal', 'bank statement'
  ],
  resume: [
    'experience', 'education', 'skills', 'objective', 'summary',
    'employment', 'university', 'degree', 'references', 'linkedin'
  ],
  medical: [
    'patient', 'diagnosis', 'prescription', 'doctor', 'physician',
    'dosage', 'medication', 'blood pressure', 'clinical', 'symptoms'
  ]
};

export function detectFormat(text) {
  const lower = text.toLowerCase();
  const scores = {};

  for (const [format, signals] of Object.entries(FORMAT_SIGNALS)) {
    scores[format] = signals.filter(signal => lower.includes(signal)).length;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  // Require at least 2 matching signals to be confident
  if (best[1] < 2) {
    const err = new Error('Could not confidently determine report type. Supported: Invoice, Bank Statement, Resume, Medical Report.');
    err.code = 'UNKNOWN_FORMAT';
    err.status = 422;
    throw err;
  }

  return best[0]; // 'invoice' | 'bank_statement' | 'resume' | 'medical'
}