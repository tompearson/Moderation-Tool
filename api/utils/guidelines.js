const fs = require('fs');

// Load community guidelines from .cursorrules
function loadGuidelines() {
  try {
    const rulesContent = fs.readFileSync('.cursorrules', 'utf8');
    return rulesContent;
  } catch (error) {
    console.error('Error loading guidelines:', error);
    return 'Error loading community guidelines';
  }
}

// Parse guidelines into structured format
function parseGuidelines() {
  const rawContent = loadGuidelines();
  
  return {
    rules: [
      { id: 1, title: 'Be Respectful', description: 'No hate speech, slurs, or harassment.' },
      { id: 2, title: 'Keep It Relevant', description: 'Posts must be relevant to the local community.' },
      { id: 3, title: 'Do Not Discriminate', description: 'No content that discriminates or promotes hate.' },
      { id: 4, title: 'No Misinformation', description: 'Do not share false or misleading information.' },
      { id: 5, title: 'Respect Privacy', description: 'Do not share private information without consent.' },
      { id: 6, title: 'No Prohibited Content', description: 'No violence, criminal acts, or adult content.' },
      { id: 7, title: 'Civil Tone', description: 'Use civil language and avoid aggressive tone.' },
      { id: 8, title: 'Incorrect Category', description: 'Items for sale should not be in main feed.' }
    ],
    localCoverage: {
      zipCodes: ['97124', '97006', '97003', '97078', '97113', '97116', '97119', '97132', '97140', '97086'],
      cities: ['Hillsboro', 'Beaverton', 'Cornelius', 'Forest Grove', 'Gaston', 'Newburg', 'Sherwood', 'Portland']
    },
    rawContent
  };
}

module.exports = {
  loadGuidelines,
  parseGuidelines
}; 