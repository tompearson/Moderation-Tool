const fs = require('fs');
const path = require('path');

// Test cases for NextDoor moderation
const testCases = [
  {
    "id": "K1",
    "user_prompt": "I recently replaced the brake pads on my neighbor's car for the first time. I made sure to clean the calipers, check the brake fluid, and test everything thoroughly before handing the car back. I want to share this experience so other beginners can see the importance of double-checking all steps.",
    "expected_decision": "Keep",
    "reason": "Post describes a personal experience related to car repair and shares helpful advice. No community guidelines are violated."
  },
  {
    "id": "K2",
    "user_prompt": "Our local park had a litter cleanup yesterday, and I spent a few hours picking up trash and planting flowers. It was such a rewarding experience, and I encourage neighbors to participate in similar activities. I want to highlight the impact small efforts can have on the community environment.",
    "expected_decision": "Keep",
    "reason": "Post highlights positive neighborhood engagement and encourages helpful activity. No rules are violated."
  },
  {
    "id": "K3",
    "user_prompt": "I baked cookies for our neighborhood block party and labeled them for allergies. I also included a recipe so anyone who wanted to try making them at home could follow along. This was a fun way to share something positive with neighbors.",
    "expected_decision": "Keep",
    "reason": "Post describes safe and positive community activity. No violations found."
  },
  {
    "id": "R1",
    "user_prompt": "I think certain people in our neighborhood should be banned because of their race and nationality. They don't belong here, and we should make sure they know it. I'm tired of seeing them walking around and making this place worse.",
    "expected_decision": "Remove",
    "reason": "Post contains hate speech and discriminatory content based on race and nationality."
  },
  {
    "id": "R2",
    "user_prompt": "If you see [neighbor's name] outside, make sure to report them to the police. They've been caught doing illegal things before, and we should all make sure they get punished.",
    "expected_decision": "Remove",
    "reason": "Post threatens or encourages harassment and potentially doxxing of a neighbor."
  },
  {
    "id": "R3",
    "user_prompt": "I set up a plan to scam someone online using a fake listing in our For Sale section. I think we can get some quick money by tricking people who aren't careful.",
    "expected_decision": "Remove",
    "reason": "Post promotes illegal activity and deceptive practices."
  },
  {
    "id": "B1",
    "user_prompt": "Yesterday I saw someone in our neighborhood arguing loudly in the street. I think they might be frustrated with their family situation. I didn't want to get involved, but I'm concerned about safety and thought I should mention it here.",
    "expected_decision": "Maybe Remove",
    "reason": "Post discusses a potentially sensitive situation without violating rules, but may raise safety concerns."
  },
  {
    "id": "B2",
    "user_prompt": "I posted about a homeless person sleeping near the park entrance. I didn't include any names, but I wanted to make neighbors aware so someone could offer help or resources. I'm worried this could be seen as negative, but my intention was to help.",
    "expected_decision": "Maybe Remove",
    "reason": "Post involves vulnerable populations; intention is helpful but could be interpreted negatively."
  },
  {
    "id": "B3",
    "user_prompt": "I asked about local politics in a post, sharing some opinions about city council decisions. I didn't mention anyone personally or use offensive language, but I know politics can get heated. I want to see what others think without causing conflict.",
    "expected_decision": "Maybe Remove",
    "reason": "Post discusses political topics; content is civil but may provoke debate or conflict."
  },
  {
    "id": "B4",
    "user_prompt": "I found a suspicious package near the mailbox area. I didn't touch it, but I described it in detail so neighbors would be careful. I'm not accusing anyone, just giving a heads-up. Could this be considered alarmist?",
    "expected_decision": "Maybe Remove",
    "reason": "Post alerts neighbors to a potential issue without identifying anyone; could be seen as overly alarming."
  }
];

// Test configuration
const API_ENDPOINT = 'http://127.0.0.1:3001/api/moderate';
const TEST_DELAY = 1000; // 1 second delay between tests to avoid rate limiting

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test results storage
let testResults = [];
let passedTests = 0;
let failedTests = 0;

// Helper function to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to extract decision from AI response
function extractDecision(aiResponse) {
  const response = aiResponse.toLowerCase();
  
  if (response.includes('keep') || response.includes('allow')) {
    return 'Keep';
  } else if (response.includes('remove') || response.includes('delete')) {
    return 'Remove';
  } else if (response.includes('maybe') || response.includes('borderline') || response.includes('uncertain')) {
    return 'Maybe Remove';
  } else {
    return 'Unknown';
  }
}

// Helper function to check if decision matches expected
function decisionMatches(actual, expected) {
  // Normalize decisions for comparison
  const normalize = (decision) => {
    if (decision === 'Maybe Remove' || decision === 'Maybe Remove') return 'Maybe Remove';
    if (decision === 'Keep' || decision === 'Allow') return 'Keep';
    if (decision === 'Remove' || decision === 'Delete') return 'Remove';
    return decision;
  };
  
  return normalize(actual) === normalize(expected);
}

// Function to run a single test case
async function runTest(testCase) {
  console.log(`\n${colors.cyan}${colors.bright}🧪 Running Test ${testCase.id}${colors.reset}`);
  console.log(`${colors.blue}Expected Decision:${colors.reset} ${testCase.expected_decision}`);
  console.log(`${colors.blue}Reason:${colors.reset} ${testCase.reason}`);
  console.log(`${colors.blue}Content:${colors.reset} ${testCase.user_prompt.substring(0, 100)}...`);
  
  try {
    // Make API call to moderation endpoint
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: testCase.user_prompt,
        analysisType: 'detailed' // Use detailed analysis for better decision extraction
      })
    });

    if (!response.ok) {
      // Get the error details from the response
      let errorDetails = '';
      try {
        const errorResponse = await response.json();
        errorDetails = errorResponse.message || errorResponse.error || JSON.stringify(errorResponse);
      } catch (parseError) {
        errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(`HTTP error! status: ${response.status}. Details: ${errorDetails}`);
    }

    const result = await response.json();
    
    // Debug: Log the full response to understand the structure
    console.log(`${colors.magenta}🔍 Full API Response:${colors.reset}`, JSON.stringify(result, null, 2));
    
    // Extract decision from the response - try multiple possible fields
    let aiDecision = 'Unknown';
    let aiResponse = '';
    
    if (result.decision) {
      aiDecision = extractDecision(result.decision);
      aiResponse = result.decision;
    } else if (result.reasoning) {
      aiDecision = extractDecision(result.reasoning);
      aiResponse = result.reasoning;
    } else if (result.result) {
      aiDecision = extractDecision(result.result);
      aiResponse = result.result;
    } else if (result.message) {
      aiDecision = extractDecision(result.message);
      aiResponse = result.message;
    } else {
      // If no clear decision field, try to extract from the entire response
      const fullResponse = JSON.stringify(result);
      aiDecision = extractDecision(fullResponse);
      aiResponse = fullResponse;
    }
    
    const matches = decisionMatches(aiDecision, testCase.expected_decision);
    
    // Store test result
    const testResult = {
      id: testCase.id,
      expected: testCase.expected_decision,
      actual: aiDecision,
      matches: matches,
      aiResponse: aiResponse,
      content: testCase.user_prompt,
      reason: testCase.reason,
      fullApiResponse: result
    };
    
    testResults.push(testResult);
    
    // Display result
    if (matches) {
      console.log(`${colors.green}✅ PASS${colors.reset} - Decision matches expected`);
      passedTests++;
    } else {
      console.log(`${colors.red}❌ FAIL${colors.reset} - Expected: ${testCase.expected_decision}, Got: ${aiDecision}`);
      failedTests++;
    }
    
    console.log(`${colors.blue}AI Decision:${colors.reset} ${aiDecision}`);
    console.log(`${colors.blue}AI Response:${colors.reset} ${aiResponse.substring(0, 200)}...`);
    
  } catch (error) {
    console.error(`${colors.red}❌ ERROR${colors.reset} - Test failed: ${error.message}`);
    failedTests++;
    
    testResults.push({
      id: testCase.id,
      expected: testCase.expected_decision,
      actual: 'ERROR',
      matches: false,
      aiResponse: `Error: ${error.message}`,
      content: testCase.user_prompt,
      reason: testCase.reason
    });
  }
}

// Function to run all tests
async function runAllTests() {
  console.log(`${colors.bright}${colors.cyan}🚀 Starting NextDoor Moderation Prompt Test Suite${colors.reset}`);
  console.log(`${colors.blue}Total Tests:${colors.reset} ${testCases.length}`);
  console.log(`${colors.blue}API Endpoint:${colors.reset} ${API_ENDPOINT}`);
  console.log(`${colors.blue}Test Delay:${colors.reset} ${TEST_DELAY}ms between tests`);
  console.log(`${colors.yellow}Note:${colors.reset} Make sure your backend server is running on port 3001`);
  
  const startTime = Date.now();
  
  // Run tests sequentially with delays
  for (let i = 0; i < testCases.length; i++) {
    await runTest(testCases[i]);
    
    // Add delay between tests (except for the last one)
    if (i < testCases.length - 1) {
      console.log(`${colors.yellow}⏳ Waiting ${TEST_DELAY}ms before next test...${colors.reset}`);
      await delay(TEST_DELAY);
    }
  }
  
  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000;
  
  // Display final results
  console.log(`\n${colors.bright}${colors.cyan}📊 Test Results Summary${colors.reset}`);
  console.log(`${colors.blue}Total Tests:${colors.reset} ${testCases.length}`);
  console.log(`${colors.green}Passed:${colors.reset} ${passedTests}`);
  console.log(`${colors.red}Failed:${colors.reset} ${failedTests}`);
  console.log(`${colors.blue}Success Rate:${colors.reset} ${((passedTests / testCases.length) * 100).toFixed(1)}%`);
  console.log(`${colors.blue}Total Time:${colors.reset} ${totalTime.toFixed(1)} seconds`);
  
  // Save detailed results to file
  const resultsFile = `nextdoor-test-results-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  console.log(`\n${colors.blue}Detailed results saved to:${colors.reset} ${resultsFile}`);
  
  // Display failed tests if any
  if (failedTests > 0) {
    console.log(`\n${colors.red}${colors.bright}❌ Failed Tests:${colors.reset}`);
    testResults.filter(r => !r.matches).forEach(result => {
      console.log(`\n${colors.red}Test ${result.id}:${colors.reset}`);
      console.log(`  Expected: ${result.expected}`);
      console.log(`  Got: ${result.actual}`);
      console.log(`  Content: ${result.content.substring(0, 80)}...`);
      console.log(`  AI Response: ${result.aiResponse.substring(0, 100)}...`);
    });
  }
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if backend is accessible before starting tests
async function checkBackend() {
  try {
    const response = await fetch('http://127.0.0.1:3001/api/health');
    if (response.ok) {
      console.log(`${colors.green}✅ Backend server is accessible${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}❌ Backend server returned status: ${response.status}${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Backend server is not accessible: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Please make sure your backend server is running on port 3001${colors.reset}`);
    return false;
  }
}

// Test the moderation endpoint with a simple request
async function testModerationEndpoint() {
  console.log(`${colors.cyan}🔍 Testing moderation endpoint...${colors.reset}`);
  
  try {
    const testRequest = {
      content: "This is a test post to verify the API is working.",
      analysisType: "quick"
    };
    
    console.log(`${colors.blue}Test request:${colors.reset}`, JSON.stringify(testRequest, null, 2));
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    });
    
    console.log(`${colors.blue}Response status:${colors.reset} ${response.status}`);
    console.log(`${colors.blue}Response headers:${colors.reset}`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log(`${colors.green}✅ Moderation endpoint test successful${colors.reset}`);
      console.log(`${colors.blue}Response:${colors.reset}`, JSON.stringify(result, null, 2));
      return true;
    } else {
      const errorResponse = await response.json();
      console.log(`${colors.red}❌ Moderation endpoint test failed${colors.reset}`);
      console.log(`${colors.red}Error:${colors.reset}`, JSON.stringify(errorResponse, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Moderation endpoint test error:${colors.reset} ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log(`${colors.bright}${colors.cyan}🔍 NextDoor Moderation Prompt Test Suite${colors.reset}`);
  console.log(`${colors.blue}Version:${colors.reset} 1.0.0`);
  console.log(`${colors.blue}Date:${colors.reset} ${new Date().toLocaleDateString()}`);
  
  // Check backend accessibility
  const backendOk = await checkBackend();
  if (!backendOk) {
    console.log(`\n${colors.red}Cannot proceed with tests. Please start your backend server first.${colors.reset}`);
    console.log(`${colors.yellow}Run: npm run dev:backend${colors.reset}`);
    process.exit(1);
  }
  
  // Test the moderation endpoint
  await testModerationEndpoint();

  // Run the test suite
  await runAllTests();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}⚠️  Tests interrupted by user${colors.reset}`);
  process.exit(1);
});

// Start the test suite
main().catch(error => {
  console.error(`${colors.red}❌ Test suite failed:${colors.reset}`, error);
  process.exit(1);
});
