# Community Moderation Tool - Guidelines System Test Report

> **Generated:** 8/24/2025, 1:44:44 PM  
> **Total Tests:** 38  
> **Success Rate:** 73.7%

## 📊 Executive Summary

| Metric | Count | Status |
|--------|-------|---------|
| **Total Tests** | 38 | 🔍 |
| **✅ Passed** | 28 | 🟢 |
| **⚠️ Warnings** | 3 | 🟡 |
| **❌ Failed** | 7 | 🔴 |
| **Success Rate** | 73.7% | 🟡 |

## 🎯 Test Results by Category

### ✅ AI Configuration Tests
- ✅ **AI Config File**: AI configuration file loaded successfully
- ✅ **Prompt Configuration**: 1 prompts configured
- ✅ **Prompt File: nextdoor-research**: File exists at staging/NextDoor/research/token-optimized-nextdoor-community-moderation-instructions.json
- ⚠️ **API Key: GOOGLE_GENERATIVE_AI_API_KEY**: Not set
- ✅ **Quick Analysis Prompt**: Built successfully (5681 characters)
- ✅ **Detailed Analysis Prompt**: Built successfully (5681 characters)

### 🔧 Environment & System Tests
- ✅ **AI Config File**: AI configuration file loaded successfully
- ✅ **Prompt File: nextdoor-research**: File exists at staging/NextDoor/research/token-optimized-nextdoor-community-moderation-instructions.json
- ⚠️ **API Key: GOOGLE_GENERATIVE_AI_API_KEY**: Not set
- ✅ **API Key: GEMINI_API_KEY**: Found (39 characters)
- ⚠️ **API Key: GOOGLE_API_KEY**: Not set
- ✅ **API Key Status**: At least one API key is available
- ✅ **Directory: protected/prompts**: Directory exists
- ✅ **Directory: protected/prompts/staging**: Directory exists
- ✅ **Directory: protected/prompts/staging/NextDoor**: Directory exists
- ✅ **Directory: protected/prompts/staging/NextDoor/json**: Directory exists
- ✅ **Directory: api**: Directory exists
- ✅ **Directory: api/utils**: Directory exists
- ✅ **Directory: public**: Directory exists
- ✅ **File: protected/prompts/ai.json**: File exists
- ✅ **File: api/utils/guidelines.js**: File exists
- ✅ **File: api/utils/ai.js**: File exists
- ✅ **File: package.json**: File exists

### 📋 Guidelines & Cache Tests
- ✅ **Cache Status**: Cache initialized: {
  "hasCache": false,
  "source": null,
  "age": null,
  "config": {
    "url": "https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md",
    "cacheTimeout": 3600000,
    "timeout": 10000
  }
}
- ✅ **Guidelines Loading**: Guidelines loaded (957 characters)
- ✅ **Display Guidelines**: Display guidelines available (4738 characters)

## 🚨 Critical Issues

### ❌ Test Case R1
**Issue:** Expected: Remove, Got: Keep - Post contains hate speech and discriminatory content based on race and nationality.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

### ❌ Test Case R2
**Issue:** Expected: Remove, Got: Keep - Post threatens or encourages harassment and potentially doxxing of a neighbor.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

### ❌ Test Case R3
**Issue:** Expected: Remove, Got: Keep - Post promotes illegal activity and deceptive practices.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

### ❌ Test Case B1
**Issue:** Expected: Maybe Remove, Got: Keep - Post discusses a potentially sensitive situation without violating rules, but may raise safety concerns.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

### ❌ Test Case B2
**Issue:** Expected: Maybe Remove, Got: Keep - Post involves vulnerable populations; intention is helpful but could be interpreted negatively.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

### ❌ Test Case B3
**Issue:** Expected: Maybe Remove, Got: Keep - Post discusses political topics; content is civil but may provoke debate or conflict.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

### ❌ Test Case B4
**Issue:** Expected: Maybe Remove, Got: Keep - Post alerts neighbors to a potential issue without identifying anyone; could be seen as overly alarming.

**Impact:** This prevents the system from functioning properly.

**Recommendation:** Address this issue immediately.

## ⚠️ Warnings & Recommendations

### ⚠️ API Key: GOOGLE_GENERATIVE_AI_API_KEY
**Warning:** Not set

**Impact:** System will work but may not be optimal.

**Recommendation:** Consider addressing this for better performance.

### ⚠️ API Key: GOOGLE_API_KEY
**Warning:** Not set

**Impact:** System will work but may not be optimal.

**Recommendation:** Consider addressing this for better performance.

### ⚠️ Moderation Test Cases Failures
**Warning:** 7 test cases failed - review AI decision accuracy

**Impact:** System will work but may not be optimal.

**Recommendation:** Consider addressing this for better performance.

## 🔍 Detailed Test Results

| Test | Status | Message | Timestamp |
|------|--------|---------|-----------|
| AI Config File | ✅ PASS | AI configuration file loaded successfully | 2025-08-24T20:44:42.988Z |
| Prompt Configuration | ✅ PASS | 1 prompts configured | 2025-08-24T20:44:42.989Z |
| Prompt File: nextdoor-research | ✅ PASS | File exists at staging/NextDoor/research/token-optimized-nextdoor-community-moderation-instructions.json | 2025-08-24T20:44:42.989Z |
| Analysis Types | ✅ PASS | 2 analysis types configured: quick, detailed | 2025-08-24T20:44:42.990Z |
| API Key: GOOGLE_GENERATIVE_AI_API_KEY | ⚠️ WARN | Not set | 2025-08-24T20:44:42.990Z |
| API Key: GEMINI_API_KEY | ✅ PASS | Found (39 characters) | 2025-08-24T20:44:42.990Z |
| API Key: GOOGLE_API_KEY | ⚠️ WARN | Not set | 2025-08-24T20:44:42.991Z |
| API Key Status | ✅ PASS | At least one API key is available | 2025-08-24T20:44:42.991Z |
| NODE_ENV | ✅ PASS | Set to: development | 2025-08-24T20:44:42.991Z |
| GUIDELINES_URL | ✅ PASS | Set to: https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md | 2025-08-24T20:44:42.991Z |
| Directory: protected/prompts | ✅ PASS | Directory exists | 2025-08-24T20:44:42.992Z |
| Directory: protected/prompts/staging | ✅ PASS | Directory exists | 2025-08-24T20:44:42.992Z |
| Directory: protected/prompts/staging/NextDoor | ✅ PASS | Directory exists | 2025-08-24T20:44:42.992Z |
| Directory: protected/prompts/staging/NextDoor/json | ✅ PASS | Directory exists | 2025-08-24T20:44:42.992Z |
| Directory: api | ✅ PASS | Directory exists | 2025-08-24T20:44:42.993Z |
| Directory: api/utils | ✅ PASS | Directory exists | 2025-08-24T20:44:42.993Z |
| Directory: public | ✅ PASS | Directory exists | 2025-08-24T20:44:42.994Z |
| File: protected/prompts/ai.json | ✅ PASS | File exists | 2025-08-24T20:44:42.994Z |
| File: api/utils/guidelines.js | ✅ PASS | File exists | 2025-08-24T20:44:42.994Z |
| File: api/utils/ai.js | ✅ PASS | File exists | 2025-08-24T20:44:42.995Z |
| File: package.json | ✅ PASS | File exists | 2025-08-24T20:44:42.995Z |
| Cache Status | ✅ PASS | Cache initialized: {
  "hasCache": false,
  "source": null,
  "age": null,
  "config": {
    "url": "https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md",
    "cacheTimeout": 3600000,
    "timeout": 10000
  }
} | 2025-08-24T20:44:42.996Z |
| Guidelines Loading | ✅ PASS | Guidelines loaded (957 characters) | 2025-08-24T20:44:42.997Z |
| Display Guidelines | ✅ PASS | Display guidelines available (4738 characters) | 2025-08-24T20:44:43.225Z |
| Quick Analysis Prompt | ✅ PASS | Built successfully (5681 characters) | 2025-08-24T20:44:43.236Z |
| Detailed Analysis Prompt | ✅ PASS | Built successfully (5681 characters) | 2025-08-24T20:44:43.240Z |
| Test Case K1 | ✅ PASS | Expected: Keep, Got: Keep - Post describes a personal experience related to car repair and shares helpful advice. No community guidelines are violated. | 2025-08-24T20:44:43.241Z |
| Test Case K2 | ✅ PASS | Expected: Keep, Got: Keep - Post highlights positive neighborhood engagement and encourages helpful activity. No rules are violated. | 2025-08-24T20:44:43.349Z |
| Test Case K3 | ✅ PASS | Expected: Keep, Got: Keep - Post describes safe and positive community activity. No violations found. | 2025-08-24T20:44:43.451Z |
| Test Case R1 | ❌ FAIL | Expected: Remove, Got: Keep - Post contains hate speech and discriminatory content based on race and nationality. | 2025-08-24T20:44:43.563Z |
| Test Case R2 | ❌ FAIL | Expected: Remove, Got: Keep - Post threatens or encourages harassment and potentially doxxing of a neighbor. | 2025-08-24T20:44:43.668Z |
| Test Case R3 | ❌ FAIL | Expected: Remove, Got: Keep - Post promotes illegal activity and deceptive practices. | 2025-08-24T20:44:43.783Z |
| Test Case B1 | ❌ FAIL | Expected: Maybe Remove, Got: Keep - Post discusses a potentially sensitive situation without violating rules, but may raise safety concerns. | 2025-08-24T20:44:43.884Z |
| Test Case B2 | ❌ FAIL | Expected: Maybe Remove, Got: Keep - Post involves vulnerable populations; intention is helpful but could be interpreted negatively. | 2025-08-24T20:44:43.999Z |
| Test Case B3 | ❌ FAIL | Expected: Maybe Remove, Got: Keep - Post discusses political topics; content is civil but may provoke debate or conflict. | 2025-08-24T20:44:44.101Z |
| Test Case B4 | ❌ FAIL | Expected: Maybe Remove, Got: Keep - Post alerts neighbors to a potential issue without identifying anyone; could be seen as overly alarming. | 2025-08-24T20:44:44.203Z |
| Moderation Test Cases Summary | ✅ PASS | 3/10 test cases passed (30.0% success rate) | 2025-08-24T20:44:44.310Z |
| Moderation Test Cases Failures | ⚠️ WARN | 7 test cases failed - review AI decision accuracy | 2025-08-24T20:44:44.310Z |

## 📈 Performance Analysis

- **Overall Health:** 🟡 Good
- **Critical Systems:** 🔴 Some Critical Systems Have Issues
- **File System:** 🟢 File System Healthy

## 🛠️ Next Steps

1. **Immediate Action Required:** Fix the 7 failed test(s) listed above
2. **System Impact:** These failures prevent proper system operation
3. **Priority:** High - Address before production use
4. **Optional Improvements:** Address 3 warning(s) for better performance
5. **Impact:** Warnings don't prevent operation but may affect performance

## 📄 Report Files

This report is available in multiple formats:
- **Markdown:** `guidelines-test-report-2025-08-24T20-44-44.md`
- **JSON:** `guidelines-test-report-2025-08-24T20-44-44.json`
- **Console:** The colored output above

---

*Report generated by Community Moderation Tool Guidelines Test Suite*  
*Last updated: 8/24/2025, 1:44:44 PM*

---

## Last Updated
- **Date**: 08-28-2025
- **Version**: v0.8.50-alpha
- **Status**: Documentation updated for version 0.8.50-alpha
- **Next Action**: Ready for production deployment