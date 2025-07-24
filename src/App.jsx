import React, { useState } from 'react';

// Import the rules from .cursorrules file
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

IMPORTANT: Keep your response brief and concise. Focus on the most relevant rule violations or reasons for keeping the post. Avoid lengthy explanations unless necessary. The character limit will be specified in the moderation instructions.`;

// API endpoint for moderation - use production URL when deployed
const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? '/api/moderate'  // Use relative path for production (same domain). Set 
  : `http://localhost:${process.env.REACT_APP_API_PORT || 3001}/api/moderate`;  // Use configurable port for development

function App() {
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [characterLimit, setCharacterLimit] = useState(300); // Default to 300 chars

  const moderatePost = async (content, charLimit = 300) => {
    try {
      const requestBody = { content, characterLimit: charLimit };
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Development-only logging
      if (process.env.NODE_ENV !== 'production') {
        // console.log('Moderation result:', { 
        //   decision: result.decision, 
        //   model: result.model,
        //   characterCount: result.characterCount 
        // });
      }
      
      return result;
    } catch (err) {
      console.error('Request failed:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitWithLimit(characterLimit);
  };

  const handleSubmitWithLimit = async (limit) => {
    if (!postContent.trim()) {
      setError('Please enter a post to moderate.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const result = await moderatePost(postContent, limit);
      setResult(result);
      setError(''); // Clear any previous error
    } catch (err) {
      console.error('Moderation error:', err);
      
      if (err.message.includes('API_KEY_INVALID') || err.message.includes('Invalid API key')) {
        setError('Invalid API key. Please check the configuration.');
      } else if (err.message.includes('QUOTA_EXCEEDED')) {
        setError('API quota exceeded. Please check your Google AI usage limits.');
      } else if (err.message.includes('SAFETY')) {
        setError('Content was blocked by safety filters. Please try with different content.');
      } else if (err.message.includes('PERMISSION_DENIED')) {
        setError('API key does not have access to this model. Please check your API permissions.');
      } else if (err.message.includes('overloaded') || err.message.includes('503') || err.status === 503) {
        setError('All models are currently overloaded or unavailable. Please try again in a few minutes.');
      } else if (err.message.includes('models/') && err.message.includes('not found')) {
        setError('No available models found. Please check your API access.');
      } else {
        setError(`Error: ${err.message}`);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
              <div className="header">
          <h1>Community Moderation Assistant</h1>
          <p>AI-powered post moderation using community guidelines</p>
          <div className="version">v0.7.0-alpha</div>
        </div>
      
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postContent">Flagged Post Content:</label>
            <textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Paste the flagged community post here... (Ctrl+V or use Paste button)"
              disabled={isLoading}
            />
            
            <div className="button-row">
              {!postContent && (
                <button 
                  type="button"
                  className="paste-button"
                  onClick={async () => {
                    try {
                      // Check if clipboard API is available
                      if (!navigator.clipboard) {
                        setError('Clipboard API not supported. Please paste manually (Ctrl+V).');
                        return;
                      }
                      
                      // Request clipboard permission
                      const permission = await navigator.permissions.query({ name: 'clipboard-read' });
                      if (permission.state === 'denied') {
                        setError('Clipboard permission denied. Please paste manually (Ctrl+V).');
                        return;
                      }
                      
                      const text = await navigator.clipboard.readText();
                      if (text.trim()) {
                        setPostContent(text);
                        setResult(null);
                        setError('');
                      } else {
                        setError('Clipboard is empty. Please copy some text first.');
                      }
                    } catch (err) {
                      console.error('Failed to read clipboard:', err);
                      if (err.name === 'NotAllowedError') {
                        setError('Clipboard access denied. Please paste manually (Ctrl+V).');
                      } else {
                        setError('Unable to access clipboard. Please paste manually (Ctrl+V).');
                      }
                    }
                  }}
                  disabled={isLoading}
                >
                  📋 Paste Content
                </button>
              )}
              {postContent && (
                <>
                  <button 
                    type="button"
                    className="clear-button"
                    onClick={() => {
                      setPostContent('');
                      setResult(null);
                      setError('');
                    }}
                    disabled={isLoading}
                  >
                    Clear Content
                  </button>
                  <button 
                    type="button"
                    className="clear-paste-button"
                    onClick={async () => {
                      try {
                        // Check if clipboard API is available
                        if (!navigator.clipboard) {
                          setError('Clipboard API not supported. Please paste manually (Ctrl+V).');
                          return;
                        }
                        
                        // Request clipboard permission
                        const permission = await navigator.permissions.query({ name: 'clipboard-read' });
                        if (permission.state === 'denied') {
                          setError('Clipboard permission denied. Please paste manually (Ctrl+V).');
                          return;
                        }
                        
                        const text = await navigator.clipboard.readText();
                        if (text.trim()) {
                          setPostContent(text);
                          setResult(null);
                          setError('');
                        } else {
                          setError('Clipboard is empty. Please copy some text first.');
                        }
                      } catch (err) {
                        console.error('Failed to read clipboard:', err);
                        if (err.name === 'NotAllowedError') {
                          setError('Clipboard access denied. Please paste manually (Ctrl+V).');
                        } else {
                          setError('Unable to access clipboard. Please paste manually (Ctrl+V).');
                        }
                      }
                    }}
                    disabled={isLoading}
                  >
                    🔄 Clear & Paste
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="button-group">
                         <button 
               type="button" 
               className="button quick-analysis-button"
               onClick={() => {
                 setCharacterLimit(300);
                 handleSubmitWithLimit(300);
               }}
               disabled={isLoading || !postContent.trim()}
             >
                              {isLoading && characterLimit === 300 ? (
                 <div className="loading">
                   <div className="spinner"></div>
                   Quick Analysis...
                 </div>
               ) : (
                 'Quick Analysis'
               )}
             </button>
            
                         <button 
               type="button" 
               className="button detailed-analysis-button"
               onClick={() => {
                 setCharacterLimit(2000);
                 handleSubmitWithLimit(2000);
               }}
               disabled={isLoading || !postContent.trim()}
             >
                              {isLoading && characterLimit === 2000 ? (
                 <div className="loading">
                   <div className="spinner"></div>
                   Detailed Analysis...
                 </div>
               ) : (
                 'Detailed Analysis'
               )}
             </button>
            
            <button 
              type="button" 
              className="button rules-button"
              onClick={() => setShowRules(true)}
              disabled={isLoading}
            >
              📋 Show Guidelines
            </button>
          </div>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className={`result ${result.decision.toLowerCase()}`}>
            <div className="result-info">
              <div className="character-info">
                <small>Response: {result.characterCount || 0} / {result.characterLimit || characterLimit} characters • AI Model: {result.model}</small>
              </div>
            </div>
            <h3>Moderation Result ({result.characterLimit || result.characterCount || characterLimit} chars)</h3>
            <div className={`decision ${result.decision.toLowerCase()}`}>
              Decision: {result.decision}
            </div>
            <div className="reason">
              {result.reason}
            </div>
            <button 
              className="copy-button"
              onClick={() => {
                const textToCopy = result.reason;
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
              Copy Reason
            </button>
          </div>
        )}
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Community Guidelines</h2>
              <button 
                className="modal-close"
                onClick={() => setShowRules(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="rules-content">
                <div className="rules-section">
                  <h3>🎯 Purpose</h3>
                  <p>Check whether the reported content violates community guidelines. 
                    Decide if it should be removed or kept. 
                    Always use your own discretion when evaluating. 
                    You don't have to agree with the recommendation by this tool.</p>
                </div>

                <div className="rules-section">
                  <h3>⚠️ Limitations</h3>
                  <p>This tool does not store any submitted posts and has no awareness of the origin of the input. 
                    As a result, it cannot identify nuanced or repetitive submissions.</p>
                </div>

                <div className="rules-section">
                  <h3>📍 Local Coverage</h3>
                  <div className="coverage-info">
                    <h4>Counties:</h4>
                    <div className="county-list">
                      <div className="county-item">
                        <strong>Washington County, OR</strong> - Includes all cities and zip codes within Washington County
                      </div>
                    </div>
                    
                    <h4>Major Cities and Zip Codes:</h4>
                    <div className="zip-grid">
                      <div className="zip-group">
                        <strong>Hillsboro:</strong> 97124
                      </div>
                      <div className="zip-group">
                        <strong>Beaverton:</strong> 97006, 97003, 97078
                      </div>
                      <div className="zip-group">
                        <strong>Cornelius:</strong> 97113
                      </div>
                      <div className="zip-group">
                        <strong>Forest Grove:</strong> 97116
                      </div>
                      <div className="zip-group">
                        <strong>Gaston:</strong> 97119
                      </div>
                      <div className="zip-group">
                        <strong>Newburg:</strong> 97132
                      </div>
                      <div className="zip-group">
                        <strong>Sherwood:</strong> 97140
                      </div>
                      <div className="zip-group">
                        <strong>Portland:</strong> 97086, 97201-97206, 97209-97214, 97215-97220, 97221-97225, 97227, 97229-97233, 97236, 97252, 97253, 97267
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rules-section">
                  <h3>📜 Community Rules</h3>
                  
                  <div className="rule-item">
                    <h4>1. 🤝 Be Respectful</h4>
                    <ul>
                      <li>No hate speech, slurs, or harassment</li>
                      <li>No threats or intimidation</li>
                      <li>No name-calling, personal attacks, or insults</li>
                      <li>Excessive profanity aimed at others is not allowed</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>2. 🎯 Keep It Relevant</h4>
                    <ul>
                      <li>Posts must be relevant to the local community</li>
                      <li>Do not share unrelated national politics or off-topic content</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>3. ❌ Do Not Discriminate</h4>
                    <ul>
                      <li>No content that discriminates or promotes hate based on race, ethnicity, religion, gender, sexual orientation, disability, or age</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>4. ✅ No Misinformation</h4>
                    <ul>
                      <li>Do not share false or misleading information that could harm others</li>
                      <li>Health, safety, or crime claims must be accurate</li>
                      <li>Do not allow misinformation about politics and election topics</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>5. 🔒 Respect Privacy</h4>
                    <ul>
                      <li>Do not share someone's private information without consent (addresses, phone numbers, etc.)</li>
                      <li>No doxxing</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>6. 🚫 No Prohibited Content</h4>
                    <ul>
                      <li>No violence or calls for violence</li>
                      <li>No promotion of criminal acts</li>
                      <li>No adult sexual content or explicit material</li>
                      <li>No spam, scams, or fraudulent schemes</li>
                      <li>No public shaming</li>
                      <li>No selling or promoting illegal goods or services</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>7. 🗣️ Civil Tone</h4>
                    <ul>
                      <li>Use civil language</li>
                      <li>Avoid aggressive or offensive tone</li>
                    </ul>
                  </div>

                  <div className="rule-item">
                    <h4>8. ❌ Incorrect Category</h4>
                    <ul>
                      <li>Items offered for sale or free are considered 'Posted In Error'</li>
                      <li>Should not be in the main feed and should not be allowed</li>
                    </ul>
                  </div>
                </div>

                <div className="rules-section">
                  <h3>⚖️ Moderation Approach</h3>
                  <div className="moderation-guidelines">
                    <p><strong>Our AI uses a balanced, lenient approach:</strong></p>
                    <ul>
                      <li>When in doubt, err on the side of keeping posts</li>
                      <li>Only remove posts that clearly and definitively violate rules</li>
                      <li>Consider context and intent of the post</li>
                      <li>Allow legitimate expression of concerns, even if emotional</li>
                      <li>Be especially lenient with local community content</li>
                      <li>Minor violations are generally kept with warnings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 