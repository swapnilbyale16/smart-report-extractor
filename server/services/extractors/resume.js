export function extractResumeFields(text) {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/(\+?[\d\s\-().]{7,15})/);

  // Improved skills extraction — catches more formats
  const techKeywords = [
    'javascript', 'typescript', 'react', 'node', 'express', 'mongodb', 'sql',
    'python', 'java', 'html', 'css', 'git', 'docker', 'aws', 'rest', 'api',
    'redux', 'nextjs', 'vue', 'angular', 'mysql', 'postgresql', 'firebase',
    'tailwind', 'bootstrap', 'graphql', 'linux', 'figma', 'jest', 'mocha'
  ];

  const lowerText = text.toLowerCase();
  const skills = techKeywords.filter(skill => lowerText.includes(skill));

  return {
    email:        emailMatch ? emailMatch[0] : null,
    phone:        phoneMatch ? phoneMatch[1].trim() : null,
    skills,
    hasEducation:  /education|university|degree|bachelor|master|phd/i.test(text),
    hasExperience: /experience|employment|work history/i.test(text),
    linkedIn:     matchPattern(text, /linkedin\.com\/in\/([A-Za-z0-9\-]+)/i),
  };
}

function matchPattern(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}