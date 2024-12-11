/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  // preset: 'ts-jest/presets/default-esm',
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  moduleNameMapper: {
    "^react-router-dom$": "<rootDir>/node_modules/react-router-dom"
  }
};