import process from 'process';

const FORMAT_LABELS = {
  invoice: 'Invoice',
  bank_statement: 'Bank Statement',
  resume: 'Resume/CV',
  medical: 'Medical Report'
};

export async function generateSummary(reportType, extractedFields, textSnippet) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarize this ${FORMAT_LABELS[reportType]} in 3-4 plain English sentences for a non-technical reader. Be specific and use actual values.

Extracted fields:
${JSON.stringify(extractedFields, null, 2)}

Document excerpt:
${textSnippet.slice(0, 800)}`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('[LLM] Full error response:', JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || 'Gemini API error');
    }

    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.warn('[LLM] Summary generation failed:', err.message);
    return generateFallbackSummary(reportType, extractedFields);
  }
}

function generateFallbackSummary(reportType, fields) {
  const label = FORMAT_LABELS[reportType] || 'Document';
  const nonNullFields = Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined && v !== false && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('; ');

  return `[Summary generated without LLM] This is a ${label}. Extracted information: ${nonNullFields || 'No structured fields could be extracted.'}`;
}