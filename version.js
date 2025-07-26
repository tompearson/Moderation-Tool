// Centralized version management
// This file serves as the single source of truth for version information

const VERSION = {
  number: '0.8.5-alpha',
  major: 0,
  minor: 8,
  patch: 5,
  prerelease: 'alpha',
  full: '0.8.5-alpha'
};

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERSION;
}

// Export for ES modules
if (typeof exports !== 'undefined') {
  exports.VERSION = VERSION;
}

// Export for browser/global use
if (typeof window !== 'undefined') {
  window.APP_VERSION = VERSION;
}

// Default export for ES modules (only if ES modules are supported)
if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
  module.exports = VERSION;
} 