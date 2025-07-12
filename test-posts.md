# Test Posts for Nextdoor Moderation Tool

This file contains various test posts to verify the moderation tool's accuracy in identifying violations of Nextdoor Community Guidelines.

## Test Categories

### 1. Posts That Should Be REMOVED

#### 1.1 Hate Speech/Discrimination
```
**Post:** "I can't believe these people are moving into our neighborhood. We need to keep our community pure and protect our values. These outsiders don't belong here and will ruin everything we've built."
**Expected:** Remove - Rule 3 (Discrimination)
```

#### 1.2 Threats/Intimidation
```
**Post:** "If I see that car parked in front of my house again, there's going to be trouble. I'm not kidding around - move it or face the consequences."
**Expected:** Remove - Rule 1 (Threats/Intimidation)
```

#### 1.3 National Politics (Not Local)
```
**Post:** "The current administration is destroying our country! We need to vote them out in the next election. This is the most corrupt government we've ever had!"
**Expected:** Remove - Rule 2 (Keep It Relevant - national politics)
```

#### 1.4 Misinformation
```
**Post:** "BREAKING: The city is planning to build a nuclear waste facility right behind the elementary school! I heard this from a reliable source. Parents need to act now before it's too late!"
**Expected:** Remove - Rule 4 (Misinformation - unsubstantiated claims)
```

#### 1.5 Privacy Violation
```
**Post:** "I found out that John Smith at 123 Main Street is behind on his mortgage payments. His phone number is 555-1234. Everyone should know about this deadbeat neighbor."
**Expected:** Remove - Rule 5 (Privacy - sharing personal information)
```

#### 1.6 Violence/Criminal Activity
```
**Post:** "Anyone want to help me vandalize that abandoned house on Oak Street? It's been an eyesore for months and the city won't do anything about it."
**Expected:** Remove - Rule 6 (Prohibited Content - promoting criminal acts)
```

#### 1.7 Uncivil Tone
```
**Post:** "You people are all idiots! How can you not see what's happening right in front of your faces? Wake up and stop being so stupid about this issue!"
**Expected:** Remove - Rule 7 (Civil Tone - aggressive and insulting)
```

### 2. Posts That Should Be KEPT

#### 2.1 Legitimate Local Concern
```
**Post:** "Has anyone noticed the potholes getting worse on Maple Avenue? I hit one yesterday that almost damaged my car. Should we contact the city about this?"
**Expected:** Keep - Relevant local community issue
```

#### 2.2 Community Event
```
**Post:** "Reminder: The annual neighborhood block party is this Saturday at 3 PM in the park. Please bring a dish to share. Looking forward to seeing everyone!"
**Expected:** Keep - Local community event
```

#### 2.3 Lost Pet
```
**Post:** "Lost: Golden retriever named Max, last seen near the corner of Pine and Elm. He's wearing a red collar. Please call if you see him. Thank you!"
**Expected:** Keep - Local community concern
```

#### 2.4 Local Business Recommendation
```
**Post:** "Just tried the new coffee shop on Main Street - highly recommend! Great service and the pastries are amazing. Perfect addition to our neighborhood."
**Expected:** Keep - Local business recommendation
```

#### 2.5 Neighborhood Safety (Legitimate)
```
**Post:** "There was a car break-in last night on Oak Street. Police were called and took a report. Just a reminder to lock your cars and keep valuables out of sight."
**Expected:** Keep - Legitimate local safety concern
```

### 3. Borderline Cases (Test AI Judgment)

#### 3.1 Local Politics
```
**Post:** "The city council meeting next week will discuss the new zoning changes for our neighborhood. This could affect property values. Everyone should attend to voice their concerns."
**Expected:** Keep - Local government affecting community
```

#### 3.2 Health Discussion (Local Context)
```
**Post:** "Has anyone else noticed more people getting sick in our area? My kids have been sick for weeks. Wondering if there's something going around the schools."
**Expected:** Keep - Local health concern
```

#### 3.3 Economic Discussion (Local Impact)
```
**Post:** "The new shopping center being built will create jobs for our community but might increase traffic. What do you think about this development?"
**Expected:** Keep - Local economic impact
```

### 4. Complex Cases (Multiple Issues)

#### 4.1 Mixed Content
```
**Post:** "Great community event at the park today! (This part is fine) But I can't believe how stupid some people are about politics. The current administration is ruining everything! (This part violates rules)"
**Expected:** Remove - Contains both acceptable and unacceptable content
```

#### 4.2 Emotional but Not Violating
```
**Post:** "I'm so frustrated with the city's slow response to fixing our street lights. It's been months and our neighborhood is getting dangerous at night. This is ridiculous!"
**Expected:** Keep - Frustration expressed but not threatening or uncivil
```

## Usage Instructions

1. **Copy a post** from the appropriate category
2. **Paste it** into the moderation tool
3. **Compare the AI decision** with the expected result
4. **Note any discrepancies** for further analysis

## Testing Checklist

- [ ] Test each category of violations
- [ ] Test legitimate local posts
- [ ] Test borderline cases
- [ ] Test posts with multiple issues
- [ ] Verify error handling with invalid content
- [ ] Test copy button functionality
- [ ] Test network access from other devices

## Notes

- **Expected results** are based on Nextdoor Community Guidelines
- **AI may interpret** some cases differently than expected
- **Borderline cases** help test AI judgment capabilities
- **Complex cases** test AI's ability to identify multiple issues
- **Update this file** with new test cases as needed 