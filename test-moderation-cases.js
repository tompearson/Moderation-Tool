// Comprehensive Moderation Test Cases
// Test cases for Community Moderation Tool
// Categories: Keep (K), Remove (R), Maybe Remove (B)

const moderationTestCases = [
  // KEEP CASES - Posts that should remain
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
    "id": "K4",
    "user_prompt": "I organized a small book swap in my neighborhood. Everyone contributed books they had already read, and we left notes recommending their favorites. It was a quiet, respectful event that promoted reading and sharing.",
    "expected_decision": "Keep",
    "reason": "Post shares a positive, community-oriented activity. No harmful content is present."
  },
  {
    "id": "K5",
    "user_prompt": "I volunteered at the local animal shelter this weekend. We walked dogs, cleaned kennels, and helped feed the animals. It was rewarding to see the difference a few hours can make, and I wanted to share my experience so others might volunteer too.",
    "expected_decision": "Keep",
    "reason": "Post encourages positive volunteer activity and community engagement. No guidelines are violated."
  },
  {
    "id": "K6",
    "user_prompt": "I hosted a neighborhood movie night in my backyard with a projector and blankets. Everyone brought snacks and enjoyed the evening together. I wanted to highlight the importance of simple ways to build community connections.",
    "expected_decision": "Keep",
    "reason": "Post shares safe, positive community activity. No violations are present."
  },
  {
    "id": "K7",
    "user_prompt": "I organized a local clothing drive for families in need. Many neighbors donated items, and we distributed them safely with proper labeling. Sharing this event encourages others to help and build goodwill in the community.",
    "expected_decision": "Keep",
    "reason": "Post promotes positive community engagement. No harmful content is present."
  },
  {
    "id": "K8",
    "user_prompt": "I held a small workshop on home gardening, sharing tips for planting and composting. Neighbors attended and everyone had a good time learning new skills together.",
    "expected_decision": "Keep",
    "reason": "Post encourages educational and positive activity. No rules are violated."
  },
  {
    "id": "K9",
    "user_prompt": "I shared a recipe for homemade dog treats and included tips on safe ingredients for pets. Several neighbors thanked me for the detailed instructions and said they tried it at home.",
    "expected_decision": "Keep",
    "reason": "Post shares safe, helpful, and positive content for community members. No violations."
  },
  {
    "id": "K10",
    "user_prompt": "I helped a neighbor move furniture safely this weekend. I posted about the experience to show how communities can come together to support each other in everyday tasks.",
    "expected_decision": "Keep",
    "reason": "Post highlights positive community cooperation. No harmful content is present."
  },

  // REMOVE CASES - Posts that should be removed
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
    "id": "R4",
    "user_prompt": "I filmed someone in our neighborhood and uploaded it online to make fun of them for walking slowly with a cane. I thought it would be funny, but it was really humiliating for them.",
    "expected_decision": "Remove",
    "reason": "Post constitutes harassment and shaming of an individual."
  },
  {
    "id": "R5",
    "user_prompt": "I want to post that a certain family is responsible for all the problems on our street. They're lazy, dangerous, and should leave immediately.",
    "expected_decision": "Remove",
    "reason": "Post contains harassment and targeted personal attacks."
  },
  {
    "id": "R6",
    "user_prompt": "Here's a step-by-step plan to steal packages from porches in our neighborhood. Follow this method and you'll get away with it.",
    "expected_decision": "Remove",
    "reason": "Post promotes criminal activity and illegal behavior."
  },
  {
    "id": "R7",
    "user_prompt": "I am sharing tips on how to evade traffic laws in our neighborhood so drivers can speed without getting caught.",
    "expected_decision": "Remove",
    "reason": "Post encourages illegal behavior and unsafe activity."
  },
  {
    "id": "R8",
    "user_prompt": "I want to post private medical information about a neighbor online to warn others.",
    "expected_decision": "Remove",
    "reason": "Post shares private information (doxxing/violation of privacy)."
  },

  // MAYBE REMOVE CASES - Posts that may need review
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
  },
  {
    "id": "B5",
    "user_prompt": "I saw a car parked suspiciously near the school and took a photo. I posted it in the neighborhood feed to see if anyone noticed anything. I did not accuse anyone, but I wonder if this might be too cautious or alarming.",
    "expected_decision": "Maybe Remove",
    "reason": "Post shares a safety concern without making accusations, but may be interpreted as alarmist."
  },
  {
    "id": "B6",
    "user_prompt": "I shared a story about a neighbor who helped me fix a fence. I didn't name them, but I wanted to show appreciation. Could this be considered private information or oversharing?",
    "expected_decision": "Maybe Remove",
    "reason": "Post shares positive experience but may contain minor privacy concerns."
  }
];

// Test case statistics
const testStats = {
  total: moderationTestCases.length,
  keep: moderationTestCases.filter(tc => tc.expected_decision === "Keep").length,
  remove: moderationTestCases.filter(tc => tc.expected_decision === "Remove").length,
  maybeRemove: moderationTestCases.filter(tc => tc.expected_decision === "Maybe Remove").length
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    moderationTestCases,
    testStats
  };
}

// Display summary if run directly
if (typeof window === 'undefined') {
  console.log('📊 Moderation Test Cases Summary:');
  console.log(`Total Test Cases: ${testStats.total}`);
  console.log(`Keep: ${testStats.keep}`);
  console.log(`Remove: ${testStats.remove}`);
  console.log(`Maybe Remove: ${testStats.maybeRemove}`);
  console.log('\n✅ Test cases loaded successfully!');
}
