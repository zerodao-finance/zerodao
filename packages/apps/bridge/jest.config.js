const config = {
  verbose: true,
  testMatch: [
    "**/__tests__/*.test.js?(x)",
    "**/__tests__/interfaces/*.test.js?(x)",
    "**/__tests__/steps/*.steps.js",
  ],
  testEnvironment: "jsdom",
};

module.exports = config;
