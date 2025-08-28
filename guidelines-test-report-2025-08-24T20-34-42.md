# Community Moderation Tool - Guidelines System Test Report

> **Generated:** 8/24/2025, 1:34:42 PM  
> **Total Tests:** 26  
> **Success Rate:** 92.3%

## 📊 Executive Summary

| Metric | Count | Status |
|--------|-------|---------|
| **Total Tests** | 26 | 🔍 |
| **✅ Passed** | 24 | 🟢 |
| **⚠️ Warnings** | 2 | 🟡 |
| **❌ Failed** | 0 | 🔴 |
| **Success Rate** | 92.3% | 🟢 |

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

🎉 **No critical issues found!** All tests passed successfully.

## ⚠️ Warnings & Recommendations

### ⚠️ API Key: GOOGLE_GENERATIVE_AI_API_KEY
**Warning:** Not set

**Impact:** System will work but may not be optimal.

**Recommendation:** Consider addressing this for better performance.

### ⚠️ API Key: GOOGLE_API_KEY
**Warning:** Not set

**Impact:** System will work but may not be optimal.

**Recommendation:** Consider addressing this for better performance.

## 🔍 Detailed Test Results

| Test | Status | Message | Timestamp |
|------|--------|---------|-----------|
| AI Config File | ✅ PASS | AI configuration file loaded successfully | 2025-08-24T20:34:42.438Z |
| Prompt Configuration | ✅ PASS | 1 prompts configured | 2025-08-24T20:34:42.439Z |
| Prompt File: nextdoor-research | ✅ PASS | File exists at staging/NextDoor/research/token-optimized-nextdoor-community-moderation-instructions.json | 2025-08-24T20:34:42.439Z |
| Analysis Types | ✅ PASS | 2 analysis types configured: quick, detailed | 2025-08-24T20:34:42.440Z |
| API Key: GOOGLE_GENERATIVE_AI_API_KEY | ⚠️ WARN | Not set | 2025-08-24T20:34:42.440Z |
| API Key: GEMINI_API_KEY | ✅ PASS | Found (39 characters) | 2025-08-24T20:34:42.440Z |
| API Key: GOOGLE_API_KEY | ⚠️ WARN | Not set | 2025-08-24T20:34:42.440Z |
| API Key Status | ✅ PASS | At least one API key is available | 2025-08-24T20:34:42.440Z |
| NODE_ENV | ✅ PASS | Set to: development | 2025-08-24T20:34:42.440Z |
| GUIDELINES_URL | ✅ PASS | Set to: https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md | 2025-08-24T20:34:42.441Z |
| Directory: protected/prompts | ✅ PASS | Directory exists | 2025-08-24T20:34:42.441Z |
| Directory: protected/prompts/staging | ✅ PASS | Directory exists | 2025-08-24T20:34:42.441Z |
| Directory: protected/prompts/staging/NextDoor | ✅ PASS | Directory exists | 2025-08-24T20:34:42.441Z |
| Directory: protected/prompts/staging/NextDoor/json | ✅ PASS | Directory exists | 2025-08-24T20:34:42.442Z |
| Directory: api | ✅ PASS | Directory exists | 2025-08-24T20:34:42.442Z |
| Directory: api/utils | ✅ PASS | Directory exists | 2025-08-24T20:34:42.442Z |
| Directory: public | ✅ PASS | Directory exists | 2025-08-24T20:34:42.442Z |
| File: protected/prompts/ai.json | ✅ PASS | File exists | 2025-08-24T20:34:42.442Z |
| File: api/utils/guidelines.js | ✅ PASS | File exists | 2025-08-24T20:34:42.443Z |
| File: api/utils/ai.js | ✅ PASS | File exists | 2025-08-24T20:34:42.443Z |
| File: package.json | ✅ PASS | File exists | 2025-08-24T20:34:42.443Z |
| Cache Status | ✅ PASS | Cache initialized: {
  "hasCache": false,
  "source": null,
  "age": null,
  "config": {
    "url": "https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/NextDoor-Guidelines-content.md",
    "cacheTimeout": 3600000,
    "timeout": 10000
  }
} | 2025-08-24T20:34:42.445Z |
| Guidelines Loading | ✅ PASS | Guidelines loaded (957 characters) | 2025-08-24T20:34:42.445Z |
| Display Guidelines | ✅ PASS | Display guidelines available (4738 characters) | 2025-08-24T20:34:42.533Z |
| Quick Analysis Prompt | ✅ PASS | Built successfully (5681 characters) | 2025-08-24T20:34:42.547Z |
| Detailed Analysis Prompt | ✅ PASS | Built successfully (5681 characters) | 2025-08-24T20:34:42.552Z |

## 📈 Performance Analysis

- **Overall Health:** 🟢 Excellent
- **Critical Systems:** 🔴 Some Critical Systems Have Issues
- **File System:** 🟢 File System Healthy

## 🛠️ Next Steps

1. **System Ready:** All critical tests passed successfully
2. **Optional Improvements:** Consider addressing warnings for optimal performance
3. **Status:** Ready for production use
4. **Optional Improvements:** Address 2 warning(s) for better performance
5. **Impact:** Warnings don't prevent operation but may affect performance

## 📄 Report Files

This report is available in multiple formats:
- **Markdown:** `guidelines-test-report-2025-08-24T20-34-42.md`
- **JSON:** `guidelines-test-report-2025-08-24T20-34-42.json`
- **Console:** The colored output above

---

*Report generated by Community Moderation Tool Guidelines Test Suite*  
*Last updated: 8/24/2025, 1:34:42 PM*

---

## Last Updated
- **Date**: 08-28-2025
- **Version**: v0.8.50-alpha
- **Status**: Documentation updated for version 0.8.50-alpha
- **Next Action**: Ready for production deployment