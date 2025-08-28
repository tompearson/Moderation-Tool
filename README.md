# Community Moderation Tool - User Guide

*Last Updated: August 24, 2025*

The Community Moderation Tool is designed to be simple and effective. Start with Quick Analysis for routine decisions, and use Detailed Analysis when you need full context. The debug features help you understand how the AI makes decisions, making you a more effective moderator.

<div align="center">
  <img src="protected\Content\graphics/Screenshot 2025-08-23 123156.jpg" alt="Community Moderation Tool Interface" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
  <p><em>The Community Moderation Tool interface showing the main workspace for moderating content</em></p>
</div>

## ⚠️ Important Disclaimer

**AI Response Reliability**: While this tool provides AI-powered moderation analysis, AI responses may occasionally contain errors, inconsistencies, or unexpected behavior. The AI analysis is intended to assist your decision-making process, not replace human judgment.

**Use Your Own Judgment**: Always review the AI's recommendations carefully and apply your own judgment when handling flagged content. Consider the context, community standards, and specific circumstances of each case. The final moderation decision and responsibility rests with you as the human moderator.

**Tool Limitations**: This tool is designed to support moderation workflows but should not be used as the sole basis for content decisions. Use it as part of a broader moderation strategy that includes human oversight and community guidelines.

## 📱 Responsive Design & Device Compatibility

**Universal Access**: The Community Moderation Tool is built with responsive design principles and works seamlessly across all device types and screen sizes.

### **Supported Devices:**
- **🖥️ Desktop Computers** - Full-featured experience with large screens
- **💻 Laptops** - Optimized for productivity and portability  
- **📱 Mobile Phones** - Touch-friendly interface for on-the-go moderation
- **📱 Tablets** - Perfect balance of portability and screen real estate
- **🖥️ Smart TVs** - Accessible for team collaboration and training

### **Responsive Features:**
- **Adaptive Layout** - Automatically adjusts to your screen size
- **Touch-Friendly** - Optimized for mobile and tablet interactions
- **Readable Text** - Scales appropriately for all device types
- **Efficient Navigation** - Streamlined interface for small screens
- **Cross-Platform** - Works in any modern web browser

### **Mobile Moderation:**
Perfect for moderators who need to review content while away from their desk. The mobile interface maintains all core functionality while ensuring ease of use on smaller screens.

## 🚀 Getting Started

The Community Moderation Tool is ready to use! Simply open the application in your web browser to start moderating content.

## 🏠 Home Screen Overview

The home screen is your main workspace for moderating community content. Here's what you'll see:

### Main Interface Elements

- **Flagged Post Content**: Large text box where you paste the content you want to moderate
- **Analysis Buttons**: Select which button you want to click depending on what type of analysis you desire:
  - **Quick Analysis**: Fast decision with brief reasoning (under 300 characters)
  - **Detailed Analysis**: Comprehensive analysis with full explanation (up to 2000 characters)

- **Results Display**: Shows the AI's moderation decision and reasoning

### Additional Features

- **Save AI Prompt**: Downloads the complete AI prompt used for analysis (debug feature)
- **Download AI Prompt**: Saves the AI prompt to a local file (debug feature)

## 📝 How to Use the App

### Step 1: Get text into the app
1. Text from a moderation team associated with a social media platform
   - Copy text from the external app and paste it to the Flagged Post Content area by clicking the Paste Content Button
2. Or it can be adhoc content you want to evaluate. Just type it in

### Step 2: Choose Analysis Type
- **Quick Analysis**: Use when you need a fast decision
  - Best for: Urgent moderation decisions
  - Response: Brief decision + key rule violations
  - Character limit: 300 characters
  
- **Detailed Analysis**: Use when you need full reasoning
  - Best for: Complex cases, training, documentation
  - Response: Complete decision + detailed reasoning + rule citations
  - Character limit: 2000 characters

### Step 3: Run Moderation
1. Click either the **"Quick Analysis"** or **"Detailed Analysis"** button based on your chosen analysis type
2. Wait for the AI to analyze the content (usually 2-5 seconds)
3. Review the results displayed in the **"Moderation Results"** area of the screen

## 📊 Understanding Results

### Decision Types
The AI will return one of these decisions:

- **✅ Allow**: Content meets community guidelines
- **🚫 Remove**: Content violates community guidelines
- **⚠️ Maybe Remove**: Borderline case requiring human judgment

### Result Information
Each result includes:
- **Decision**: The AI's recommendation
- **Reasoning**: Explanation of why the decision was made
- **Rules Cited**: Specific community guidelines that apply
- **Source**: Indicates the analysis type used

## 🔧 Debug Features

### Save AI Prompt
- **Purpose**: See exactly what instructions the AI received
- **Use Case**: Debug unexpected AI behavior, verify prompt content
- **Output**: Downloads a text file with the complete AI prompt

### Download AI Prompt
- **Purpose**: Save AI prompts for later analysis
- **Use Case**: Training, documentation, troubleshooting
- **Output**: Saves to local debug folder with timestamp

## 🎯 Best Practices

### For Quick Analysis
- Use for routine moderation decisions
- Perfect for high-volume content screening
- Results are concise and actionable

### For Detailed Analysis
- Use for complex or controversial content
- Helpful for training new moderators
- Provides complete reasoning for documentation

### AI Reliability and Human Judgment
- **Always review AI recommendations** before making final decisions
- **Consider context** that the AI might not understand
- **Apply community standards** and local knowledge
- **Use AI as a tool**, not as the final authority
- **Trust your judgment** when AI recommendations seem questionable

## 🚨 Troubleshooting

### Common Issues

**"Failed to moderate content"**
- Check if the backend server is running
- Verify your internet connection
- Try refreshing the page

**"AI models are currently unavailable"**
- Check your internet connection
- Try refreshing the page
- Contact support if the issue persists

**Unexpected AI responses**
- Use the "Save AI Prompt" feature to see what the AI received
- Check the debug logs in the terminal
- Verify your prompt files are properly configured

**AI response errors or inconsistencies**
- Remember the disclaimer: AI responses may contain errors
- Use your own judgment to evaluate the content
- Consider the context that the AI might not understand
- Apply community standards and local knowledge
- Don't rely solely on AI recommendations for critical decisions

### Getting Help

1. **Use debug features** to see what the AI is receiving
2. **Try refreshing the page** if you encounter issues
3. **Contact support** if problems persist

## 🔄 Troubleshooting Tips

### When to Refresh
- If the AI stops responding correctly
- If you see unexpected behavior
- If the page seems unresponsive

### How to Refresh
Simply refresh your browser page (F5 or Ctrl+R) to reset the application.

## 📁 Debug Files

- **Debug Files**: Automatically saved to the `debug/` folder when you use the Save/Download features
- **AI Prompts**: These files help you understand how the AI makes decisions

## 🎉 You're Ready!

---

*For technical support or feature requests, check the project documentation or contact the development team.* 