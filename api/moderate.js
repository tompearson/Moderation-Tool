import { GoogleGenerativeAI } from '@google/generative-ai';

// Import the guidelines directly as a string
const MODERATION_RULES = `# Community Moderation Rules (.cursorrules)

## Purpose
Check whether a flagged post violates community guidelines. 

## When reviewing a post:
- Read the post carefully.
- Compare the content to each rule below.
- If any rule is violated, say which one and why.
- There are no specific "civil tone' guidelines but the goal of the guidelines is to create a safe, respectful inclusive space where neighbors can build stronger communities through constructive conversations. This platform is locally focused, not a place for discussing events in other states.

## Limitations
- This tool does not store any submitted posts and has no awareness of the origin of the input. As a result, it cannot identify nuanced or repetitive submissions.

## Local Coverage
### Counties
- WASHINGTON COUNTY OR (includes all cities and zip codes within Washington County)

### Specific Cities and Zip Codes
HILLSBORO OR 97124
BEAVERTON OR 97006, 97003, 97078
CORNELIUS OR 97113
FOREST GROVE OR 97116
GASTON OR 97119
NEWBURG OR 97132
SHERWOOD OR 97140
PORTLAND OR 97086
PORTLAND OR 97201
PORTLAND OR 97202
PORTLAND OR 97203
PORTLAND OR 97204
PORTLAND OR 97205
PORTLAND OR 97206
PORTLAND OR 97209
PORTLAND OR 97210
PORTLAND OR 97211
PORTLAND OR 97212
PORTLAND OR 97213
PORTLAND OR 97214
PORTLAND OR 97215
PORTLAND OR 97216
PORTLAND OR 97217
PORTLAND OR 97218
PORTLAND OR 97219
PORTLAND OR 97220
PORTLAND OR 97221
PORTLAND OR 97222
PORTLAND OR 97223
PORTLAND OR 97224
PORTLAND OR 97225
PORTLAND OR 97227
PORTLAND OR 97229
PORTLAND OR 97230
PORTLAND OR 97231
PORTLAND OR 97232
PORTLAND OR 97233
PORTLAND OR 97236
PORTLAND OR 97252
PORTLAND OR 97253
PORTLAND OR 97267

---

## Rules

### 1. Be Respectful
- No hate speech, slurs, or harassment.
- No threats or intimidation.
- No name-calling, personal attacks, or insults.
- Excessive profanity aimed at others is not allowed.
- If the post is respectful and focuses on a legitimate neighborhood concern without singling out or attacking the neighbor

### 2. Keep It Relevant
- Posts must be relevant to the local community.
- Do not share unrelated national politics or off-topic content.

### 3. Do Not Discriminate
- No content that discriminates or promotes hate based on race, ethnicity, religion, gender, sexual orientation, disability, or age.

### 4. No Misinformation
- Do not share false or misleading information that could harm others.
- Health, safety, or crime claims must be accurate.
- Do not allow misinformation about politics and election topics    

### 5. Respect Privacy
- Do not share someone's private information without consent (addresses, phone numbers, etc.).
- No doxxing.

### 6. No Prohibited Content
- No violence or calls for violence.
- No promotion of criminal acts.
- No adult sexual content or explicit material.
- No spam, scams, or fraudulent schemes.
- Public shaming
- Threats or harassment
- Selling or promoting illegal goods or services 
- Spam or misinformation

### 7. Civil Tone
- Use civil language.
- Avoid aggressive or offensive tone.

### 8. Incorrect Catagory 
- Items offered for sale or free are considered 'Posted In Error' 
and should not be in the main feed and should not be allowed.

---

## Output Format

When you analyze a post, always respond like this:

**Decision:** [Remove] or [Keep]  
**Reason:** [State the specific rule(s) and exactly why this post violates or does not violate them.]

IMPORTANT: Keep your response brief and concise and limited to 300 characters. Focus on the most relevant rule violations or reasons for keeping the post. Avoid lengthy explanations unless necessary. Limit response to 300 characters.`;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Available models with fallback order
const MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro'];

// Generate content with fallback
async function generateContent(prompt) {
  let response = null;
  let usedModel = '';

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      response = await result.response;
      usedModel = modelName;
      console.log(`✅ Successfully used model: ${modelName}`);
      break;
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
      continue;
    }
  }

  if (!response) {
    throw new Error('All AI models are currently unavailable');
  }

  try {
    return {
      text: response.text(),
      model: usedModel
    };
  } catch (error) {
    console.error('❌ Error extracting text from response:', error.message);
    throw new Error(`Failed to extract text from ${usedModel} response: ${error.message}`);
  }
}

// Parse AI response
function parseModerationResponse(text) {
  // Look for the decision pattern
  const decisionMatch = text.match(/\*\*Decision:\*\*\s*(Remove|Keep)/i);
  
  // Look for the reason pattern - be more flexible with the matching
  let reasonMatch = text.match(/\*\*Reason:\*\*\s*(.+?)(?=\n\n|\n\*\*|$)/i);
  
  // If that doesn't work, try a simpler approach
  if (!reasonMatch) {
    reasonMatch = text.match(/\*\*Reason:\*\*\s*(.+)/i);
  }
  
  const decision = decisionMatch ? decisionMatch[1] : 'Keep';
  let reason = 'Unable to determine specific reason';
  
  if (reasonMatch && reasonMatch[1]) {
    reason = reasonMatch[1].trim();
    // Remove any trailing punctuation or extra text
    reason = reason.replace(/[.!?]+$/, '');
  }

  return { decision, reason };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received request body:', req.body);
  console.log('Request body type:', typeof req.body);
  console.log('Request body keys:', Object.keys(req.body || {}));
  
  // Handle both 'content' and 'postContent' field names for flexibility
  const content = req.body.content || req.body.postContent;
  console.log('Extracted content:', content);
  console.log('Content type:', typeof content);
  console.log('Content length:', content ? content.length : 'null');
  
  // Validate that we have content to moderate
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Missing or invalid content. Please provide a post to moderate.',
      received: req.body 
    });
  }

  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY environment variable is not set. Please configure your API key in Vercel.' 
    });
  }
  
  try {
    // Construct the full moderation prompt
    const prompt = `SYSTEM: You are a community moderation AI. Your ONLY job is to analyze posts and determine if they violate community guidelines. You must respond in the exact format specified.

TASK: Analyze the following post according to these community guidelines:

${MODERATION_RULES}

POST TO MODERATE:
"${content}"

MODERATION INSTRUCTIONS:
- You are a community moderator reviewing a flagged post
- Compare the post content to each rule above
- Determine if the post should be kept or removed
- When in doubt, err on the side of keeping posts
- Only remove posts that clearly violate rules
- Consider context and intent
- Be lenient with local community content

REQUIRED RESPONSE FORMAT (you must use exactly this format):
**Decision:** [Remove] or [Keep]
**Reason:** [Brief explanation of which rule(s) apply and why]

Keep your response under 300 characters. Focus only on the moderation decision.`;

    // Send the full prompt to the AI
    console.log('Full prompt length:', prompt.length);
    console.log('Post content being moderated:', content);
    console.log('Sending prompt to AI (first 1000 chars):', prompt.substring(0, 1000) + '...');
    const aiResponse = await generateContent(prompt);
    console.log('AI Response:', aiResponse.text);
    
    // Parse the AI response to extract decision and reason
    const parsedResult = parseModerationResponse(aiResponse.text);
    console.log('Parsed Result:', parsedResult);
    
    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({ error: error.message });
  }
} 