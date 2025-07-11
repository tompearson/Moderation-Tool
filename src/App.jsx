import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import the rules directly as a string to avoid Vite processing
const MODERATION_RULES = `# Nextdoor Community Moderation Rules (.cursorrules)

## Purpose


Check whether a flagged post violates Nextdoor's Community Guidelines.  
Decide if it should be removed or kept.
Nextdoor aims to foster strong, helpful, and authentic local communities by facilitating relevant discussions and mutual communication among neighbors.

## When reviewing a post:
- Read the post carefully.
- Compare the content to each rule below.
- If any rule is violated, say which one and why.

---

## Rules

### 1. Be Respectful
- No hate speech, slurs, or harassment.
- No threats or intimidation.
- No name-calling, personal attacks, or insults.
- Excessive profanity aimed at others is not allowed.

### 2. Keep It Relevant
- Posts must be relevant to the local community.
- Do not share unrelated national politics or off-topic content.

### 3. Do Not Discriminate
- No content that discriminates or promotes hate based on race, ethnicity, religion, gender, sexual orientation, disability, or age.

### 4. No Misinformation
- Do not share false or misleading information that could harm others.
- Health, safety, or crime claims must be accurate.

### 5. Respect Privacy
- Do not share someone's private information without consent (addresses, phone numbers, etc.).
- No doxxing.

### 6. No Prohibited Content
- No violence or calls for violence.
- No promotion of criminal acts.
- No adult sexual content or explicit material.
- No spam, scams, or fraudulent schemes.

### 7. Civil Tone
- Use civil language.
- Avoid aggressive or offensive tone.

---

## Output Format

When you analyze a post, always respond like this:

**Decision:** [Remove] or [Keep]  
**Reason:** [State the specific rule(s) and exactly why this post violates or does not violate them.]`;

// Hardcoded API key
const GEMINI_API_KEY = 'AIzaSyCjosDYs15EFppjV2iP2JNdkz5bU-5Qylc';

// Available models to try in order (updated based on test results)
const MODELS_TO_TRY = [
  'gemini-1.5-flash'  // Keep this as primary, it works when not overloaded
];

function App() {
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const tryModel = async (modelName, prompt, retryCount = 0) => {
    console.log('DEBUG: tryModel function called with model:', modelName);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('DEBUG: AI Response received:', text);
      
      // Parse the response to extract decision and reason
      const decisionMatch = text.match(/\*\*Decision:\*\*\s*(Remove|Keep)/);
      const reasonMatch = text.match(/\*\*Reason:\*\*\s*(.+)/s);
      
      console.log('DEBUG: decisionMatch:', decisionMatch);
      console.log('DEBUG: reasonMatch:', reasonMatch);
      
      if (decisionMatch && reasonMatch) {
        const decision = decisionMatch[1];
        const reason = reasonMatch[1].trim();
        
        return { decision, reason };
      } else {
        console.log('DEBUG: Parsing failed. Full response:', text);
        throw new Error('Unable to parse AI response');
      }
    } catch (err) {
      // If model is overloaded and we haven't retried too many times, wait and retry
      if (err.message.includes('overloaded') && retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        return tryModel(modelName, prompt, retryCount + 1);
      }
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postContent.trim()) {
      setError('Please enter a post to moderate.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    const prompt = `You are a Nextdoor community moderator. Review the following post according to these rules:

${MODERATION_RULES}

Post to review:
"${postContent}"

Please analyze this post and respond in exactly this format:

**Decision:** [Remove] or [Keep]
**Reason:** [State the specific rule(s) and exactly why this post violates or does not violate them.]

Be thorough in your analysis and reference specific rules from the guidelines.`;

    // Try each model in sequence
    for (let i = 0; i < MODELS_TO_TRY.length; i++) {
      const modelName = MODELS_TO_TRY[i];
      
      try {
        setError(`Trying model: ${modelName}...`);
        const result = await tryModel(modelName, prompt);
        setResult(result);
        setError(''); // Clear any previous error
        break; // Success, exit the loop
      } catch (err) {
        console.error(`Error with model ${modelName}:`, err);
        
        // If this is the last model, show the error
        if (i === MODELS_TO_TRY.length - 1) {
          if (err.message.includes('API_KEY_INVALID')) {
            setError('Invalid API key. Please check the configuration.');
          } else if (err.message.includes('QUOTA_EXCEEDED')) {
            setError('API quota exceeded. Please check your Google AI usage limits.');
          } else if (err.message.includes('overloaded')) {
            setError('All models are currently overloaded. Please try again in a few minutes.');
          } else if (err.message.includes('models/') && err.message.includes('not found')) {
            setError('No available models found. Please check your API access.');
          } else {
            setError(`Error: ${err.message}`);
          }
        }
        // Continue to next model if available
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Nextdoor Moderation Tool</h1>
        <p>AI-powered post moderation using Nextdoor Community Guidelines</p>
      </div>
      
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postContent">Flagged Post Content:</label>
            <textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Paste the flagged Nextdoor post here..."
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="button" 
            disabled={isLoading || !postContent.trim()}
          >
            {isLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                Analyzing post...
              </div>
            ) : (
              'Analyze Post'
            )}
          </button>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className={`result ${result.decision.toLowerCase()}`}>
            <h3>Moderation Result</h3>
            <div className={`decision ${result.decision.toLowerCase()}`}>
              Decision: {result.decision}
            </div>
            <div className="reason">
              {result.reason}
            </div>
            <button 
              className="copy-button"
              onClick={() => {
                const textToCopy = `Decision: ${result.decision}\n\nReason: ${result.reason}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                  // Optional: Show a brief "Copied!" message
                  const button = document.querySelector('.copy-button');
                  const originalText = button.textContent;
                  button.textContent = 'Copied!';
                  setTimeout(() => {
                    button.textContent = originalText;
                  }, 2000);
                }).catch(err => {
                  console.error('Failed to copy: ', err);
                });
              }}
            >
              Copy Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 