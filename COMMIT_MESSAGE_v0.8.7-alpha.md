fix: improve responsive design for mobile and fix AI model display

FEATURES:
- Add comprehensive responsive design improvements for small screens
- Implement better mobile UX with touch-friendly buttons
- Add responsive breakpoints for phones (≤480px) and tablets (≤768px)
- Improve modal responsiveness for mobile devices

FIXES:
- Fix missing AI model information in moderation response
- Resolve header layout issues on small screens
- Fix button stacking and spacing on mobile devices
- Correct modal sizing and scrolling for small screens
- Remove character limit numbers from "Moderation Result" heading
- Add proper touch targets (44px minimum) for mobile buttons

IMPROVEMENTS:
- Add responsive text sizing for different screen sizes
- Implement better spacing and padding for mobile layouts
- Add iOS zoom prevention with 16px font-size on focus
- Improve button accessibility with better touch targets
- Add overflow handling for modal content
- Optimize form elements for mobile interaction
- Add responsive character info display

MOBILE UX ENHANCEMENTS:
- Stack buttons vertically on mobile for better usability
- Reduce padding and margins for maximum content area
- Add responsive version number positioning
- Implement better modal close button for touch devices
- Add responsive textarea sizing for mobile input
- Improve copy button layout for mobile screens

TECHNICAL IMPROVEMENTS:
- Add CSS media queries for extra small screens (≤480px)
- Implement responsive grid layouts for mobile
- Add webkit appearance resets for form elements
- Add tap highlight removal for cleaner mobile interaction
- Optimize modal content scrolling for small screens

FILES MODIFIED:
- src/index.css (comprehensive responsive design improvements)
- src/App.jsx (removed character limit from heading)
- api/moderate.js (fixed AI model information in response)

This release significantly improves the user experience on mobile devices
and small browser windows, making the moderation tool much more accessible
and usable across all device sizes. 