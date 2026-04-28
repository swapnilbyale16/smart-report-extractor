export function extractBankStatementFields(text) {
  return {
    accountNumber:   matchPattern(text, /account\s*(?:number|no\.?|#)\s*[:\-]?\s*([X\d\-\s]+)/i),
    statementPeriod: matchPattern(text, /(?:statement\s*period|period)\s*[:\-]?\s*([A-Za-z0-9 ,\-\/]+)/i),
    openingBalance:  matchPattern(text, /opening\s*balance\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
    closingBalance:  matchPattern(text, /closing\s*balance\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
    totalCredits:    matchPattern(text, /total\s*credits?\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
    totalDebits:     matchPattern(text, /total\s*debits?\s*[:\-]?\s*\$?\s*([0-9,]+\.?[0-9]*)/i),
  
    bankName:        matchPattern(text, /^([A-Z][A-Za-z\s]+(?:Bank|Financial|Credit Union))/m),
  };
}

function matchPattern(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}