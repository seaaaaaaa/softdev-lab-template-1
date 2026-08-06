/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  // Mirrors the "@/*" path alias from tsconfig.json so tests resolve it too.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  coverageReporters: ["json-summary", "text", "lcov"],
};

export default jestConfig;
