import React, { useState } from 'react';
import './index.css';

// API endpoint configuration
const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? '/api/moderate'
  : 'http://127.0.0.1:3001/api/moderate';

function App() {
  // Debug version loading
  console.log('🔍 Version Debug:', {
    windowAPP_VERSION: window.APP_VERSION,
    full: window.APP_VERSION?.full,
    fallback: '0.7.0-alpha',
    finalVersion: window.APP_VERSION?.full || '0.7.0-alpha'
  });

  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [characterLimit, setCharacterLimit] = useState(300); // Default to 300 chars
  
  // New state for dynamic guidelines
  const [guidelinesContent, setGuidelinesContent] = useState(null);
  const [guidelinesLoading, setGuidelinesLoading] = useState(false);
  const [guidelinesError, setGuidelinesError] = useState(null);

  // Function to get emoji for rule number
  const getRuleEmoji = (number) => {
    const emojis = {
      '1': '🤝',
      '2': '🎯', 
      '3': '❌',
      '4': '✅',
      '5': '🔒',
      '6': '🚫',
      '7': '🗣️',
      '8': '📦'
    };
    return emojis[number] || '📋';
  };

  // Function to load HTML guidelines for display
  const loadGuidelines = async () => {
    try {
      setGuidelinesLoading(true);
      setGuidelinesError(null);
      
      // Load the display version (beautiful formatting)
      const response = await fetch('/docs/Nextdoor/nextdoor-moderation-guidelines.html');
      
      if (!response.ok) {
        throw new Error(`Failed to load guidelines: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      
      // Set the HTML content directly for display
      setGuidelinesContent(htmlContent);
      console.log('✅ Guidelines loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load guidelines:', error);
      setGuidelinesError(error.message);
      // Guidelines loading error will be handled in the UI
    } finally {
      setGuidelinesLoading(false);
    }
  };



  const moderatePost = async (content, charLimit = 300, analysisType = 'quick') => {
    try {
      const requestBody = { 
        content, 
        characterLimit: charLimit,
        analysisType: analysisType
      };
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Create an error object that preserves the HTTP status and detailed message
        const error = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.errorType = errorData.error;
        error.retryAfter = errorData.retryAfter;
        
        throw error;
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
    await handleSubmitWithLimit(characterLimit, 'quick'); // Default to quick analysis
  };

  const handleSubmitWithLimit = async (limit, analysisType = 'quick') => {
    if (!postContent.trim()) {
      setError('Please enter a post to moderate.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const result = await moderatePost(postContent, limit, analysisType);
      setResult(result);
      setError(''); // Clear any previous error
    } catch (err) {
      console.error('Moderation error:', err);
      
      // Check for specific error types
      if (err.status === 429 || err.errorType === 'Rate limit exceeded') {
        setError('🚫 Rate limit exceeded! The service is currently receiving too many requests. Please wait a minute and try again.');
      } else if (err.message.includes('quota_limit_value') && err.message.includes('"0"')) {
        setError('🚨 Service configuration issue: No requests allowed. This is a server-side quota problem that needs to be resolved by the administrator.');
      } else if (err.message.includes('API_KEY_INVALID') || err.message.includes('Invalid API key')) {
        setError('Invalid API key. Please check the configuration.');
      } else if (err.message.includes('QUOTA_EXCEEDED') || err.message.includes('quota exceeded')) {
        setError('API quota exceeded. Please check your Google AI usage limits.');
      } else if (err.message.includes('Rate limit exceeded') || err.message.includes('429') || err.message.includes('Too Many Requests')) {
        setError('🚫 Rate limit exceeded! The service is currently receiving too many requests. Please wait a minute and try again.');
      } else if (err.message.includes('Service temporarily overloaded') || err.message.includes('overloaded')) {
        setError('⚠️ Service temporarily overloaded. Please wait a few minutes and try again.');
      } else if (err.message.includes('SAFETY')) {
        setError('Content was blocked by safety filters. Please try with different content.');
      } else if (err.message.includes('PERMISSION_DENIED')) {
        setError('API key does not have access to this model. Please check your API permissions.');
      } else if (err.message.includes('503') || err.status === 503) {
        setError('All models are currently overloaded or unavailable. Please try again in a few minutes.');
      } else if (err.message.includes('models/') && err.message.includes('not found')) {
        setError('No available models found. Please check your API access.');
      } else {
        setError(`Error: ${err.message}`);
      }
    }

    setIsLoading(false);
  };

  // Handle guidelines button click
  const handleShowGuidelines = async () => {
    setShowRules(true);
    // Load guidelines when modal opens
    if (!guidelinesContent && !guidelinesLoading) {
      await loadGuidelines();
    }
  };

  // Handle guidelines refresh button click
  const handleRefreshGuidelines = async () => {
    try {
      // Clear current content and show loading
      setGuidelinesContent(null);
      setGuidelinesError(null);
      setGuidelinesLoading(true);
      
      // Force reload external guidelines file
      await loadGuidelines();
      
      // Show success feedback briefly
      setTimeout(() => {
        setGuidelinesLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Failed to refresh guidelines:', error);
      setGuidelinesLoading(false);
      // Show error but don't fall back to embedded content
      setGuidelinesError(error.message);
    }
  };

  // Handle save AI prompt to debug file
  const handleSaveAIPrompt = async () => {
    try {
      // Determine which analysis type to use based on current character limit
      const analysisType = characterLimit <= 300 ? 'quick' : 'detailed';
      
      const response = await fetch('/api/save-ai-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisType })
      });

      if (!response.ok) {
        throw new Error(`Failed to save prompt: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Show success message
        setError(''); // Clear any previous errors
        alert(`✅ AI Prompt saved successfully!\n\n📁 Files created:\n• ${result.files.timestamped}\n• ${result.files.latest}\n\n📊 Prompt Info:\n• Analysis Type: ${result.promptInfo.analysisType}\n• Total Length: ${result.promptInfo.totalLength} characters\n• Max Tokens: ${result.promptInfo.maxTokens}`);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
      
    } catch (error) {
      console.error('Failed to save AI prompt:', error);
      setError(`Failed to save AI prompt: ${error.message}`);
    }
  };

  // Helper function to convert decision to CSS-safe class name
  const getDecisionClass = (decision) => {
    if (!decision) return '';
    return decision.toLowerCase().replace(/\s+/g, '-');
  };

  // Handle download AI prompt to user's computer
  const handleDownloadAIPrompt = async () => {
    try {
      // Determine which analysis type to use based on current character limit
      const analysisType = characterLimit <= 300 ? 'quick' : 'detailed';
      
      // Call the debug endpoint to get the prompt content
      const response = await fetch(`/api/debug-ai-prompts?analysisType=${analysisType}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get prompt: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Create timestamp for filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `ai-prompt-${analysisType}-${timestamp}.txt`;
        
        // Create blob and download
        const blob = new Blob([result.promptStructure.combinedPrompt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show success message
        setError(''); // Clear any previous errors
        alert(`✅ AI Prompt downloaded successfully!\n\n📁 File: ${filename}\n📊 Analysis Type: ${analysisType}\n📏 Total Length: ${result.promptStructure.totalLength} characters`);
        
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
      
    } catch (error) {
      console.error('Failed to download AI prompt:', error);
      setError(`Failed to download AI prompt: ${error.message}`);
    }
  };

  return (
    <div className="container">
              <div className="header">
          <h1>Community Moderation Assistant</h1>
          <p>AI-powered Post Moderation Using Community Guidelines</p>
          <div className="version">v{window.APP_VERSION?.full || '0.7.0-alpha'}</div>
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
                 handleSubmitWithLimit(300, 'quick');
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
                 handleSubmitWithLimit(2000, 'detailed');
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
              onClick={handleShowGuidelines}
              disabled={isLoading}
            >
              📋 Show Guidelines
            </button>
            
            <button 
              type="button" 
              className="button debug-button"
              onClick={handleSaveAIPrompt}
              disabled={isLoading}
              title="Save current AI prompt to debug file"
            >
              💾 Save AI Prompt
            </button>
            
            <button 
              type="button" 
              className="button download-button"
              onClick={handleDownloadAIPrompt}
              disabled={isLoading}
              title="Download AI prompt to your computer"
            >
              📥 Download AI Prompt
            </button>
          </div>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {result && (
          <div className={`result ${getDecisionClass(result.decision)}`}>
            <div className="result-info">
              <div className="character-info">
                <small>Response: {result.characterCount || 0} / {result.characterLimit || characterLimit} characters • AI Model: {result.model}</small>
              </div>
            </div>
            <h3>Moderation Result</h3>
            <div className={`decision ${getDecisionClass(result.decision)}`}>
              Decision: {result.decision}
            </div>
            

            
            <div className="reason">
              {result.reason}
            </div>
            
            {/* Rules Applied Section */}
            {result.rules && result.rules.length > 0 && (
              <div className="rules-used">
                <h4>Rules Applied:</h4>
                <div className="rules-grid">
                  {result.rules.map((rule, index) => (
                    <div key={index} className={`rule-badge ${getDecisionClass(result.decision)}`}>
                      <span className="rule-emoji">{rule.emoji}</span>
                      <span className="rule-title">{rule.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Rule Source Information */}
            {result.ruleSource && (
              <div className="rule-source">
                <h4>Rule Source:</h4>
                <div className={`source-badge ${result.ruleSource}`}>
                  <span className="source-icon">
                    {result.ruleSource === 'url' ? '🌐' : 
                     result.ruleSource === 'embedded' ? '📋' : 
 
                     result.ruleSource.startsWith('ai-') ? '🤖' : '❓'}
                  </span>
                  <span className="source-text">
                    {result.ruleSource === 'url' ? 'External Guidelines' :
                     result.ruleSource === 'embedded' ? 'Embedded Rules' :
 
                     result.ruleSource.startsWith('ai-') ? `AI ${result.ruleSource.split('-')[1].charAt(0).toUpperCase() + result.ruleSource.split('-')[1].slice(1)} Analysis` : 
                     'Unknown Source'}
                  </span>
                </div>
              </div>
            )}
            
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
              Copy Moderation Result
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
              <div className="modal-actions">
                <button 
                  className="refresh-button"
                  onClick={handleRefreshGuidelines}
                  disabled={guidelinesLoading}
                  title="Reload guidelines file from server"
                >
                  {guidelinesLoading ? (
                    <>
                      <span className="spinning">🔄</span>
                      Reloading...
                    </>
                  ) : (
                    <>
                      🔄
                      Reload File
                    </>
                  )}
                </button>
                <button 
                  className="modal-close"
                  onClick={() => setShowRules(false)}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              {guidelinesLoading ? (
                <div className="loading-guidelines">
                  <div className="spinner"></div>
                  <p>Loading guidelines...</p>
                </div>
              ) : guidelinesError ? (
                <div className="guidelines-error">
                  <p>⚠️ Failed to load guidelines: {guidelinesError}</p>
                  <p>Please check your configuration or try refreshing.</p>
                </div>
              ) : guidelinesContent ? (
                <div className="rules-content">
                  <div className="guidelines-text">
                    <div 
                      dangerouslySetInnerHTML={{ __html: guidelinesContent }}
                      style={{ 
                        maxHeight: '70vh', 
                        overflowY: 'auto',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="guidelines-error">
                  <p>No guidelines available.</p>
                  <p>Please check your configuration.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 