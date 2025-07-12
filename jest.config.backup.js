const const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom", // Default for React components
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
  coverageDirectory: "coverage",
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Login Form Test Results",
        outputPath: "./test-results/test-report.html",
        includeFailureMsg: true,
        includeSuiteFailure: true,
        theme: "darkTheme", // or "lightTheme"
      },
    ],
  ],
};equire("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom", // Default for React components
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageDirectory: "coverage",
};

module.exports = createJestConfig(customJestConfig);
