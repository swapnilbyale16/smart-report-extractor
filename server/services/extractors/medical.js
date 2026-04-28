export function extractMedicalFields(text) {
  return {
    patientName:  matchPattern(text, /patient\s*name\s*[:\-]?\s*([A-Za-z]+(?:\s[A-Za-z]+){0,2})/i),
    dateOfBirth:  matchPattern(text, /(?:dob|date\s*of\s*birth)\s*[:\-]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})/i),
    diagnosis:    matchPattern(text, /diagnosis\s*[:\-]?\s*([A-Za-z0-9 .,\-]+)/i),
    physician:    matchPattern(text, /(?:physician|doctor|dr\.?)\s*[:\-]?\s*([A-Za-z ,.]+)/i),
    medications:  matchPattern(text, /(?:medication|prescription|drug)\s*[:\-]?\s*([A-Za-z0-9 .,\-]+)/i),
    visitDate:    matchPattern(text, /(?:visit|report|date)\s*[:\-]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})/i),
  };
}

function matchPattern(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}